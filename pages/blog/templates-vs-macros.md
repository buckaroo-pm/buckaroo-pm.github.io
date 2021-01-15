---
title: "Comparing the Compilation Times of C++ Templates and Macros"
created: "2017-06-02T11:00:00.000Z"
author: Team Buckaroo
summary: "For our example, templates compile faster than generated code. With a few tricks, they are also faster for incremental builds."
banner: "/posts/templates-vs-macros.jpeg"
---

## TL;DR

For our example, templates compile faster than generated code. With a few tricks, they are also faster for incremental builds.

## Introduction

Templates are a polarizing feature of C++. On the one hand, people love the ability to squeeze out extra performance and add syntactic sugar to their projects. On the other, some argue that they are slow to compile, bloat binaries and give incomprehensible error messages.

This article will look at one common use-cases of templates and determine if compile times are improved by using code-generation rather than templates.

## Simple Vector Class

We’re going to look at a simple vector class with a size determined at compile-time. The usage of this class might look like this:

```cpp
// Create a vector of 10 elements, all initialized to 0
auto v = Vector<10>(0);

// Set the 1st element to 7
v[0] = 7;

// Set the 9th element to 3
v[8] = 3;

// Print the sum of all elements
std::cout << v.sum() << std::endl;

// Error!
v[10] = 2;
```

The implementation is quite simple: we have a regular C++ struct with one type parameter for the length of the vector:

```cpp
template<int D>
struct Vector {
  static constexpr unsigned N = D;
  int data[N];
  
  Vector(Vector<D> const& v) {
    for (int i = 0; i < N; ++i) {
      data[i] = v[i];
    }
  }

  Vector(int fill = 0) {
    for (int i = 0; i < N; ++i) {
      data[i] = fill;
    }
  }

  int sum() const {
    int result = 0;
    for (int i = 0; i < N; ++i) {
      result += data[i];
    }
    return result;
  }

  int* begin() { return &data[0]; }
  int* end() { return &data[N]; }

  int const* begin() const { return &data[0]; }
  int const* end() const { return &data[N]; }

  int& operator[] (unsigned const& i) {
    if (N <= i) throw "out of bound";
    return data[i];
  }

  int const& operator[] (unsigned const& i) const {
    if (N <= i) throw "out of bound";
    return data[i];
  }
};
```

However, we could also implement this class using the preprocessor!

```cpp

#define CREATE_VECTOR(D) \
struct Vector_##D {\
  static constexpr int N = D;\
  int data[N];\
\
  Vector_##D (Vector_##D const& v) {\
    for(int i=0; i<N ; ++i) {\
      data[i] = v[i];\
    }\
  }\
\

// etc...
```

These two implementations give us equivalent functionality. However, for a given size N, the first generates a vector class using templates and the second using macros.

**The question is: which compiles faster?**

To compare the two approaches, we wrote a small code snippet that uses vector classes from length 0 to 256. We also tested another approach, where we took the macro implementation but ran the preprocessor *before* the test. This is equivalent to writing every class by hand!

We compiled each version 100 times and measured how long it took. Here are the results:

| CXX | Macros | Preprocessed Macros  | Templates 
| --- | --- | --- | --- |
| clang 4.0 | 40s | 37s | 30s |
| g++ 6.2 | 61s | 66s | 48s |

### Conclusion

The results show that for this example, *compiling templates is faster than the equivalent macro version*! On top of that, templates are more maintainable, since the code is not duplicated, and the compiler can give better error messages.

If you consider how templates work, then this makes a great deal of sense. Instantiating a template is just a replacement of its template-parameters with concrete values or types. With code generation, we must parse the C++ and build the AST from scratch for each macro-result.

**But What About Incremental Builds?**

This test leaves out incremental builds. One advantage of using code-generation (it is claimed!) is that implementation of each vector class can be put inside of its own translation-unit, meaning that it does not have to be recompiled every time that it is used.

However, we can achieve the same effect using templates! C++ 11 introduced the extern template construct, which tells the compiler that a template is compiled in another translation-unit:

```cpp

// Vector<16> is in another binary
extern template class Vector<16>;
```

`extern template` is like a forward declaration for templates.

We can use this construct to pull the most common template instantiations into their own translation-unit, dramatically decreasing incremental build times.

```cpp

#include <vector.hpp>

// Instantiation of common sizes
template class Vector<16>;
template class Vector<32>;
template class Vector<64>;
template class Vector<128>;
```

And we extern template the common cases in the vector header to prevent consumers from compiling their own version.

```cpp
// ...
// Vector class above

// Forward declaration of common sizes
extern template class Vector<16>;
extern template class Vector<32>;
extern template class Vector<64>;
extern template class Vector<128>;
```

We then ran an incremental build (vector.cpp already compiled). The results speak for themselves:

| CXX | Templates | Templates with Forward Decls |
| --- | --- | --- |
| clang 4.0 | 30s | 12s compile + 16s link |
| g++ 6.2 | 48s | 14s compile + 12s link |

Next time you are trying to improve your incremental build times, consider forward declaring your templates!

![](https://cdn-images-1.medium.com/max/2272/1*0hqOaABQ7XGPT-OYNgiUBg.png)

![](https://cdn-images-1.medium.com/max/2272/1*Vgw1jkA6hgnvwzTsfMlnpg.png)

![](https://cdn-images-1.medium.com/max/2272/1*gKBpq1ruUi0FVK2UM_I4tQ.png)
> [Hacker Noon](http://bit.ly/Hackernoon) is how hackers start their afternoons. We’re a part of the [@AMI](http://bit.ly/atAMIatAMI) family. We are now [accepting submissions](http://bit.ly/hackernoonsubmission) and happy to [discuss advertising & sponsorship](mailto:partners@amipublications.com) opportunities.
> If you enjoyed this story, we recommend reading our [latest tech stories](http://bit.ly/hackernoonlatestt) and [trending tech stories](https://hackernoon.com/trending). Until next time, don’t take the realities of the world for granted!

![](https://cdn-images-1.medium.com/max/30000/1*35tCjoPcvq6LbB3I6Wegqw.jpeg)
