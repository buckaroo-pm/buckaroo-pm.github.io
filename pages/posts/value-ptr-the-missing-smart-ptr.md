---
title: "value_ptr — The Missing C++ Smart-pointer"
created: "2019-02-21T00:00:00.000Z"
author: Team Buckaroo
summary: The C++ standard library is missing a smart-pointer! Use value_ptr to get value semantics on a heap resource. At the cost of some extra copying, your code will be simpler and easier to reason about.
---

## TL;DR

Use the `value_ptr` smart-pointer to get value semantics on a heap resource. At the cost of some extra copying, your code will be simpler and easier to reason about.

Choose which smart-pointer to use with this cheat-sheet.

Name      | `unique_ptr` | `shared_ptr`      | `weak_ptr`         | `value_ptr`
---       | ---          | ---               | ---                | ---
Ownership | Unique       | Shared            | ❌                 | Unique
Copyable  | ❌           | ✅                | ✅                 | ✅
Movable   | ✅           | ✅                | ✅                 | ✅
Sharing   | ❌           | Reference         | ❌                 | Value
Lifetime  | Lexical      | Reference-counted | Non-extending      | Lexical
Semantics | Reference    | Reference         | Optional-reference | Value

An implementation of `value_ptr` can be [found on GitHub](https://github.com/LoopPerfect/valuable).


## Introduction

Language features like templates, lambdas and lexically-scoped destructors empower C++ programmers to write higher-order containers to handle an object’s lifetime and side-effects, documenting them in an understandable way in the type-system.

With smart-pointers, encoding ownership semantics and managing resources has never been easier. We can find smart-pointers in the standard library for the most common use-cases, however none of these smart-pointers provides value semantics. This article will introduce the `value_ptr`, alongside some motivating examples.

But first, let’s take a look at the functionality that the C++ 11 standard library already offers:

### (Dumb) Raw Pointers

Yes, raw pointers can be still used, but you should avoid them if a smart-pointer is applicable. This is because raw pointers do not convey any information about a resource’s ownership model.

Furthermore, allocation and deallocation must be managed by the programmer, which may lead to bugs like double-delete or memory-leaks.

Take a look at this code:

```cpp
void* x = createInstance();
int* y = new int();
foo.bar(y);
```

From just three lines, there are so many unanswered questions:

 * Can `x` be `nullptr` and do I have to check?
 * Is `x` managed? Can I delete `x`? *Must* I delete `x`?
 * If I delete `y` before `foo`, is `foo` still valid?
 * If `foo` gets destroyed, will `y` be deleted?

Used correctly, a smart-pointer makes these clear.

### unique_ptr

`unique_ptr` manages the lifetime of an resource by taking sole ownership of it and binding that to its lexical scope. While copying is not possible, the ownership can be transferred via `std::move`.

Use `unique_ptr` when:

 * You want to tie the lifetime of a heap resource to a lexical scope
 * You want to enforce that the resource only has one owner at a time

#### Example

```cpp
struct Widget {
  Widget() { cout << "Widget created" << endl; }

  ~Widget() { cout << "Widget destroyed" << endl; }
};

unique_ptr<Widget> createWindow() {
  return make_unique<Widget>();
}

int main() {
  auto w = createWindow();

  ASSERT(w);

  // auto w2 = widget;
  // The above would error,
  //   unique_ptr has no copy-constructor

  auto w3 = move(widget);
  // w3 now owns the widget, w is empty

  ASSERT(w3 && !w);
  // w3 calls destructor of widget;
  //   only one object at a time owns the Widget

  return 0;
}
```

### shared_ptr

`shared_ptr` allows for multiple resource owners by counting the number of references under management. The container’s copy-constructor increments the counter and decrements it on destruction. If the counter hits zero, then the resource will be disposed.

Use `shared_ptr` when:

 * You want to share ownership between multiple references
 * You want to dispose of a resource automatically when it is no longer used
 * You don’t have cyclic dependencies
 * The overhead of reference counting is acceptable

#### Example

```cpp
struct Texture {
  Texture(string const& path) {
    cout << "Texture loaded from " << path << endl;
  }

  ~Texture() {
    cout << "Texture destroyed" << endl;
  }

  static shared_ptr<Texture> load(string const& path) {
    return make_shared<Texture>(path);
  }
};

// These functions will take a copy
//   and increment the counter.
// Using const& would not increment the ref-counter.
int doSomething(shared_ptr<Texture> const tex);

int doSomethingElse(shared_ptr<Texture> const tex);

void foo() {
  shared_ptr<Texture> tex =
    Texture::load("textures/my_texture.png");

  thread(doSthWithTexture, tex).detach();
  thread(doSthMoreWithTexture, tex).detach();
}
```

### weak_ptr

We saw that we can use `shared_ptr` with multiple owners, but what happens if we have cycles in the ownership graph? In this case, we would leak memory as the reference counter would never hit zero! The owners in the cycle would keep each-other alive.

This is where `weak_ptr` comes into play. `weak_ptr` is like `shared_ptr` but it does not increment the reference counter. If you replace the cycle-branch in your ownership graph with a `weak_ptr`, then reference counting will work correctly.

#### Example

```cpp
struct Node {
  string name;
  weak_ptr<Node> parent;
  vector<shared_ptr<Node>> children;

  bool hasParent() {
    return parent.expired();
  }

  shared_ptr<Node> getParent() {
    return parent.lock();
    // If hasParent()
    //  then return shared_ptr from parent
    //  else nullptr
  }

  Node& addChild(shared_ptr<Node> node) {
    if(node.hasParent()) {
      throw "node already belongs to a parent";
    }
    children.emplace_back(node);
    node->parent = this;
    return *this;
  }

  Node& removeChild(unsigned i) {
    children[i].parent.reset(); // Remove parent;
    children.erase(&children[i]);
    return *this;
  }

  static shared_ptr<Node> create(string const& name) {
    return make_shared<Node>(name);
  }
};

shared_ptr<Node> createTree() {
  shared_ptr<Node> root = Node::create("root");
  shared_ptr<Node> foo = Node::create("foo");
  shared_ptr<Node> bar = Node::create("bar");
  shared_ptr<Node> baz = Node::create("baz");

  root
    ->addChild(foo)
    ->addChild(bar);

  bar->addChild(baz);

  return root;
}

int main() {
  auto tree = createTree();
  auto baz = tree->children[1]->children[0];

  tree->removeChild(1); // Remove bar

  ASSERT(baz.hasParent() == false);
  // If parent would be a shared_ptr,
  //   then bar and baz would keep
  //   each-other alive forever.

  return 0;
}
```

Use `weak_ptr` when:

 * You absolutely must have a cyclic ownership graph

## Introducing value_ptr

Value semantics make your code easier to reason about because unlike pointers, ownership must be strictly hierarchical and exclusive.

`value_ptr` allows us to enforce those semantics on a copyable resource on the heap.

### How it Works

 * `value_ptr` has exclusive ownership of a resource on the heap.
 * When you assign one value_ptr to another, a new `value_ptr` object is constructed that points to its own copy of the previous `value_ptr`’s resource.
 * The resource is destroyed when the `value_ptr` leaves its lexical scope.
 * No memory is shared, so `value_ptr` is inherently thread-safe.
 * A modern compiler is smart enough to remove most redundant copies.

#### Example 1 — Recursive Data Types

Recursive types like trees must be implemented via a pointer in C++ so the layout in memory can be computed at compile-time. However, despite using a pointer, we might still want the simplicity of value-semantics:

```cpp
struct Tree {
  string const name;
  value_ptr<Tree> left;
  value_ptr<Tree> right;

  Tree(
    string const& name,
    value_ptr<Tree> const& left = value_ptr<Tree>{},
    value_ptr<Tree> const& right = value_ptr<Tree>{})
    : name{name}
    , left{left}
    , right{right}
  {}
};

int main() {
  Tree root = Tree{
    "root",
      Tree{"l0"}
      Tree{"r0"}
  };

  root.left = root; // Copy of root assigned to left
  root.right = root; // and we don't have cyclic references
}
```

#### Example 2 — The PImpl Pattern

Sometimes we want to separate the interface of a class from its implementation. This might be to hide code behind a compiled library, or to enforce a constant stack-size.

Since the lifetime is bound to the owner, a smart-pointer is appropriate here, but what semantics do we want to have? Unlike `shared_ptr` and `unique_ptr`, `value_ptr` gives us value semantics.

```cpp
struct Foo {
  int bar() {
    return ptr->bar();
  }

  Foo(int x);

  // Thanks to value_ptr we get value semantics for free
  Foo(Foo const&) = default;

  Foo& operator=(Foo const&) = default;

  ~Foo() = default;

  struct Pimpl;

  value_ptr<Pimpl> ptr;
};
```
*Header*

```cpp
struct Foo::Pimpl {
  int x;
  int bar() { return ++x; }
};

Foo::Foo(int x)
  : ptr{Foo::Pimpl{x}}
{}
```
*Translation-unit*

##### More Resources About the PImpl Pattern

 * [PImpl, Rule of Zero and Scott Meyers](http://oliora.github.io/2015/12/29/pimpl-and-rule-of-zero.html)
 * [The Fast PImpl Idiom](http://www.gotw.ca/gotw/028.htm)
 * [PImpl You C++ Code](https://anteru.net/blog/2009/03/14/385/)

## Implementing value_ptr

You might have noticed that `value_ptr` is similar to `unique_ptr`, but with a different copy-constructor. Whilst copying a `unique_ptr` is forbidden, copying a `value_ptr` will create a copy of the resource. Thus, we can implement `value_ptr` by leveraging `unique_ptr` and a copy function.

This is what we have done; [take a look on GitHub](https://github.com/loopperfect/valuable), or test-drive our implementation with [Buckaroo](https://buckaroo.pm):

```bash
buckaroo add github.com/LoopPerfect/valuable
```

## Summary

Value semantics are easy to reason about, and are often useful even for heap objects. The C++ standard library does not provide a smart-pointer with value semantics, but C++ has the features to allow us to roll-our-own.

Can’t decide which smart-pointer to use? Here’s a quick chart:

Name      | `unique_ptr` | `shared_ptr`      | `weak_ptr`         | `value_ptr`
---       | ---          | ---               | ---                | ---
Ownership | Unique       | Shared            | ❌                 | Unique
Copyable  | ❌           | ✅                | ✅                 | ✅
Movable   | ✅           | ✅                | ✅                 | ✅
Sharing   | ❌           | Reference         | ❌                 | Value
Lifetime  | Lexical      | Reference-counted | Non-extending      | Lexical
Semantics | Reference    | Reference         | Optional-reference | Value
