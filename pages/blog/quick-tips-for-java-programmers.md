---
title: "7 Quick Tips for Java Programmers Starting C++"
banner: "/posts/7-tips-for-java.jpeg"
author: "Team Buckaroo"
created: "2017-09-7T11:00:00.000Z"
attribution: "Photo by fireskystudios.com on Unsplash"
---


## 1. Avoid The new Keyword

In Java, objects are instantiated using the new keyword, so it might be natural to assume that we should use new in C++ in the same manner:


```java
//java
int f() {
  Foo foo = new Foo();
  return foo.bar();
}
```

```cpp
//c++
int f() {
  Foo* foo = new Foo();
  return foo->bar(); // Leak! 
}
```

However, unlike in Java, a C++ variable instantiated with new is *unmanaged*, meaning that you must remember to free the memory after use.

```cpp
int f() {
  Foo* foo = new Foo();
  int x = foo->bar();
  delete foo; // How inconvenient! 
  return x;
}
```

This can be done with the delete keyword. Coming from the Java world, this seems at best inconvenient, and at worst highly error-prone! Why is an extra statement required for the C++ version, when the Java equivalent is so concise?

In C++, there are multiple ways to instantiate an object and the preferred way to do so is directly onto the stack.

```cpp
int f() {
  Foo foo;
  return foo.bar(); // foo automatically destroyed
}
```

When variables are allocated on the stack, they are automatically deleted once they go out of scope. This is very concise, and has great performance characteristics.

## 2. C++’s const is More Powerful Than Java’s final

A common pattern when designing large applications is to make values immutable. This reduces complexity by lowering the number of moving parts an application has.

In Java, we can use the final keyword to mark a *reference* as immutable. However, the data that is being pointed to may change. For example:

```java

final List<String> xs = new ArrayList<>();

// We can modify xs internally
xs.add("a");
xs.add("b");
xs.add("c");

// ... but we cannot change where it points to!
xs = new ArrayList<>(); // Will not compile
```

So to create truly immutable types, Java developers must mark all fields inside of a class as final:

```java
public final class Person {
  
  public final String firstName;
  public final String lastName;
 
  public Person(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
```

```cpp
final Person person = new Person("John", "Smith");

person.firstName = "Bob"; // Will not compile!
```

In C++ we have the const keyword, which is far more powerful. If an instance is marked as const, then none of its members may change, even if they are not marked const in the class definition!

```cpp
struct Person {
  std::string firstName; // No need for const here! 
  std::string lastName;
};
```

```cpp
Person const person = { "John", "Smith" };

person.firstName = "Bob"; // Will not compile!
```

## 3. Beware of Stack Slicing!

In Java, the semantics of all objects is that they are on the heap (the reality is bit more complicated due to optimizations done by the JVM, but this is a good rudimentary understanding).

C++ is very different, because it allows the user to decide if the object should live on the heap or on the stack. Generally speaking, we should prefer the stack. It gives predictable (and fast!) performance, but it has a big limitation in that the size of each variable must be known at compile-time. This is a big problem when using inheritance.

```cpp
struct A {
  virtual std::string what() {
    return "A";
  }
};

struct B : public A {
  std::string what() override {
    return "B";
  }
};
```

In this example we have two classes A and B, where B is a subclass of A. Each has a function what that returns the class name.

Given these definitions, what do you think the following will do?

```cpp
int main() {
  
  A x;
  B y;
  A z = y;
 
  std::cout << "x.what() = " << x.what() << std::endl;
  std::cout << "y.what() = " << y.what() << std::endl;
  std::cout << "z.what() = " << z.what() << std::endl;
 
  return 0;
}
```

If you are coming from the Java world, the answer might surprise you! It turns out that when y is cast to type A and assigned to z, it takes the what method of class A.

```cpp
x.what() = A
y.what() = B
z.what() = A
```

When a stack-variable is assigned to a super-class in C++, it takes the members and method implementations of that super-class. This is because the size of a variable’s value must not exceed the size of its type. For stack-variables, the compiler just “slices” off the extra information of the sub-class.

