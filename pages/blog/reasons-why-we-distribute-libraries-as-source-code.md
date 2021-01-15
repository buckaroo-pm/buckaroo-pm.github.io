---
title: " 6 Reasons Why We Distribute C++ Libraries as Source-Code"
banner: "/posts/reason-why-we-distribute.jpeg"
author: "Team Buckaroo"
created: "2017-07-25T11:00:00.000Z"
attribution: "It’s JavaScript… which is distributed as source-code! (Photo by Markus Spiske on Unsplash)"
---

6 Reasons Why We Distribute C++ Libraries as Source-Code

When writing C++ applications, you will inevitably make use of external libraries. This is a good thing! Code re-use makes us more productive and let’s us build bigger and better products. With [Buckaroo.pm](http://buckaroo.pm) we are trying to make this even easier, with a source-only package manager for C++.

Source-only? Yes, and here’s why:

## 1. It’s Cross Platform

Assuming the C++ code properly abstracts away any system libraries used, the C++ source-code is fully portable. Once it is compiled however, this property is lost since a binary must target a particular instruction set.

## 2. The Debugging Experience is Better

When debugging a project, it’s nice to be able to dig into the implementation of the library functions that you use. This is made particularly easy when you are building from source, since the exact code that you depend on is already on your machine!

## 3. No ABI Compatibility Issues

Users of GCC will be aware of the std::string ABI changes from 4.9 to 5.0. Whilst this change was necessary to switch to C++ 11, it [caused lots of confusion](https://stackoverflow.com/questions/34571583/understanding-gcc-5s-glibcxx-use-cxx11-abi-or-the-new-abi) in the community. If you’re already building your project from source, then upgrading is an easy task. 😌

## 4. Source-code is Smaller

Due to its code-generation features, this is particularly true of C++: the source-code of a library is often far smaller than its corresponding binary. In fact, with reproducible builds, source-code is an excellent form of compression!

## 5. Compiler Flags Can Be Properly Supported

A library with 1 compiler switch has 2 possible compiled binaries. A library with 2 compiler switches has 4 possible binaries. A library with 3 compiler switches has 8 possible binaries. A library with 4 compiler switches has 16 possible binaries. Now throw cross-compilation into the mix... You get the idea. Not all of these combinations are significant, but the complexity is enormous. When distributing from source, we can support all possible compiler flag settings by allowing the user to control the process.

## 6. Better Optimization

C++ is all about building towers of abstraction that the compiler can tear down into efficient machine code. These abstractions are lost after compilation, and with it important information that might be used to optimize your code. When using binary libraries, you lose the opportunity to perform many cross-library optimizations. Building from source can yield faster code.

## But What About Compilation Times?

This is where a good build system is crucial. We chose [Buck build](https://buckbuild.com), a reproducible build system developed and used by Facebook. Because Buck is reproducible, it becomes possible to cache intermediary build artifacts and share them across your team!

Read [7 Reasons to Use Buck Build](https://hackernoon.com/7-reasons-to-use-buck-build-5b44d7413585).

## Ready to Try Buckaroo?

[Buckaroo](http://buckaroo.pm) is a source-only C++ package manager. To get started, head over to [the documentation](https://buckaroo.readthedocs.io/en/latest/). You can browse the existing packages on [Buckaroo.pm](http://buckaroo.pm) or request more over on [the wishlist](https://github.com/LoopPerfect/buckaroo-wishlist).
