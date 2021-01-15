---
title: "C++ Coroutine TS — It’s about inversion of control!"
summary: "This article gives you one motivating example where lazy sequences enable you to *seperate your concerns* and maximize code reuse without increasing complexity."
created: "2018-11-09T11:00:00.000Z"
author: Team Buckaroo
banner: "/posts/coroutine.jpeg"
attribution: "“person flip skiing above snow during daytime” by Jörg Angeli on Unsplash"
---


C++ Coroutine TS — It’s about inversion of control!

Many people look at the Coroutines TS and wonder, what is all of the fuss about?

This article gives you one motivating example where lazy sequences enable you to *seperate your concerns* and maximize code reuse without increasing complexity.

## **Example: Approximating the Golden Ratio**

Every Math student knows how to approximate the golden ratio via the Fibonacci series:

```
fib(n+1) / fib(n) -> φ = 1.6180… 
```

Or using C++…

```cpp
double golden(double epsilon=0.00001) {
  int a = 0;
  int b = 1;
  double ratio = 0;
 
  while (1) {
    tie(a, b) = tuple{b, a+b};
    auto delta = b / (double)a - ratio;
    ratio = b / (double)a;
    if ( abs(delta) < epsilon ) 
      return ratio;
  }
}  

int main() {
  cout << golden() << std::endl;
}
```

The function golden computes the golden ratio to a given approximation. On each iteration we get a little bit closer to the golden ratio, and the function returns once we are close enough.

This was straightforward, but what if we have some additional use-cases for golden?

* Maybe we want to limit the maximum number of iterations

* Or maybe we want to print after every iteration

* Or maybe we want to return a tuple of { fib(n+1), fib(n) }

* Or maybe there is a use-case we haven’t thought of yet, but someone might have down the line

In order to satisfy all of these, we would need to modify the algorithm and provide some customization points. We could add a set of configuration options or perhaps use generic functions:

```cpp
template<class TestF class Map>
auto golden(TestF test, Map f) {
  int a = 0;
  int b = 1;
  double ratio = 1;
 
  while (1) {
    tie(a, b) = tuple{b, a+b};
    auto delta = b/(double)a - ratio;
    ratio = b/(double)a;
    if (test(delta, ratio, a, b)) 
      return f(abs(delta), ratio, a, b);
    }
  }
}

int main() {
  auto test = [i=0](auto delta, …) mutable {
    if (++i>100 || delta<0.0001)
      return true;
 
    cout << ratio <<endl;
    return false;
  };
 
  auto map = [](auto, auto, auto a, auto b) {
    return tuple{b, a};
  };
 
  auto [b, a] = golden(test, map);
  cout << b << a << endl;
}
```

We can see that the complexity of this function increased as we generalized it to handle more use-cases. This version of golden is much less readable than the original!

An alternative approach would have been to write a variant of this function for each specific use-case. Here’s a version that prints each iteration:

```cpp
double golden(double epsilon=0.00001) {
  int a = 0;
  int b = 1;
  double ratio = 0;
 
  while (1) {
    tie(a, b) = tuple{b, a+b};
    auto delta = b / (double)a - ratio;
    ratio = b / (double)a;
    cout << ratio << endl;
    if ( abs(delta) < epsilon ) 
      return ratio;
  }
}  
```

This would be readable, but now we have to maintain multiple functions!
> # How can we achieve reusability and simplicity?

Here’s the problem. The templated version is flexible, but it is not simple. The function variants are simple, but not flexible. How can we achieve reusability and simplicity?

### Why do we have to choose between them at all?

This issue is caused by the fact that the algorithm controls the *iteration of the sequence* and *representation of the sequence*. These concerns should be separated.

So what kind of abstraction do we need to have the get the best of both worlds?

## Inversion of Control via Coroutines TS

The Coroutines TS enables you to define lazy sequences. A lazy sequence is just an ordered set of values, where each value is only computes as it is requested.

You might think of a lazy sequence as a container with two properties:

* bool hasNext() is there another value in this sequence?

* T takeNext() return the next value in the sequence, and advance by 1.

As a result, we are able to decouple computation and representation, while maintaining full control over the sequence.

The Coroutine TS is quite low-level, so the following examples are built using our [Conduit](https://github.com/loopperfect/conduit) library. This library gives us various primitives that we can use to create lazy sequences. We won’t dive into the implementation details here (there is full [source-code over on GitHub](https://github.com/LoopPerfect/conduit)), but instead look at how all of this is useful!

OK. So using [Conduit](https://github.com/loopperfect/conduit) we can define a lazy sequence for Fibonacci:

```cpp
auto fib() -> seq<int> {
  int a = 0;
  int b = 1;
 
  while (1) {
    co_yield a;
    tie(a, b) = tuple{b, a+b};
  }
}
```

Since the golden ratios are a transformation of the Fibonacci numbers, we can compute them using a scan:

```cpp
auto fibRatios = [] {
  return fib() >> scan(1, [](auto a, auto b){ 
    return b/(double)a;
  });
};
```

Here we use the sequence to print the first 10 Fibonacci-ratios:

```cpp
int main() {
  int i = 0;
  for (auto x: fibRatios()) {
    cout << x << endl;
    if(++i != 10) break;
  }
}
```

Now that we have an iterable, we can control the iteration by computing a delta as before:

```cpp
int main () {
  int n=100;
  auto prevRatio = 0.0;
  for (auto ratio: fibRatios()) {
    cout << ratio << endl;
    auto delta =  ratio - prevRatio;
    if (n==0 || delta < 0.0001)
      break;
    prevRatio = ratio;
    n- - ;
  }
}
```

The beauty of this is that we can take just one definition of the sequence, but use it in multiple places. Unlike the templated solution we saw earlier, the code still maps closely to the mathematical definition.

If you are curious how to implement lazy sequences using the Coroutine TS,
checkout our [GitHub](https://github.com/loopperfect/conduit).

## Conclusion

The Coroutines TS allows us to give control back to the consumer of an algorithm. This frees the implementer from providing customization hooks to the end-user to modify the behaviour of the algorithm.

## Since You’re Here…

We recently announced [BuildInfer](https://buildinfer.loopperfect.com/), a new tool to optimize your C/C++ build scripts. [Take a look](https://buildinfer.loopperfect.com/)!

![](https://cdn-images-1.medium.com/max/2000/1*pkwieX1RSK5S0LXbFyaEJg.png)

## You might also be interested in…
[**Error Handling in C++ or: Why You Should Use Eithers in Favor of Exceptions and Error-codes**
*TL;DR*hackernoon.com](https://hackernoon.com/error-handling-in-c-or-why-you-should-use-eithers-in-favor-of-exceptions-and-error-codes-f0640912eb45)
[**value_ptr — The Missing C++ Smart-pointer**
*TL;DR*hackernoon.com](https://hackernoon.com/value-ptr-the-missing-c-smart-pointer-1f515664153e)
