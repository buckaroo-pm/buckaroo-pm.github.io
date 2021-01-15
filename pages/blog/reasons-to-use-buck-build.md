---
title: "7 Reasons to Use Buck Build"
banner: "/posts/buck-presentation.jpg"
author: "Team Buckaroo"
created: "2017-05-09T11:00:00.000Z"
---

Buck is a cross-platform, cross-language build system made for large scale compilation at Facebook. All Buckaroo packages use Buck as a build system, so it goes without saying that we’re big fans.

However, even if you’re not at Facebook scale, here are 7 reasons that we think you should give Buck a try.

## 1. Proven Technology

Buck is not just a hobbyist project that might become unsupported when the creator loses interest. It is used in production at Facebook, Uber and Dropbox, to name a few. On top of that, many of the Buck team are ex-Google, where they worked on Blaze, the closed-source predecessor to Buck (and Bazel). Buck is the culmination of a huge amount of knowledge about build systems.

## 2. Correct Incremental Builds

Have you ever deleted your build folder *just in case*? Buck copies (or symlinks) source-files into a staging area before compilation so that dependencies are sandboxed. Every build input (headers, flags and the environment) is used as a cache key for the build artefacts. This disciplined approach means that Buck can give you correct incremental builds, every time.

## 3. Private Headers

For C/C++, Buck allows you to separate the exported headers (headers available to users of your library) from private headers (headers used to build your library). This is a huge win for modularity in C/C++ code, since it prevents other modules from reaching behind your API.

## 4. Hashes, Not Timestamps

Buck knows when to rebuild a target by the hashes of its inputs. This means less developer time gets wasted with unnecessary rebuilds because you touched, but did not change, a file. Buck works incredibly well with branching VCS, such as Git.

## 5. A Proper Scripting Language

Anyone who has worked with CMake will understand the frustration of working with with a subpar scripting language. Buck does not reinvent the wheel and instead uses Python for build scripts.

However, Buck uses Python in a controlled way. The Python scripts are used to generate the build targets, rather than execute the build itself. This allows Buck to execute the Python code in a single thread but afterwards perform the build in parallel. As an added bonus, this means that the result of the Python can be cached.

## 6. Faster Builds

Buck understands the dependency graph of your project, allowing it to build independent artefacts in parallel. However, unlike make -j4, Buck is always deterministic. You can even share incremental compilation results across your team using [Buck Server](https://github.com/uber/buck-http-cache).

## 7. Easy to Reason About

Perhaps the best feature of Buck is that build files are easy to reason about. Each target can only use the dependencies it declares, dependency cycles are not allowed and recursion between build outputs is impossible.

Even if you have never used Buck before, you can probably make sense of this:

```python
cxx_library(
  name = 'my-library',
  exported_headers = subdir_glob([
    ('include', '**/*.hpp'),
  ]),
  srcs = glob([
    'src/**/*.cpp',
  ]),
)

cxx_binary(
  name = 'my-app', 
  srcs = [
    'main.cpp',
  ], 
  deps = [
    ':my-library',
  ],
)
```

## Convinced?

Head over to the [Buck website](https://buckbuild.com/) to get started.
