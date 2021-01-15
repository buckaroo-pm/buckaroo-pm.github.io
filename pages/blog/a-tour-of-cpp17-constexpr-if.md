---
title: "A Tour of C++ 17: If Constexpr"
created: "2017-05-31T22:00:00.000Z"
author: Team Buckaroo
banner: "/posts/tour2017.jpeg"
---

We are excited to see that if-constexpr has made it into C++ 17! In this post, we will look at some C++ 14 code and show how we can make it simpler and more concise using this new language feature.

## Introduction

Before diving into **if-constexpr**, it might be useful to have a quick recap of constexpr. Introduced in C++ 11, constexpr is a keyword that marks an expression or function as having a *compile-time constant result*.

```cpp
constexpr int square(int x) { 
  return x * x;
}

int main() {
    return square(4);
}
```

And, of course, this will optimized away by the compiler:

```nasm
main: 
    mov     eax, 16
    ret
```

OK, so you might be wondering what the purpose of `constexpr` is. After all, isn’t the compiler smart enough to optimize functions like this, even when they are not marked as `constexpr`?

The real value of `constexpr` is as a *guarantee* that the function will be computable at compile-time. This prevents nasty side-effects sneaking into your code as it evolves, and it allows the compiler to do some clever things:

* Unlike templates and preprocessor macros, `constexpr` allows for loops and recursion at compile-time without extreme boilerplate.

* `constexpr` functions can be used as regular functions, although internally they have greater restrictions.

* `constexpr` functions can easily be converted into regular functions as requirements change.

* `constexpr` functions compile much quicker than the equivalent template-based solutions, which scale linearly with the depth of the template-recursion.

### Compile-time Fibonacci

As an example, take a look at these two compile-time implementations of the Fibonacci sequence:

```cpp

template<unsigned n>
struct Fibonacci {
  static const unsigned value = Fibonacci<n - 1>::value + Fibonacci<n - 2>::value;
};

template<>
struct Fibonacci<0> {
  static const unsigned value = 0;
};

template<>
struct Fibonacci<1> {
  static const unsigned value = 1;
};

int main() {
  return Fibonacci<5>::value;   
}
```

```cpp
constexpr unsigned fibonacci(const unsigned x) {
  return x <= 1 ? 
    1 : 
    fibonacci(x - 1) + fibonacci(x - 2);
}

int main() {
  return fibonacci(5);
}
```

### So what is **if-constexpr**?

In short, **if-constexpr** extends the compile-time subset of the C++ language to include if-statements. What’s more, if a branch of the **if-constexpr** is not hit, then it will not even be compiled.

With **if-constexpr** at your disposal, you don’t need to resort to elaborate meta-programming techniques like template pattern-matching and SFINAE.

Let’s look at some examples.

## Example 1 — getting the nth-arg

Many template meta-programs operate on variadic-type-lists. In C++ 14, getting the nth-type of an argument lists is often implemented using complex templating:

```cpp
template<unsigned n>
struct Arg {
 template<class X, class...Xs>
 constexpr auto operator()(X x, Xs...xs) {
   return Arg<n - 1>{}(xs...);
 }
};

template<>
struct Arg<0> {
 template<class X, class...Xs>
 constexpr auto operator()(X x, Xs...) {
   return x;
 }
};

template<unsigned n>

constexpr auto arg = Arg<n>{};

// arg<2>(0, 1, 2, 3, 4, 5) == 2;
```
C++ 17 makes this much more intuitive:

```cpp
template<unsigned n>
struct Get {
 template<class X, class…Xs>
 constexpr auto operator()(X x, Xs…xs) {
   if constexpr(n > sizeof…(xs) ) {
     return;
   } else if constexpr(n > 0) {
     return Get<n-1>{}(xs…);
   } else {
     return x;
   }
 }
};
```

## Example 2 — API-shimming

Sometimes you want to support an alternative API. C++ 14 provides an easy way to check if an object can be used in a certain way:

```cpp
template<class T>
constexpr auto supportsAPI(T x) -> decltype(x.Method1(), x.Method2(), true_type{}) {
 return {};
}
constexpr auto supportsAPI(...) -> false_type {
 return {};
}
```

Then, implementing custom behaviour in C++ 14 can be done like this:

```cpp
template<class T>
auto compute(T x) -> decltype( enable_if_t< supportsAPI(T{}), int>{}) {
 return x.Method();
}

template<class T>
auto compute(T x) -> decltype( enable_if_t<!supportsAPI(T{}), int>{}) {
 return 0;
}
```

The C++17 equivalent is much less verbose:

```cpp
template<class T>
int compute(T x) {
 if constexpr( supportsAPI(T{}) ) {
   // only gets compiled if the condition is true
   return x.Method();
 } else {
   return 0;
 }
}
```

This is very convenient as code that belongs semantically together is not scattered across multiple functions. Furthermore, you can even define lambdas containing **if-constexpr**.

## Example 3 — Compile-time algorithm-picking

Often you need to find the best algorithm based on the properties of a type. There are many solutions. For instance, the STL uses “type tags” to pick the right algorithm for some given iterators:

```cpp
struct FooTag {};
struct BarTag {};

auto foldFF(...) {}
auto foldFB(...) {}
auto foldBF(...) {}
auto foldBB(...) {}

struct A {
 /* ... */
 using tag = FooTag;
};

struct B {
 /* ... */
 using tag = BarTag;
};

template<class L, class R>
auto fold(L l, R r, FooTag, BarTag) { foldFB(l, r); }
/* more dispatching functions*/

template<class L, class R>
auto fold(L l, R r) {
 return fold(l, r, 
 typename L::tag{},
 typename R::tag{} );
}
```

However, once you have more complex rules, you might need a more powerful solution — [SFINAE](http://en.cppreference.com/w/cpp/language/sfinae):

C++ 14:

```cpp
struct BazTag : FooTag, BarTag {};

template<class L, class R,
  enable_if_t<
   is_same<L::tag, FooTag>::value && 
   is_base_of<R::tag, BarTag>::value
  > fold(L l, R r) {
 return foldFB(l, r);
}
```

With** **C++ 17 you can describe these rules with less boilerplate and in a clearer way:

```cpp

template<class L, class R>
auto fold(L l, R r) {
  using lTag = typename L::tag;
  using rTag = typename R::tag;
  if constexpr (is_base_of<rTag, BarTag>::value) {
    if constexpr (is_same<lTag, FooTag>::value) {
      return foldFB(l, r);
    } else {
      return foldBB(l, r);
    }
  } else {
    return foldFF();
  }
}
```

This is very practical as working with if-statements is more intuitive than using a variety of language-features.

Refactoring meta-functions becomes as simple as ordinary code. With **if-constexpr**, worrying about ambiguous overloads and other unexpected complications is a thing of the past.
