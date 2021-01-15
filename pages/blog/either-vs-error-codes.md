---
title: "Error Handling in C++ or: Why You Should Use Eithers in Favor of Exceptions and Error-codes"
banner: "/posts/forrest.jpeg"
author: "Team Buckaroo"
created: "2017-05-16T11:00:00.000Z"
---

## TL;DR

Consider using an Either type to handle errors as they lift the error into the type-system and have the same performance characteristics as error-codes.

### Either Implementations

* [loopperfect/neither](https://github.com/loopperfect/neither)

* [std::expected](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2014/n4109.pdf)

* [boost::expected](https://ned14.github.io/boost.outcome/md_doc_md_02-tutorial_a.html)

* [beark/ftl](https://github.com/beark/ftl)

## Introduction

Programming language design is always a matter of trade-offs. In the case of C++, the designers optimized for two things: *runtime efficiency* and *high-level abstraction*. This gives the C++ programmer huge flexibility in many areas, one of which is error handling.

## Exceptions & Try-Catch

Try-catch is traditionally seen as the most idomatic error-handling method in C++.

```cpp

#include <iostream>
#include <string>

int divide(int x, int y) {
  if (y == 0) {
    throw std::string("Divide by zero");
  }
  return x / y;
}

int main() {
  try {
    std::cout << "4/2 " << divide(4, 2) << std::endl;
    std::cout << "3/0 " << divide(3, 0) << std::endl;
  } catch(std::string e) {
    std::cout << e << std::endl;
  }
  return 0;
}
```

### Exception Overhead

The try-catch language feature is not zero-cost and the exact price is determined by the compiler implementation. Implementers can choose between increased code-size and increased run-time overhead, both in the success branch and the failure branch.

In most C++ implementations, an interesting choice has been made: code in the try block runs as fast as any other code. However, dispatching to the catch block is orders of magnitude slower. This penalty grows linearly with the depth of the call-stack.

If exceptions make sense for your project will depend on the frequency at which exceptions will be thrown. If the error rate is above 1%, then the overhead will likely be greater than that of alternative approaches. ([Source](https://youtu.be/XVofgKH-uu4?t=1h2m24s))

Exceptions are not supported by all platforms, and methods that throw cannot be easily understood by C.

### Ergonomics

Exceptions are very easy to use and fairly easy to reason about. You can throw and catch exceptions at any point in your code, and the exception can even be an arbitrary type.

The biggest drawback is that handling exceptions is not enforced by the type-system. Unlike, Java, for example, where exceptions must be caught by the caller, catching a C++ exception is optional. This means spotting all the unhandled exceptions during a code review will be challenging, and requires deep knowledge of all of the functions called.

### But what about noexcept and throw?

A common misconception is that annotating functions with noexcept or throw can help.

```cpp

int compute(int x) noexcept {
  return x;
}

int compute(int x) throw(std::exception) {
  return x;
}
```

Unfortunately, noexcept and throw simply dictate that a call to std::terminate is made in the case where an unmentioned exception is thrown. *This does not enforce any exception-handling at compile-time.*

For example, these will compile and throw a run-time error!

```cpp
int foo() throw(int) {
  throw "bar";
  return 1;
}

int bar() noexcept {
  throw 42;
  return 1;
}

// These compile fine, but on execution std::terminate is called and the program exits
int main() {
  try {
    int x = foo();
  } catch(...) {
    
  }
}

int main() {
  try {
    int x = bar();
  } catch(...) {
    
  }
}
```

## Error-codes

Error-codes are ancient and used *everywhere*. For simplicity, let’s assume error-codes are just integers, but they could be implemented as type-safe enums or even complex objects. For this discussion it won’t really matter.

There are 3 common forms of error-code implementations.

### 1. Error-codes as Return Values

This pattern is found in many C APIs as it is easy to implement and has no performance overhead, besides the error-handling itself.

```cpp
const int ERROR = 1;
const int SUCCESS = 0;

int compute(int input, int* output) {
  if (cond(input)) {
    return ERROR;
  } else {
    *output = computeOutput(input);
    return SUCCESS;
  }
}

// Usage
int output;
int input;

if (int error = compute(input, &output)) {
  error_handler(error);
}
```

This pattern can be followed very dogmatically and it is easy to verify that all cases have been taken care of in a code-review. It is easy to write a C-friendly API using error-codes.

Unfortunately it has some drawbacks:

* Functional composition is hard. The return value is occupied by the error-code, so the result must be an out-variable, which makes the function impure.

* Out-parameters enforce a memory layout which is not optimizer friendly.

* Separating error-handling from the computation is difficult.

* Postponing error-handling requires the programmer to thread the error-code through the call-graph.

### 2. Error-code as out-parameter

Swapping the semantics of the out-parameter and return value has no significant advantages, except perhaps a slightly cleaner API. In the case where the error-code can be omitted, the API usage is simplified and functional compositionality is made easier.

This approach can be found in boost::asio (in fact boost::asio even makes it optional and falls back to throwing exceptions if no out-parameter is provided).

### 3. Error Singletons

Error singletons have completely different ergonomics. They are mostly found in low-level libraries that are implementing a system-global state-machine, such as a driver. One prominent example is OpenGL.

Using an error singleton looks like this:

```cpp
int result = compute1(input);
int result2 = compute2(result);

if (has_errors()) {
  std::cout << pop_error_message() << std::endl;
}
```

In this paradigm, the status of the driver must be queried at run-time through a separate function. This appears to give you more freedom since you can query for errors when it is most appropriate, enabling you to better separate concerns. This allows the user to write code that resembles exception-based code, but without the cost of automatic stack unwinding.

Benefits for the API consumer:

* Error-handling can be reduced over time to a minimum

* Having fewer error-handling branches yields better performance

* No out-parameters are required, which increases functional compositionality

* Finalization can be performed manually when errors are found

But there are some big caveats:

* Singletons by design have shared state, thus writing thread-safe code is very hard

* No shortcutting of computation pipelines as no stack-unwinding occurs

* It is not clear which errors may be fired on which api-calls. The programmer must check the documentation.

* The severity of errors, and to recover from them, might be unclear

## So what about Eithers?

An Either type is a container which takes a single value of one of two different types. A simple implementation might look like this:

```cpp

template<class Left, class Right>
struct Either {
  union {
    Left leftValue;
    Right rightValue;
  };
  bool isLeft;
};
```

To run computations on the wrapped value, an Either can provide some useful methods: leftMap, rightMap and join.

* leftMap transforms the leftValue to a new value if present, leaving a rightValue unchanged.

* rightMap transforms the rightValueto a new value if present, leaving a leftValue unchanged.

* join takes a transformation for both sides of the Either where both transformations result in the same type. This allows an Either to be unified and unwrapped.

This is much easier to understand in code!

```cpp
Either<string, int> myEither = left("hello"); // constructs a either containing a leftValue;

int count = myEither
  .rightMap([](auto num) { return num + 1; }) // adds 1 if rightValue is present
  .leftMap([](auto str) { return str + "world"; }) // appends "world" if leftValue is present
  .leftMap([](auto str) { return str.size(); })
  .join(); // both sides have now the same type, lets join...
```

Now we are able to lift the exceptions into the type-system:

```cpp
// This... 
float sqrt(float x) {
  if (x < 0) {
    throw std::string("x should be >= 0");
  }
  return computeSqrt(x);
}

// ... can be transformed into this... 
Either<std::string, float> sqrt(float x) {
  if (x < 0) {
    return left("x should be >=0");
  }
  return right(computeSqrt(x));
}
```

```cpp

// And for the caller, the usage changes from this... 
try {
  float x = sqrt(-1);
  std::cout << "sqrt(x) = " << x << std::endl;
} catch(std::string x) {
  std::cout << "error occurred: " << x << std::endl;
}

// ... to this... 
std::string msg = sqrt(-1)
  .leftMap([](auto msg) { return "error occurred: " + msg; })
  .rightMap([](auto result) { return "sqrt(x) = " + to_string(result); })
  .join();

std::cout << msg << std::endl;
```

### So what have we gained through this simple change?

We no longer need to pay for the overhead of exceptions and we have also encoded the exception-type into the function signature. This documents the error in the source-code and now the compiler will ensure that we handle the types properly.

This is a big deal, and it illustrates how powerful the C++ language is.

### So what are the drawbacks?

First, you will need to add an Either type to you project. It is best not to reinvent the wheel here, and fortunately there are [many](https://github.com/loopperfect/neither) [open-source](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2014/n4109.pdf) [implementations](https://ned14.github.io/boost.outcome/md_doc_md_02-tutorial_a.html) [available](https://github.com/beark/ftl).

But what about performance? At first glance, it seems that every call to leftMap and rightMap will add a branch to the executable. In practice, the compiler is smart enough to optimize these away!

Take a look at [this Compiler Explorer project](https://godbolt.org/g/5f6mT9); the branches of the various map calls dissappear.

For example, you might have noticed the following identity:

```cpp
e.leftMap(f).leftMap(g) == e.leftmap([](auto x){ return g(f(x)); })
```

And it turns out that the compiler does too. It combines both lambdas to inline the whole expression. After the optimization step, all abstractions are collapsed. Once complied, there is no significant difference between the error-code implementations and the either-based implementations.

## Conclusion

Consider using an Either type to handle errors. They lift the error into the type-system, making them safer than exceptions whilst yielding the same performance characteristics as error-codes.

## Resources

### Either Implementations

* [loopperfect/neither](https://github.com/loopperfect/neither)

* [std::expected](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2014/n4109.pdf)

* [boost::expected](https://ned14.github.io/boost.outcome/md_doc_md_02-tutorial_a.html)

* [beark/ftl](https://github.com/beark/ftl)

### Benchmarking Error-codes vs Exceptions vs Eithers

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/XVofgKH-uu4" frameborder="0" allowfullscreen></iframe></center>

### Return Values vs Out-Parameters

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/eR34r7HOU14" frameborder="0" allowfullscreen></iframe></center>

### Some Code Samples

* Gist: [https://gist.github.com/nikhedonia/db401285d9f3816e2a74d78c68dd4c6c](https://gist.github.com/nikhedonia/db401285d9f3816e2a74d78c68dd4c6c)

* Assembly: [https://godbolt.org/g/5f6mT9](https://godbolt.org/g/5f6mT9)
