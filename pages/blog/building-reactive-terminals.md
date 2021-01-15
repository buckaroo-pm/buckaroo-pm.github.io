---
title: "Building Reactive Terminal Interfaces in C++"
banner: "/posts/rxterm.gif"
author: "Team Buckaroo"
created: "2017-08-21T11:00:00.000Z"
---

## TL;DR

Using functional programming techniques, we can easily build fancy terminals with dynamic components in C++. [RxTerm](https://github.com/loopperfect/rxterm) is a C++ library that provides some of the necessary building blocks for implementing this concept.

We applied the same ideas in [Buckaroo](https://buckaroo.pm). This is the result:

![](/posts/rxterm.gif)

## Motivation

Imagine that we want to build a text-based application that updates the console as its state changes. A great example of this is Curl, which gives a live progress bar for downloads. Try this in your teminal:

```
curl http://www.openss7.org/repos/tarballs/strx25-0.9.2.1.tar.bz2 > /dev/null
```

Such interfaces are implemented using [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code). These are invisible characters that have side-effects, such as erasing characters and moving the cursor.

We can use these escape codes to create live text interfaces. A simple implementation might update a progress bar like this:

```js
// Pseudo-code
function updateProgressBar() {
  print (eraseCharEscapeCode * lastProgressBarLength);
  print (‘#’ * progressBarLength);
  lastProgressBarLength = progressBarLength;
}
```

So far so good, but what if we have more complicated case? Ideally, we would leverage a library that figures these things out for us. We should only have to specify what the terminal output should look like, and the library functions would figure out the characters to print to get us there.

So, at a high-level, we need three things:

1. A variable to track the previous state of the console
2. A function for rendering the current application state
3. A function for transforming the console from the previous state to the next state

[React](https://facebook.github.io/react/) developers will be familiar with this pattern. It’s a clever strategy that can actually be applied to any I/O device!

Additionally, we want to be able leverage reusable UI components for things like progress-bars, lists and so on. Something like HTML, but simpler, would be ideal. A component would be any object than can be rendered to console output.

## Simple API Example

To see where we are going, let’s take a look at an example in [RxTerm](https://github.com/LoopPerfect/rxterm). With RxTerm, we can turn basic terminal components into more complex ones using composition. If the app-state changes, then we compute a new view for the terminal and replace the currently visible output.

This example shows how we can design a new component called fancyCounter, which prints frames like this:

![](https://cdn-images-1.medium.com/max/2000/1*SI86FEWso3OOTMRMRq0mBQ.png)

Here’s the code:

![](/posts/rxterm-2.png)

As you can see, the interface is very high-level.

## ANSI Escape Codes

Let’s start with the basics. How can we use ANSI escape codes to change the color and delete a line?

```cpp

#include <iostream>

int main() {
  std::cout << "\e[31m" << "Hello" << "\e[0m" << World" << std::endl;
  return 0;
}
```

This function prints `Hello` in red type followed by `World` in the default color. The magic escape sequences (`\e[31m` and `\e[0m`) modify how the terminal displays characters.

***Hello World***

An escape sequence is introduced with \e[ followed by a semicolon-separated-list of modifiers, terminated with m. For instance, \e[3;31;42mTEXT would print TEXT in red italics on a blue background.

***TEXT***

We can also print \e[0m to reset the terminal back to its default state.

You can find a whole list on [bash-hackers.org](http://wiki.bash-hackers.org/scripting/terminalcodes).

## Abstracting the Terminal State

To be able to compose components, we need a high-level representation of the state of the console. Since we want to support colors, an intuitive representation of this is a map from coordinates to pixels:

```cpp

enum class Color { /* ... */ };
enum class Font { /* ... */ };

struct Style {
  Color bg;
  Color fg;
  Font font;
};

struct Pixel {
  char c;
  Style s; // Color and font
};

struct Image {
 
  unsigned getWidth() const;
  unsigned getHeight() const;
 
  Pixel const& get(unsigned x, unsigned y) const;
  Pixel& get(unsigned x, unsigned y);
 
  // Renders the image to a string for the terminal
  std::string toString() const;
 
  Image(
    unsigned width, 
    unsigned height, 
    std::vector<Pixel> pixels);
};
```

Once we have the basic abstraction for components,
we can take advantage of type-erasure to maintain value-semantics and make inheritance an implementation detail:

```cpp
struct Renderable {
  virtual Image render(unsigned const width) const = 0;
  virtual ~Renderable() {}
};

template<class T>
struct Model : Renderable {
  
  T data;
  
  Model(T const& data)
    : data{ data }
  {}
  
  virutal ComponentModel() {}
};

struct Component : Renderable {
  
  template<class T>
  Component(T data) 
    : pimpl{make_shared<Model<T>>(data)}
  {}
 
  virtual Image render(unsigned const width) const {
   return pimpl->render(width);
  }
 
  shared_ptr<Renderable> pimpl; 
};
```

Now, we can build higher order components like a Text object:

```cpp
struct Text {
  Style style; 
  std::string text;
  
  Image render() const {
    std::vector<Pixel> pixels(text.size(), Pixel{ style });
    for (int i = 0; i < text.size(); ++i) {
      pixels[i].c = text[i]; 
    }
    return Image{ width, height, pixels };
  }
};
```

You can find the actual implementation [here](https://github.com/LoopPerfect/rxterm/blob/master/rxterm/include/components/text.hpp).

## Performing State Transitions

Imagine we want to transition from this:

```
running task: download
progress(50%): [xxxxxx ]
Tasks Done: 1/5: [x ]
```

… to this:

```
running task: download
progress(75%): [xxxxxxxxx ]
Tasks Done: 1/5: [x ]
```

The simplest way would be to delete the latest 3 lines and print the new lines. We can delete the latest line by printing \e[2K\r\e[1A (delete line; move cursor to the start of the line; move cursor up one line).

A more sophisticated approach would be to compute the difference and move to the target position and edit only the terminal pixels that changed. For simplicity, we will stick to the first approach and combine the moving parts into one class:

```cpp
// Pseudo-code
struct VirtualTerminal {
  string buffer; // Currently visible output
 
  string computeTransition(string const& prev, string const& next) {
    const string deleteLine = "\e[2K\r\e[1A";
    return repeat(count("\n", prev), deleteLine()) + next;
  }
 
  VirtualTerminal flip(std::string const& str) const {
    cout << computeTransition(buffer, str);
    cout.flush();
    return VirtualTerminal{str};
  }
};
```

The [actual implementation is hosted on GitHub](https://github.com/LoopPerfect/rxterm/blob/master/rxterm/include/terminal.hpp).

## Verdict

We saw how easy it is to write a reactive terminal framework and manage the state transitions without too many headaches!

You can find the implemention of some basic components in our [repo on GitHub](https://github.com/loopperfect/rxterm). We would love to see more people doing beautiful terminal interfaces!

### Teaser: FRP Style Components With RxCpp

Our next article will be about how we can leverage [RxCpp](https://github.com/Reactive-Extensions/RxCpp) to write highly concurrent applications with complex state management.

```cpp
auto progressbar = rx::observable<>::from(
  rxcpp::interval(std::chrono::milliseconds(250))
    .take_until([](auto x) { return x > 100; })
    .map([](auto x) { return x / 100.0;})
    .map(Progressbar);

auto app = rx::observable<>::zipWith(
  rx::observable<>::just<Text>("progressbar example"),
  progressbar,
  stackLayout);

app.scan(
  VirtualTerminal(), 
  [](auto const& vt, Component const& c) {
    return vt.flip(renderToTerm(vt, TerminalWidth, c)));
  });
```

## More About Buckaroo

We created [Buckaroo](https://buckaroo.pm) to make C++ code-reuse easier. Read more about it [on Medium](https://medium.com/@buckaroo.pm/):
[**7 Reasons to Use Buck Build**
*Buck is a cross-platform, cross-language build system made for large scale compilation at Facebook. All Buckaroo…*hackernoon.com](https://hackernoon.com/7-reasons-to-use-buck-build-5b44d7413585)
[**Approaches to C++ Dependency Management, or Why We Built Buckaroo**
*C++ is an unusual language in that it does not yet have a dominant package manager (we’re working on it!). As a result…*hackernoon.com](https://hackernoon.com/approaches-to-c-dependency-management-or-why-we-built-buckaroo-26049d4646e7)
[**6 Reasons Why We Distribute C++ Libraries as Source-Code**
*When writing C++ applications, you will inevitably make use of external libraries. This is a good thing! Code re-use…*hackernoon.com](https://hackernoon.com/6-reasons-why-we-distribute-c-libraries-as-source-code-2dc614d5ef1e)
