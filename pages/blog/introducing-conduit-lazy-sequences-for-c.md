---
title: "Introducing Conduit: Lazy Sequences Using the Coroutine TS"
banner: "/posts/introducing-conduit.png"
author: "Team Buckaroo"
created: "2018-10-31T11:00:00.000Z"
---
[Conduit](https://github.com/LoopPerfect/conduit) is a new library that leverages the [Coroutine TS](https://lewissbaker.github.io/2017/09/25/coroutine-theory) to introduce lazy sequences to C++.

Lazy sequences are an idea that’s very popular in the functional-programming community, but less common in the C++ world.
> # **Simply put, a lazy sequence is one where the elements are computed as they are requested, rather than in advance.**

This can lead to big efficiency gains since you only perform the computation required. It also allows you to represent infinite sequences, which of course could never fit into a vector!

Let’s see how Conduit works with some simple examples…

## Square Numbers

Everyone is familiar with square numbers, so this is a great place to start.
> *0, 1, 4, 9, 16, …*

A Conduit sequence is defined using the seq template. Here we have a sequence of ints:

```cpp
auto squares = []() -> seq<int> {
  int x = 0;
  while (true) {
    co_yield x * x;
    ++x;
  }
};
```

You might see the while (true) and be alarmed, but don’t worry! This function is a coroutine, meaning it can suspend its execution and return control back to the caller. This prevents an infinite loop.

The suspension point is co_yield x * x. This statement saves the stack onto the heap for later reuse, returns the next sequence element and jumps execution back to the caller.

OK… but how do I use this in practice?

Every seq can be used as an iterator:

```cpp

int i = 0;
for (auto x : squares()) {
  std::cout << x << std::endl;
  // squares is infinite, so we need to break
  if (i > 10) {
    break;
  }
  
  ++i;
}
```

Alternatively, you can save the whole sequence into a std::vector. Just be sure not to try this on an infinite sequence!

```cpp
std::vector<int> v = range()
  >> take(5)
  >> toVector();
// v = { 0, 1, 2, 3, 4 }
```

## Sequence Transformations

This is pretty cool, but things get really interesting once you start combining and transforming sequences. To give you some idea, look at how concisely these functions can be implemented…

```cpp
// Sum of the first 10 squares 
auto total = squares() >> take(10) >> sum();

// Jumps between the first 10 squares
auto jumps = squares() 
  >> scan(0, [](auto x, auto y) { return y - x; }) 
  >> take(10);

// The obligatory fibonacci
auto fibonacci = []() -> seq<int> {
  int a = 0; 
  int b = 1;
  
  while ( true ) {
    co_yield a;
    
    tie(a, b) = tuple{a + b, a};
  }
};

// Cumulative sum of 6 pseduo-random dice rolls
auto randoms = [](int seed) -> seq<double> {
  // pseudo-random
  std::mt19937 engine(seed);
  std::uniform_real_distribution<> dist;
  while (true) {
    co_yield dist(engine);
  }
};

auto rolls = randoms(0) 
  >> map([](auto x) { return ceil(x * 6); })
  >> scan(0, [](auto x, auto y) { return x + y; })
  >> take(6);
```

As you can see, many sequences are simple transformations of others, and Conduit allows us to represent this with a terse syntax.

## Compiler Optimization

[Alan Perlis](https://en.wikipedia.org/wiki/Alan_Perlis) once joked that LISP programmers know the value of everything and the cost of nothing. And indeed a common criticism of lazy sequences is that they are far slower than transformations over vectors.
> # LISP programmers know the value of everything and the cost of nothing. — Alan Perlis

However, with Clang and the Coroutine TS, we’ve found that these abstractions usually compile away!

For example, consider this Fibonacci program:

```cpp

auto fibonacci = []() -> seq<unsigned long long> {
  auto a = 0ll; 
  auto b = 1ll;
  
  while (true) {
    co_yield a;
    
    tie(a, b) = tuple{a + b, a};
  }
};

static long N = 50;

int main() {
  auto n = N;
  auto items = fibonacci() 
    >> drop(n - 10)
    >> take(n);
  unsigned long long result = 0;
  
  for (auto x : items) {
    result += x;
  }
  
  return result;
}
```

Incredibly, Clang optimizes this to just:

```
main: # @main
  mov eax, 511172301
  ret
```
Amazing stuff!

## Try Conduit

Conduit is available as a [header-only library](https://github.com/LoopPerfect/conduit/releases) on [GitHub](https://github.com/loopperfect/conduit). All you need is a C++ compiler with the Coroutine TS.

Want to contribute? We have an actively maintained list of issues over on the [tracker](https://github.com/loopperfect/conduit/issues). 💖

## Since You’re Here…

We recently announced [BuildInfer](https://buildinfer.loopperfect.com/), a new tool to optimize your C/C++ build scripts. [Take a look](https://buildinfer.loopperfect.com/)!

![](https://cdn-images-1.medium.com/max/2000/1*pkwieX1RSK5S0LXbFyaEJg.png)
