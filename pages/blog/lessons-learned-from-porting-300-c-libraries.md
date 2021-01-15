---
title: "Lessons Learned from Porting 300 C/C++ Projects to Buck Build"
banner: "/posts/300packages.jpeg"
author: "Team Buckaroo"
created: "2017-05-16T11:00:00.000Z"
---


With [Buckaroo](https://www.buckaroo.pm/) we are turning the huge ecosystem of C/C++ projects into a collection of easily composable building blocks. We can’t do this alone, but to kickstart the community we took it upon ourselves to port 300 projects to the [Buck build system](https://buckbuild.com/).

The libraries we chose were based on their popularity on GitHub, StackOverflow and requests from our mailing list. They ranged from [tiny header-only libraries](https://www.buckaroo.pm/project/philsquared/catch) to [monolithic C++ projects](https://www.buckaroo.pm/project/boost/graph) to [old, but critical, C libraries](https://www.buckaroo.pm/project/openssl/openssl).

For every library we tried to do a complete port to Buck. There were a few cases where this didn’t work out; sometimes the project structure was so convoluted that we decided it was more practical to wrap the existing build system. We can revisit those projects later, but for the most part, the porting effort was successful.

Having studied so many projects, we thought it would be good to compile a list of DOs and DON’Ts for architecting clean C/C++ libraries.

## DON’T: Concatenate .cpp files into a single translation-unit

An anti-pattern found in many C/C++ projects is the practice of combining multiple C/C++ files into a single translation-unit for compilation. The theory goes that this improves compilation times because the preprocessor and parsing steps only need to be performed once for the entire build. This is true for a single build, but it destroys your ability to do incremental builds. With a single translation-unit, the compiler must perform the entire build from scratch whenever any of the project files change!

## DO: Make your dependencies clear

Using existing libraries is a net-positive for everyone. The library code gets better tested, which is great for the community, and less work is repeated, which is great for you! However, the lack of a dominant C/C++ package manager means that multiple approaches to this — some sub-optimal — are being used.

When writing your library, make sure you document its dependencies clearly. Here are some reasonable ways to do it:

* Git submodules

* A list of apt-get or brew install commands — although users of your library may be annoyed if they have to modify their system to use it!

* A good [package manager](https://buckaroo.pm/)

## DON’T: Use include_next, unless you really have to

#include_next is an obscure feature of the preprocessor that allows the user to include a file inside itself. It is intended to allow for patching of system headers; the [GCC docs](https://gcc.gnu.org/onlinedocs/cpp/Wrapper-Headers.html) explain it as follows:
> Sometimes it is necessary to adjust the contents of a system-provided header file without editing it directly. GCC’s fixincludes operation does this, for example. One way to do that would be to create a new header file with the same name and insert it in the search path before the original header. That works fine as long as you’re willing to replace the old header entirely. But what if you want to refer to the old header from the new one?

In practice, this feature can lead to very confusing outcomes; many programmers aren’t familiar with it; and its behaviour can be difficult to trace. Avoid using this feature unless you really have to.

## DO: Keep private headers and exported headers separate

Maintaining a well-defined API for your library is a really good idea. It allows you to make under-the-hood tweaks without breaking downstream consumers and it provides a clear surface for unit-testing.

Ideally, you should separate the private and exported headers into their own folders. I quite like this convention:

* include— Headers that are made available to users of the library

* private— Headers that are required to compile the library, but should not be made available to consumers of the library

## DON’T: Include .cpp files

The C/C++ preprocessor is incredibly flexible and allows you do things you probably shouldn’t. One example is including .cpp files. This is extremely confusing as the file extension no longer matches the intent. Is this file meant to be a header? Then give it a .h or .hpp extension. Is this file meant to be compiled? Then don’t include it.

## DO: In your examples, use the library how it is intended to be used

Many times I found examples that were written as if they are in the source directory of the library:

    #include “../../things.h”

Examples should be show-case of the intended usage of your library. This means including the headers as they are meant to be used downstream:

    #include <my-library/things.h>

Of course, this requires that you set your include paths correctly, but a [good build system](https://www.buckbuild.com) should make this trivial.

## DON’T: Copy your dependencies into your project

If you are not using a [package manager](https://buckaroo.pm/), it can be tempting to just copy the projects that you depend on into source-control. This has the advantage that everyone is building the same code, but it can be a nightmare for consumers of your library.

For example, suppose you are the author of library A, which depends on library Bv1. However, one of your users is writing library C, which depends on A and Bv2. Now, when they try to build your project they get symbol collisions and must either downgrade to Bv1 or submit a PR on A! A much better approach is to use a package manager that can resolve B to a version that works for all dependencies in the project. At the very least, using Git submodules can make such upgrades more manageable.

An exception to this rule is the inclusion of tiny header-only libraries that are used for development tasks, such as the [Catch testing framework](https://github.com/philsquared/Catch).

## DO: Namespace your header files

You should choose a unique name for your library — use [a generator](http://mrsharpoblunto.github.io/foswig.js/) if you get stuck — then place all of your exported headers into a folder with that name. This makes name collisions with other libraries far less likely.

## DON’T: Overuse the preprocessor

The C/C++ preprocessor is itself a [programming language](http://www.ioccc.org/2001/herrmann1.hint), enabling all kinds of compile-time magic and code-generation. The problem is that the preprocessor can be very hard to debug since the tooling is not as good as that available for C/C++.

So why use the preprocessor? In the past, the logic went that the preprocessor is guaranteed to execute at compile-time and therefore to gain maximum performance, logic should be implemented there where possible. Compilers have improved greatly since then, and will now [do much of this work for you](https://godbolt.org/g/90NjyJ). As such, with modern tooling it is best to avoid implementing logic in the preprocessor when it could be implemented in C/C++. Trust your compiler!

If you must use the preprocessor, for example to implement [stackless coroutines](https://github.com/jamboree/co2), then aim to minimize its usage. Hopefully these cases will be incorporated into the C++ language in the future, much like templates were in the past.

## DO: Abstract platform differences using files

It might be tempting to sprinkle a couple #ifdef __MACOS__ #endif commands in your source-code, but the truth is that it makes it very hard to read the code. If you split your platform-specific implementations into separate files, then your build system can include, compile and link the appropriate files. This makes the code more maintainable and approachable for new readers.

## DON’T: Depend on compiler specific features (unless you really have to)

The big three C++ compilers (Clang, VC++, GCC) all have their quirks and it is possible to write code that compiles in one but not the others. This is usually avoidable by sticking to the language standard (or a subset in the case of VC++).

I get it — some of these vendor-specific features can be convenient (#pragma once) — but by not making your library portable you’re reducing the impact of your work. You lose the satisfaction of making a big impact on the C++ community and the community lose what could have been a great, portable library.

If you need specific features, such as __builtin_popcount, write an abstraction over the built-in version and also a portable version. Then, split the implementations into separate files and let your build system know about your intent. Better yet, reuse [an abstraction that has already been written](http://buckaroo.pm/project/boost/thread).

## DO: Use folders to partition categories of files

Listing project files by hand is quite tedious. A common solution is to use a [glob](https://en.wikipedia.org/wiki/Glob_(programming)) command. Glob is a very powerful tool, but you can make things much easier by laying out your files in a glob friendly way. This means partitioning files into logical folders based on their purpose.

### A poorly arranged project

```
    .
    ├── common.cpp
    ├── foo.cpp
    ├── pthread.cpp
    └── win_thread.cpp
```
### A tidily arranged project
```
    .
    ├── common
    │   ├── common.cpp
    │   └── foo.cpp
    ├── linux
    │   └── pthread.cpp
    └── windows
        └── win_thread.cpp
```
## That’s it! 🙌

The Buckaroo packages are [ready to use right now](https://buckaroo.readthedocs.io/en/latest/installation.html), and we are hard at work [porting more](https://github.com/LoopPerfect/buckaroo-wishlist). If you require a particular library, [create an issue on the wishlist](https://github.com/LoopPerfect/buckaroo-wishlist/issues/new). Or (even better) if you would like to contribute, [PRs are always welcome](https://github.com/LoopPerfect/buckaroo-recipes)!
