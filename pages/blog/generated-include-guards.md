---
title: "Generated Include Guards: An Alternative to pragma once"
banner: "/posts/generated-include-guards.jpeg"
author: "Team Buckaroo"
created: "2017-10-18T11:00:00.000Z"
attribution: "Photo by Toa Heftiba on Unsplash"
---

## Introduction

In C++, nothing prevents the programmer from including a header-file multiple times. This can cause a duplication of definitions, which is an error. Since it is difficult to ensure that a header-file is only included once, a common strategy is to make only the first include count. This can be done using an “include guard”, a small piece of preprocessor logic that looks like this:

```cpp
#include "foo.hpp"
#include "foo.hpp"
```

### How Does it Work?

On the first include, HEADER_HAS_BEEN_INCLUDED is not defined, so we define foo. On subsequent includes, HEADER_HAS_BEEN_INCLUDED has been defined, so we just skip the content.

For example, if we have this C++ file:

```cpp
#ifndef HEADER_HAS_BEEN_INCLUDED
#define HEADER_HAS_BEEN_INCLUDED

struct foo {
  int member;
};

#endif
#ifndef HEADER_HAS_BEEN_INCLUDED
#define HEADER_HAS_BEEN_INCLUDED

struct foo {
  int member;
};

#endif
```

Then it will expand to this:

```cpp
struct foo {
  int member;
};
```

And after the preprocessor has finished, we are left with this:

```cpp
#pragma once

struct foo {
  int member;
};
```

This is the idiomatic approach, but it has some limitations:

1. Three lines of boiler-plate code are required

2. The variable name on lines 1 and 2 must match *exactly*

3. The same variable name must not be used in multiple files

4. We have to remember the #endif, which is located at the other end of the file to the #ifndef

### What About pragma once?

#pragma once was designed to overcome these issues. It is a non-standard, but widely supported, feature of C++ compilers. The concept is simple: any file containing #pragma once will only *actually* be included once, even if the programmer includes it multiple times.

Using `#pragma once`, our examples becomes:

```
for each header file:
  hash the file
  generate an include guard from the hash
  wrap the contents 
  output into a new header file
```

Looks good, right? Sadly #pragma once brings a host of problems.

The root cause is that #pragma once is concerned with *where* some code lives, rather than its *content*. If you have two copies of the same file accessible via multiple paths, then it will get included twice. And, if you have two paths that *appear* different, but are actually the same, then the compiler may not spot this. To top things off, it is not standard, so compiler implementations do not have to respect its semantics.

## A Possible Workaround

The problems with #pragma once stem from the fact that it works off of a file’s location, rather than its content. What if we just used the content instead?*(Of course, recording all of the contents of each header would be slow, but we can optimize by recording a hash of the content instead).*

The process would be:

1. When a header-file is included, hash it
2. If the hash has been seen before, then ignore the include
3. Otherwise, include the header as normal

This would be a robust solution because it is not at all concerned about the path a file is found at, only its content.

## Implementing the Workaround

Adding a new command to the C++ standard would take considerable time, but luckily we can implement this logic using scripting and preprocessor.

The basic idea is this:

```
for each header file:
  hash the file
  generate an include guard from the hash
  wrap the contents 
  output into a new header file
```

So, for example this header:

```cpp
int add(int x, int y);
```

Has a SHA-256 hash of:

```
786be73f07f8bf5cc4c26dd0bb4f57e0777671adf256e6d5168a4f0c02f167b6
```

So the generated header might be:

```cpp
#ifndef INCLUDED_786be73f07f8bf5cc4c26dd0bb4f57e0
#define INCLUDED_786be73f07f8bf5cc4c26dd0bb4f57e0

int add(int x, int y);

#endif
```

Whilst the transformation for individual files is simple ([Python script](https://github.com/njlr/buck-include-guards/blob/84c3a67dcb5eb6d9924cacc4f2c33723beb6245a/scripts/add-include-guard.py)), we still need to manage the transformation process. We need to ensure that:

* The transformation is run for every file

* New files are automatically transformed

* The transformations of deleted files are automatically removed

* The transformation is only re-run when the file has changed

* *Bonus: Transformations can be safely put into a shared network cache*

Using [Buck build](https://buckbuild.com/), we can encode this logic into a project’s build script easily.

Let’s start with a build-rule for a single file and then generalize:

```python
genrule(
  name = 'guarded-add', 
  out = 'add.hpp',
  srcs = [
    'scripts/add-include-guard.py',
    'add.hpp',
  ],
  cmd = 'python $SRCS > $OUT',
)
```

A genrule in Buck is much like a target in Make. We define the input files, the output file name and the command to execute. This target takes our Python script for generating an include guard and runs it on add.hpp. Unlike Make, Buck will isolate and cache the process on its input hashes.

Now we have a single file working, we can generalize the process to n files. To do this, we make a Python function that creates a genrule for a given file:

```python
def add_include_guard(x):
  name = hashlib.sha256(x).hexdigest()[0:16]
  genrule(
    name = name,
    out = os.path.basename(x),
    srcs = [
      'scripts/add-include-guard.py', 
      x,
    ],
    cmd = 'python $SRCS > $OUT',
  )
  return ':' + name
```

To get the set of header files, we run a glob expression. For example:

```python
mathutils_headers = subdir_glob([
  ('mathutils/include', '**/*.hpp'),
])
```

And to bring it all together:

```cpp
cxx_library(
  name = 'mathutils',
  header_namespace = 'mathutils',
  exported_headers = dict([
    (x, add_include_guard(y)) for (x, y) in mathutils_headers.items()
  ]),
  srcs = glob([
    'mathutils/src/**/*.cpp',
  ]),
)
```

You can find a complete [working example on GitHub](https://github.com/njlr/buck-include-guards).

Now, our header files can be written without include guards or #pragma once:

```
int add(int x, int y);
```

This setup in Buck is really nice to work with:

* Zero boiler-plate in the header files

* Buck will automatically check for new header files, so that builds are always up-to-date

* Buck will remove stale generated headers

* Because it understands the target graph, Buck will generate headers in parallel

* Buck will cache generated headers so that they are only computed when required

* We are no longer relying on human accuracy (include guards) or non-standard features (#pragma once)

## Since You’re Here…

We created [Buckaroo](https://github.com/LoopPerfect/buckaroo) to make it easier to integrate C++ libraries. If you would like try it out, the best place to start is [the documentation](https://buckaroo.readthedocs.io/en/latest/). You can browse the existing packages on [Buckaroo.pm](https://www.buckaroo.pm/) or request more over on [the wishlist](https://github.com/LoopPerfect/buckaroo-wishlist).
[**Approaches to C++ Dependency Management, or Why We Built Buckaroo**
*C++ is an unusual language in that it does not yet have a dominant package manager (we’re working on it!). As a result…*hackernoon.com](https://hackernoon.com/approaches-to-c-dependency-management-or-why-we-built-buckaroo-26049d4646e7)