To prevent this, variables can be *pointed to* instead. A pointer (or [reference](https://en.wikipedia.org/wiki/Reference_(C%2B%2B))[)](https://en.wikipedia.org/wiki/Reference_(C%2B%2B)))) always has the same size, regardless of the size of the value being pointed to.

```cpp
int main() {
  
  A* x = new A();
  B* y = new B();
  A* z = y;
 
  std::cout << "x->what() = " << x->what() << std::endl;
  std::cout << "y->what() = " << y->what() << std::endl;
  std::cout << "z->what() = " << z->what() << std::endl;
 
  delete x;
  delete y;
  // Do not delete z because z = y
 
  return 0;
}
```

```cpp
x->what() = A
y->what() = B
z->what() = B
```

### Quick Aside: value_ptr

We released a new smart-pointer called value_ptr to make it easier to preserve value-semantics on the heap. See:
[**value_ptr — The Missing C++ Smart-pointer**
*TL;DR*hackernoon.com](https://hackernoon.com/value-ptr-the-missing-c-smart-pointer-1f515664153e)

## 4. Overload Your Operators!

Java does not allow you to define custom value-types and operators similar to int and boolean. As a result, vector and matrix implementations can be quite cumbersome!

```java

public final class Vector2 {
 
  public final float x;
  public final float y;
 
  public Vector2(float x, float y) {
    this.x = x;
    this.y = y;
  }
 
  public Vector2 add(final Vector2 v) {
    return new Vector2(x + v.x, y + v.y);
  }
 
  // toString, hashCode, equals…
}
```

```java

Vector2 v = new Vector2(1, 2);
Vector2 u = new Vector2(3, 4);
Vector2 w = v.add(w);
```

In C++, we can just overload the + operator:

```cpp

struct Vector2 {
  float x;
  float y;
};

inline Vector2 operator+(Vector2 const& lhs, Vector2 const& rhs) {
  return { lhs.x + rhs.x, lhs.y + lhs.y };
}
```

This makes vectors usable with +, just like the built-in primitives.

```cpp
Vector2 v = { 1, 2 };
Vector2 u = { 3, 4 };
Vector2 w = v + w; // Much better!
```

## 5. Take Advantage of Compile-time Programming

Java’s generics are incredibly simple, and for the most part are only useful for collection types. C++ templates expand the possibilities of compile-time programming considerably, and are in some ways more akin to Java’s annotations.

Recall our Vector2 class from before. If we want to implement a 3-dimensional version in Java, then we need to create a new class:

```java

public final class Vector3 {
 
  public final float x;
  public final float y;
  public final float z;
 
  public Vector3(float x, float y, float z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
 
  public Vector3 add(final Vector3 v) {
    return new Vector2(x + v.x, y + v.y, z + v.z);
  }
 
  // toString, hashCode, equals...
}
```

In C++, we can make this a parameter of the type, and write generic code that handles all sizes only once! Code is generated at compile-time, so the generic code is no less efficient than the hand-written equivalent.

```cpp

template<int D>
struct Vector {
  
  static constexpr unsigned N = D;
  int data[N];
  
  Vector(int fill = 0) {
    for (int i = 0; i < N; ++i) {
      data[i] = fill;
    }
  }

  int& operator[] (unsigned const& i) {
    if (N <= i) {
      throw "out of bound";
    }
    return data[i];
  }
 
   // begin, end, etc... 
};
```

With this generic definition, we can create vectors of any length easily:

```cpp
Vector<1> v;
Vector<2> v;
Vector<3> u;
// etc... 
```

Templates can even speed up compilation times! See our comparison below:
[**Comparing the Compilation Times of C++ Templates and Macros**
*TL;DR*hackernoon.com](https://hackernoon.com/comparing-the-compilation-times-of-templates-and-macros-d0a1b7264a17)

## 6. Use auto!

Java famously [lacks a variable type-inference keyword](http://openjdk.java.net/jeps/286) such as auto (C++), var (C#), val (Kotlin) or let (OCaml). This can make Java code quite verbose, particularly when classes like [SimpleBeanFactoryAwareAspectInstanceFactory](https://docs.spring.io/spring/docs/2.5.x/javadoc-api/org/springframework/aop/config/SimpleBeanFactoryAwareAspectInstanceFactory.html) are in the wild!

With C++, the compiler can figure out many types for you, saving you some typing and making code more readable.

```cpp

struct SomeClassWithAReallyLongName {
  // ... 
};

SomeClassWithAReallyLongName foo() {
  SomeClassWithAReallyLongName x;
  return x;
}

int main() {
  auto x = foo(); // auto instead of SomeClassWithAReallyLongName
  x.bar();
  return 0;
}
```

## 7. Be Prepared to Use More Libraries

The JVM, for better or for worse, gives you many platform abstractions out-of-the-box. By comparison, C++ is extremely lean. It lacks built-in support for file-systems, networking and graphics. Instead, C++ developers have to leverage libraries for this functionality.

A good library will also abstract over platform differences, giving a common set of portable functions, just like Java. Neither approach is strictly better. Java developers benefit from a more unified ecosystem, since everyone is using the same underlying APIs. C++ developers are unburdened by functionality that they do not need, but they also have to make more decisions about what to use, and spend more time integrating it. See:
[**Approaches to C++ Dependency Management, or Why We Built Buckaroo**
*C++ is an unusual language in that it does not yet have a dominant package manager (we’re working on it!). As a result…*hackernoon.com](https://hackernoon.com/approaches-to-c-dependency-management-or-why-we-built-buckaroo-26049d4646e7)

## Buckaroo

We created [Buckaroo](https://github.com/LoopPerfect/buckaroo) to make it easier to integrate C++ libraries. If you would like try it out, the best place to start is [the documentation](http://buckaroo.readthedocs.io/en/latest/). You can browse the existing packages on [Buckaroo.pm](https://buckaroo.pm/) or request more over on [the wishlist](https://github.com/LoopPerfect/buckaroo-wishlist).
