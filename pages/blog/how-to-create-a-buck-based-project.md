---
title: "How to Create a Buck-based C/C++ Project"
banner: "/posts/deer.jpeg"
author: "Team Buckaroo"
created: "2017-05-15T11:00:00.000Z"
---


[Buck](https://buckbuild.com/) is a fast build tool developed by Facebook. There are [many reasons to choose Buck](https://hackernoon.com/7-reasons-to-use-buck-build-5b44d7413585), but how should you get started?

This walk-through will cover:

* How to organize your project

* Integration of Google Test

* Explanation of the basic Buck commands

### TL;DR

Browse [the project files on GitHub](https://github.com/njlr/buck-cpp-example), or clone them onto your system:

    git clone [git@github.com](mailto:git@github.com):njlr/buck-cpp-example.git

Install existing Buck ports from [Buckaroo.pm](https://www.buckaroo.pm).

## How Buck Works

Before we start, it might be helpful to understand how Buck works. Rather than retread old ground, take a look at this talk from the Buck devs.

<center><iframe width="560" height="315" src="https://www.youtube.com/embed/uvNI_E0ZgZU" frameborder="0" allowfullscreen></iframe></center>

## Installing Buck

The official guide for installing Buck is [available on their website](https://buckbuild.com/setup/getting_started.html). However, the quickest way is probably to use Homebrew or Linuxbrew.

* If you are using Linux, you can install Linuxbrew using a [one-liner on their website](http://linuxbrew.sh/).

* Ditto for [Homebrew](https://brew.sh/) on macOS.

Once you have a “brew” installed, add the Facebook tap and install Buck:

```
brew tap facebook/fb
brew install --HEAD facebook/fb/buck
```

Verify your installation with:

```
buck --version
```

## Organizing Your Files

Once Buck is installed, it’s time to create the project folders. Buck makes it easy to support any folder structure you like, but for this demo we will be following the C/C++ convention of src and include folders.

This project will consist of two parts:

* demo — an executable that computes 3 + 4and prints the result

* mathutils — a library that provides simple adding functionality

*Note: This is a simple example for demonstration purposes; Buck is capabable of building [complex C/C++ projects](http://buckaroo.pm/search?q=*)!*

First, create the following structure somewhere on your drive:

```
    .
    ├── .buckconfig
    ├── BUCK
    └── demo
        ├── include
        └── src
            └── main.cpp
```
Using the command-line:

```
    touch .buckconfig
    touch BUCK

    mkdir demo
    mkdir demo/include
    mkdir demo/src
    touch demo/src/main.cpp
```
That’s quite a few files — let’s run through them:

* A `.buckconfig` is required before you can run any Buck commands. It tells Buck where the root of your project is and can also be used to configure any settings that are global to your project. For now we can leave it empty.

* The `BUCK` file is where we will define the target for our binary. There can be multiple `BUCK` files in a `Buck` project, which is useful when you want to seperate the build logic for different aspects of your project, such as libraries and tests.

* `demo/include` is where we will be putting any headers used by the binary.

* `demo/src` is where we will be putting our translation-units (in this case .cpp files) for the binary.

* `demo/src/main.cpp` will be the entry-point for our application.

### main.cpp

To get started, we will write a simple hello-world program. Paste the following into main.cpp:

```cpp
#include <iostream>

int main() {
  std::cout << "Hello, world. " << std::endl;
  return 0;
}
```

### BUCK

To build the main.cpp file, we need to write a Buck target for it. Into the BUCK file, paste the following:

```cpp
cxx_binary(
  name = 'demo',
  header_namespace = 'demo',
  headers = subdir_glob([
    ('demo/include', '**/*.hpp'),
  ]),
  srcs = glob([
    'demo/src/**/*.cpp',
  ]),
)
```

BUCK files are written in a dialect of Python 2, with a few extensions. When you call buck build, Buck will execute the Python and record any targets the are defined. Once the list of targets has been resolved, each target is built in accordance with its type.

You can see the full list of target-types in [the Buck docs](https://buckbuild.com/rule/cxx_binary.html), but the important ones for C/C++ are cxx_binary, cxx_library and prebuilt_cxx_library.

* `cxx_binary` — a bundle of C/C++ translation-units and headers that contain an entry-point (e.g. int main()). A cxx_binary can be executed once compiled. It should not be a dependency.

* `cxx_library` — a bundle of C/C++ translation-units that can be used by other targets. Unlike a cxx_binary, a library also defines a list of exported_headers, which are the header-files made available to its dependents.

* `prebuilt_cxx_library` — like a `cxx_library`, but with an optional object-file in the place of translation units. Header-only libraries are implemented as a `prebuilt_cxx_library` with no object-file.

## Buck Commands

Now that the BUCK file is in place, Buck can build the target. Run the following:
```
buck build //:demo
```
The command tells Buck to build the target :demo found in the BUCK file adjacent to .buckconfig.

Buck uses a simple addressing system for targets based on the actual folder-structure of the project. For example, //examples/basic/:demo refers to the target demo defined in examples/basic/BUCK.

After the build completes, you should find an executable at buck-out/gen/demo. You can build and run this using:
```
buck build //:demo && ./buck-out/gen/demo
```
Or, Buck can do it for you:
```
buck run //:buck-cpp-example
```
You will notice that running the build for a second time is extremely fast. This is because Buck caches everything, including the output of the Python scripts!

## Adding a Dependency

Let’s implement mathutils so that we can use it in the demo application.

Create the following folder structure in your project:

```
   .
    └── mathutils
        ├── BUCK
        ├── include
        │   └── add.hpp
        └── src
            └── add.cpp
```
Using the command-line:

```
mkdir mathutils
mkdir mathutils/include
mkdir mathutils/src

touch mathutils/BUCK
touch mathutils/include/add.hpp
touch mathutils/src/add.cpp
```

And the files themselves:

```cpp

#ifndef MATH_HPP
#define MATH_HPP

int add(int x, int y);

#endif
```

```cpp
#include <mathutils/add.hpp>

int add(int x, int y) {
  return x + y;
}
```

```cpp
cxx_library(
  name = 'mathutils',
  header_namespace = 'mathutils',
  exported_headers = subdir_glob([
    ('include', '**/*.hpp'),
  ]),
  srcs = glob([
    'src/**/*.cpp',
  ]),
  visibility = [
    '//...',
  ],
)
```

There are a few important points about this BUCK file:

* The header_namespace is set to 'mathutils'. This puts every header-file that the library exports into a folder with that name, making file-name collisions with other libraries less likely.

* The glob rules are rooted at the BUCK file, so src/**/*.cpp actually corresponds to mathutils/src/**/*.cpp from the project root.

* The visibility is set to //... so that the target can be taken as a dependency by all other targets in the project. In English it means “this library is visibile to every other target below root”.

### Using the Add Function

Now we can use the mathutils library in the demo executable.

First, declare the dependency of demo on mathutils. Change the BUCK file at the root of the project to:

```cpp

cxx_binary(
  name = 'demo',
  header_namespace = 'demo',
  headers = subdir_glob([
    ('demo/include', '**/*.hpp'),
  ]),
  srcs = glob([
    'demo/src/**/*.cpp',
  ]),
  deps = [
    '//mathutils:mathutils',
  ],
)
```

Now update main.cpp to:

```cpp
#include <iostream>
#include <mathutils/add.hpp>

int main() {
  std::cout << "Hello, world. " << std::endl;
  std::cout << "3 + 4 = " << add(3, 4) << std::endl;
  return 0;
}
```

Use Buck to run demo to see the result. You will notice that Buck knows how to link mathutils for you.

## Google Test

Our application is working, but to be diligent we should add some unit-tests!

Buck supports all C/C++ testing frameworks via buck run, but it provides additional integration with Google Test.

### Fetching the Google Test Source-code

Git provides a simple way to grab the Google Test source-code using submodules. We will be using [a fork](https://github.com/njlr/googletest) that contains a BUCK file, but you can use the master and write your own if desired.
```
git submodule add git@github.com:njlr/googletest.git
cd googletest/
git checkout 48072820e47a607d000b101c05d796ebf9c4aad2
cd ../
```

Now we need to tell Buck where to find the Google Test sources. Open the .buckconfig and add the following:

```ini
[cxx]
  gtest_dep = //googletest:gtest
```

This tells Buck where to find the Google Test target that it can use for your tests. There are other config properties that can be set; have a browse in the [Buck docs](https://buckbuild.com/concept/buckconfig.html).

### Writing a Test

We will put the tests into a mathutils/test, alongsidemathutils/src and mathutils/include:
```
    .
    └── mathutils
        ├── BUCK
        ├── include
        │   └── add.hpp
        ├── src
        │   └── add.cpp
        └── test
            ├── BUCK
            └── add.cpp
```
Using the command-line:

```
mkdir mathutils/test
touch mathutils/test/add.cpp
```

And the test itself:

```cpp

#include <gtest/gtest.h>
#include <mathutils/add.hpp>

TEST(mathutils, add) {
  ASSERT_EQ(3, add(1, 2));
  ASSERT_EQ(7, add(4, 3));
}
```

Finally, we need to declare the test in the BUCK file:

```cpp
cxx_test(
  name = 'add',
  srcs = [
    'add.cpp',
  ],
  deps = [
    '//mathutils:mathutils',
  ],
)
```

Now the tests can be run by Buck:
```
buck test //mathutils/test:add
```
Or, to run all tests:
```
buck test
```
## Conclusion

And that’s it! Buck is a powerful tool that will [save you hours of waiting over the development cycle of a project](http://zserge.com/blog/buck-build-system.html). To learn more, read [the docs](https://buckbuild.com/setup/getting_started.html) or watch some of the [Buck presentations](https://buckbuild.com/presentations/index.html).

If there is a library you need to port to Buck, take a look at [Buckaroo.pm](https://www.buckaroo.pm/). We’ve already ported 300 projects, and are [working on even more](https://github.com/LoopPerfect/buckaroo-wishlist)!