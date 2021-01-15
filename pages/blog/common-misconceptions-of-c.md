---
title: "Common Misconceptions of C++"
banner: "/posts/common-missconceptions.jpeg"
attribution: "“black swirl of letters” by Nathaniel Shuman on Unsplash"
author: "Team Buckaroo"
created: "2018-11-06T11:00:00.000Z"
---

C++ has evolved massively in recent years and yet it is still perceived by many as the language that it was back in the early 2000s. Let’s dispel some myths…

### C++ is a Dying Language

C++ is actually growing! Even as computers becomes faster, our demands of what we want to do with them are always increasing. C++ is one of the few languages that allows us to maximize the potential of our hardware.

Stroustrup’s talk from CPP Con shows C++ on a growth trajectory.

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/_wzc7a3McOs" frameborder="0" allowfullscreen></iframe></center>

### C++ is verbose and unproductive

With the new auto keyword and lambda syntax, C++ can be correct, fast *and* concise.

For example, compare these two programs in JavaScript and C++ 14:

```js
const length = p => {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

let points = [
  { x: 1, y: 2 }, 
  { x: 3, y: 4 }, 
  { x: 6, y: 2 }, 
];

let total = 0.0;

for (const p of points) {
  total += length(p);
}

console.log(total);
```

```cpp

#include <cmath>
#include <vector>
#include <iostream>

struct Point {
  int x;
  int y;
};

float length(Point p) {
  return std::hypot(p.x, p.y);
}

int main() {
  std::vector<Point> points = {
    { 1, 2 }, 
    { 3, 4 }, 
    { 6, 2 }, 
  };

  float total = 0;

  for (auto p : points) {
    total += length(p);
  }

  std::cout << total << std::endl;

  return 0;
}
```

Okay, so the C++ one is marginally longer, but think about what you get in return:

* Strong type system and compile-time type checking

* No run-time dependency like Node.js

* *Fraction* of the execution time

```
$ time node index.js 
34

real	0m0.035s
user	0m0.024s
sys	0m0.012s


$ time ./app
34

real    0m0.001s
user	0m0.001s
sys	0m0.000s
```

### C is a subset of C++

Whilst it is often possible to include C code in C++, this is not always the case. The following snippets are valid C, but not valid C++:

```cpp
int x;
int x; // error! x is already defined
```

```cpp
int b(a) int a; { } // Error! 
```

```cpp
auto x; // Error! x must be given a type
```

### You need to know C in order to understand C++

C++ is its own language with its own idioms and best-practices. If you only learn C++ as an extension of C, then you will not learn these patterns and probably write error-prone code!

```cpp
// C style
{
  Foo* foo = new Foo();
  foo->bar();
  delete foo;
}
```


Kate Gregory did an excellent talk about this that is well worth your time.

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/O50qTuM5OT0" frameborder="0" allowfullscreen></iframe></center>

How many developers have had a negative experience of C++ because they were taught to use it like C?

### C is faster than C++

C++ allows you to write abstractions that compile-down to equivalent C. This means that with some care, a C++ program will be at least as fast as a C one. The advantage C++ gives over C is that it enables us to also build reusable abstractions with templates, OOP and functional composition.

C++ gives you the tools to encode your intentions in the type-system. This allows the compiler to generate optimal binaries from your code.

### C++ is not cross-platform

C++ *the language* is completely cross-platform. The reason that many claim C++ is not is that the standard library does not provide that platform abstractions for filesystem, network access and so on that languages like Java do.

Instead, C++ requires you to use a library, or write your own. This might seem painful (although much less so with a [package manager](https://github.com/loopperfect/buckaroo)!), but it is actually a good thing.

1. To target a new platform, compiler implementers have less to implement.

1. Platform targets with limited capabilities can support C++. What would happen if the standard required some feature that a platform cannot provide due to hardware limitations?

1. You are free to choose the best library for your application. It is not one size fits all.

### apt-get is C++’s package manager

We covered this is detail in a [previous article](https://hackernoon.com/approaches-to-c-dependency-management-or-why-we-built-buckaroo-26049d4646e7), but the short version is:

* apt-get only works on Debian variants

* apt-get mutates your system, which is inconvenient when switching between projects

* apt-get is not a good source for new and experimental versions of libraries

### C++ is all about classes

In the early days, the big difference between C and C++ was that C++ provides classes. This is still true, but classes are no longer the dominant feature of C++. In modern C++, the focus is on RAII patterns. C++ is not really about classes, it is about deterministic resource management.

### Garbage collection is mandatory for reliable software, thus C++ is bad for large projects

The C++ approach to resource management (of which memory is just one kind) is to use RAII patterns rather than a centralized garbage collector.

This is a bit like the “using” pattern seen in other languages. For instance, in C# we might write:

```csharp

using (var myRes = new MyResource())
{
  myRes.DoSomething();
}
```

In C++, the disposal should be done by the *destructor*:

```cpp
{
  auto myRes = std::make_unique<MyResource>();
 
  myRes->DoSomething();
} // myRes is cleaned up
```

Notice that this is actually less verbose; plus, we can use the same pattern for memory *and* other resources.

But there is another advantage: the order and timing of object disposal is determined by the scope in which they are used. This makes it possible to control the garbage collection process at a function-level, whereas most garbage-collected languages only allow (*limited*) control at a global level.

This is an even greater benefit in large projects, since it prevents one module from introducing garbage-collection latency into another. This is the reason C++ is the language of choice for game development and audio processing.

### For performance, you must write low-level code

The C++ compilers do an amazing job of optimizing high-level code. This allows you to avoid writing at a low-level, whilst still getting great performance. Sometimes the performance is even better, since the compiler can perform optimizations that would be too tricky to write by hand.

Our favourite example of this is using [Conduit](https://github.com/LoopPerfect/conduit), our new C++ sequence library. This program computes the sum of various Fibonacci numbers using lambdas, coroutines and so on:

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

And yet it compiles to just:

```nasm
main: # @main
  mov eax, 511172301
  ret
```

This means the optimizer was able to compute 60 Fibonacci numbers and sum the last 50 at compile-time!

## Since You’re Here…

We recently announced [BuildInfer](https://buildinfer.loopperfect.com/), a new tool to optimize your C/C++ build scripts. [Take a look](https://buildinfer.loopperfect.com/)!

![](https://cdn-images-1.medium.com/max/2000/1*YZgG5MjrKJ9nV_a7bJtHuA.png)
