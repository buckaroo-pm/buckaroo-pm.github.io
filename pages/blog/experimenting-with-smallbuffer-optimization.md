---
title: "Experimenting with Small Buffer Optimization for C++ Lambdas"
banner: "/posts/smallfun.jpeg"
author: "Team Buckaroo"
created: "2017-09-19T11:00:00.000Z"
attribution: "Photo by Pascal Richier on Unsplash"
---

We implemented SmallFun, an alternative to std::function, which implements *fixed-size capture optimization* (a form of small buffer optimization). Whilst SmallFun is a bit less generic than std::function, it is **3–5x faster** in some benchmarks.

You can [view the code on GitHub](https://github.com/LoopPerfect/smallfunction).

![Photo by [Pascal Richier](https://unsplash.com/photos/ECju13NcBzg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)](https://cdn-images-1.medium.com/max/3840/1*Q2X85fCAiULppjBiV9SC5A.jpeg)*Photo by [Pascal Richier](https://unsplash.com/photos/ECju13NcBzg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*

## Background

std::function is a convenient way to store lambdas with closures (also known as captures), whilst providing a unified interface. If you are coming from the OOP world, then it might be helpful to understand them as a generalization of the [strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern).

Before std::function and lambdas, we would create a hand-crafted functor object like this:

```cpp
struct Functor {
  // The context, or capture
  // For example, an int and an unsigned
  int i;
  unsigned N;
  
  // The lambda
  int operator() (int j) const {
    // For example, a small math function
    return i * j + N;
  }
};
```

This repository compares std::function, the hand-crafted Functor and SmallFun. We find that SmallFun performs better then std::function by being slighly less generic.

## The Missed Opportunity of std::function

std::function uses a [PImpl pattern](http://en.cppreference.com/w/cpp/language/pimpl) to provide an unified interface aross all functors for a given signature.

For example, these two instances f and g have the same size, despite having different captures:

```cpp
int x = 2;
int y = 9;
int z = 4;

// f captures nothing
std::function<int(int)> f = [](int i) {
  return i + 1;
};

// g captures x, y and z
std::function<int(int)> g = [=](int i) {
  return (i * (x + z)) + y;
};
```

This is because std::function stores the capture on the *heap*. This unifies the size of all instances, but it is also an opportunity for optimization!

## How?

Instead of dynamically allocating memory on the *heap*, we can place the function object (including its virtual table) into a preallocated location on the *stack*.

This is how we implemented SmallFun, which is used much like std::function:

```cpp
// A SmallFun with a size of 64 bytes
SmallFun<unsigned(int const j), 64> f = [i, N] (int j) {
  return i * j + N;
};
```

## Benchmarks

| Test          |    Time    | Note |
|---------------|------------|---------------------------------------|
| functor       |    191 ns  | Baseline that's the best we could do: a hand-crafted functor |
| sf32          |    312 ns  | This is big enough to store 2 ints   |
| sf64          |    369 ns  | |
| sf128         |    346 ns  | |
| sf256         |    376 ns  | |
| sf512         |    503 ns  | |
| sf1024        |    569 ns  | |
| sf2048        |    870 ns  | |
| std::function |   1141 ns  | |

## The Test

To test how quickly we can allocate and call functors, we will be saving all the many instances in a vector and executing them in a loop. The results are saved into another vector to ensure that the optimizer does not optimize away what we are testing.

```cpp

void stdFunction(benchmark::State& state) {
 
  unsigned N = 100;
 
  std::vector<std::function<unsigned(int const j)>> fs(N);
  std::vector<int> r(N);
 
  while (state.KeepRunning()) {
    
    for (int i = 0; i < N; ++i) {
      fs[i] = [i, N] (int j) { // assign to the type-erased container
        return i * j + N;
      };
    };
    
    int j = 0;
    std::transform(fs.begin(), fs.end(), r.begin(), [&](auto const& f) {
      return f(j++); // eval the function objects
    });
  }
}
```

## SmallFun Implementation Details

To implement SmallFun, we need to combine three C++ patterns: [type-erasure](https://akrzemi1.wordpress.com/2013/11/18/type-erasure-part-i/), [PImpl](http://en.cppreference.com/w/cpp/language/pimpl) and [placement-new](https://stackoverflow.com/a/222578/1256041).

### Type-erasure

Type-erasure unifies many implementations into one interface. In our case, every lambda (or functor) has a custom call operator and destructor. We need to automatically generate an implementation for any type the API consumer will be using.

This shall be our public interface:

```cpp
template<class ReturnType, class...Xs>
struct Concept {
  virtual ReturnType operator()(Xs...) const = 0;
  virtual ReturnType operator()(Xs...) = 0;
  virtual ~Concept() {};
};
```

And for any callable type with a given signature:

```cpp
template<class F, class ReturnType, class...Xs>
struct Model final : Concept<ReturnType, Xs...> {
  
  F f;
  
  Model(F const& f)
    : f(f) {}
    
  virtual ReturnType operator()(Xs...xs) const {
    return f(xs...);
  }
  
  virtual ReturnType operator()(Xs...xs) {
    return f(xs...);
  }
  
  virtual ~Model() {}
};
```

Now we can use it the following way:

```cpp
auto lambda = [](int x) { return x; };
using lambdaType = decltype(lambda);
SFConcept<int, int>* functor = new Model<lambdaType, int, int>(lambda);
```

This is quite cumbersome and error prone. The next step will be a container.

### PImpl

PImpl seperates, hides, manages the lifetime of an actual implementation and exposes a limited public API.

A straightforward implementation could look like this:

```cpp

template<class ReturnType, class...Xs>
class Function<ReturnType(Xs...)> {
  std::shared_ptr<Concept<ReturnType,Xs...>> pimpl;
  
public:
  Function() {}

  template<class F>
  Function(F const& f)
    : pimpl(new SFModel<F, ReturnType, Xs...> ) // heap allocation
  {}
 
  ~Function() = default;
};
```

This is more or less how std::function is implemented.

So how do we remove the heap allocation?

### Placement-new

Placement-new allocates memory at a given address. For example:

```cpp

char memorypool[64];

int* a = new (memorypool) int[4];
int* b = new (memorypool + sizeof(int) * 4) int[4];

assert( (void*)a[0] == (void*)memorypool[0] );
assert( (void*)b[0] == (void*)memorypool[32] );
```

### Putting it All Together

Now we only need to do minor changes to remove the heap allocation:

```cpp

template<class ReturnType, class...Xs>
class SmallFun<ReturnType(Xs...)> {

  char memory[SIZE];
  
public:
  template<class F>
  SmallFun(F const& f) 
    : new (memory) Model<F, ReturnType, Xs...> {
    assert( sizeof(Model<F, ReturnType, Xs...>) < SIZE ); 
  }
 
  ~SmallFun() {
    if (allocated) {
      ((concept*)memory)->~concept();
    }
  } 
};
```

As you may noticed, if the Model<...>’s size is greater than SIZE, bad things will happen! An assert will only catch this at run-time, when it is to late… Luckily, this can be caught at compile-time using enable_if_t.

But first, what about the copy constructor?

### Copy Constructor

Unlike the implementation of std::function, we cannot just copy or move a std::shared_ptr. We also cannot just copy bitwise the memory, since the lambda may manage a resource that can only be released once due to a side-effect. Therefore, we need to make the model able to copy-construct itself for a given memory location.

We just need to add:

```cpp
  // ...

  virtual void copy(void* memory) const {
    new (memory) Model<F, ReturnType, Xs...>(f);
  }

  template<unsigned rhsSize, std::enable_if_t<(rhsSize <= size), bool> = 0>
  SmallFun(SmallFun<ReturnType(Xs...), rhsSize> const& rhs) {
    rhs.copy(memory);
  }
 
  // ...
```

## Further Remarks

* As we saw, we can verify at compile-time if a Lambda will fit in our memory. If it does not, we could provide a fallback to heap allocation.

* A more generic implementation of SmallFun would take a generic allocator.

* We noticed that we cannot copy the memory just by copying the memory bitwise. However using type-traits, we could check if 
the underlying data-type is POD and then copy bitwise.

## Since You’re Here…

We created [Buckaroo](https://github.com/LoopPerfect/buckaroo) to make it easier to integrate C++ libraries. If you would like try it out, the best place to start is [the documentation](http://buckaroo.readthedocs.io/en/latest/). You can browse the existing packages on [Buckaroo.pm](https://buckaroo.pm/) or request more over on [the wishlist](https://github.com/LoopPerfect/buckaroo-wishlist).
[**Approaches to C++ Dependency Management, or Why We Built Buckaroo**
*C++ is an unusual language in that it does not yet have a dominant package manager (we’re working on it!). As a result…*hackernoon.com](https://hackernoon.com/approaches-to-c-dependency-management-or-why-we-built-buckaroo-26049d4646e7)
[**Error Handling in C++ or: Why You Should Use Eithers in Favor of Exceptions and Error-codes**
*TL;DR*hackernoon.com](https://hackernoon.com/error-handling-in-c-or-why-you-should-use-eithers-in-favor-of-exceptions-and-error-codes-f0640912eb45)
