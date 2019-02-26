---
title: "Are Headers Really the Problem?"
created: "2019-02-26T11:00:00.000Z"
author: Team Buckaroo
summary: "A huge barrier that newcomers to C++ face is that of undefined references. We create a project, include a few headers and BOOM, linker error. What if we could fix this at a build-system level?"
---
A huge barrier that newcomers to C++ face is that of undefined references. We create a project, include a few headers and **BOOM**, linker error.

In fact, searches for "undefined reference" do not trail that far behind searches for "clang".

![Google Trends](/img/undefined-ref-trends.png)

*Google Trends, "clang" (red) vs "undefined reference" (blue)*

Why is this?

Well, unlike most languages, C++ splits code into *headers* and *translation-units*. Public headers define the interface for your code - the types, memory layout, available functions, etc. The translation-units define the implementation.

```c++
/* foo.h */

#ifndef FOO_H
#define FOO_H

int foo();

#endif
```

*There is a function call foo, that returns an int*

```c++
/* foo.cpp */

int foo() {
  return 1 + 2;
}
```

*foo returns 1 + 2*

*Undefined references* occur when you depend on a header, but not on the corresponding translation-unit.

Some have argued that this is a reason not to have headers at all. Indeed, Java avoids the use of headers because it makes things simpler:

> Source code written in Java is simple. There is no preprocessor, no #define and related capabilities, no typedef, and absent those features, no longer any need for header files. Instead of header files, Java language source files provide the definitions of other classes and their methods.

[Section 2.2.1 of the Java Language Environment white paper](http://java.sun.com/docs/white/langenv/)

But maybe this isn't a failure of the *language*, but a failure of our *build-systems*.

Using the compiler, a build-system can figure out the list of headers that your project uses. It's not difficult, either.

Suppose we have a project like this:

```bash
$ tree .
.
├── foo
│   ├── bar.h
│   ├── baz
│   │   └── baz.h
│   ├── foo.cpp
│   └── foo.h
├── main.cpp
└── qux
    ├── qux.cpp
    └── qux.h

3 directories, 7 files
```

Then we can find the include-graph for `main.cpp` like this:

```bash
$ gcc -I . -MM ./main.cpp
main.o: main.cpp foo/foo.h foo/bar.h foo/baz/baz.h qux/qux.h
```

So we can figure out the set of headers that a given translation-unit depends on. Now, we need to ensure that if we depend on any header, we also link to its corresponding translation-unit(s).

In this case, we depend on `foo/foo.h`, which is implemented by `foo/foo.cpp` and `qux/qux.h`, which is implemented by `qux/qux.cpp`.

| Header          | Translation-unit(s) |
| --------------- | ------------------- |
| `foo/bar.h`     | `[]`                |
| `foo/baz/baz.h` | `[]`                |
| `foo/foo.h`     | `[ foo/foo.cpp ]`   |
| `qux/qux.h`     | `[ qux/qux.cpp ]`   |

So we need to introduce a rule:

 > If you include header X then you must also link to the target that X belongs to

With this rule in place, we cannot just forget to link `qux.cpp` or `foo.cpp`. If we do, then the build-system will detect this, and tell us where we went wrong.

To support this, targets in the build-system must declare every header-file that belongs to it. Otherwise, we have no way of knowing where a header should come from.

This is quite practical, if you use globs:

```python
headers = subdir_glob([
  ('include', '**/*.h'),
])
```

In summary:

 - Headers are not necessarily evil.
 - We can query the compiler for actual header-usage.
 - Build targets should declare the header-files (not directories) they export.
 - The build-system should enforce that if you include a header-file, you must link the corresponding translation-unit.

---

## Notes

 1. Interestingly, CMake, the most popular C++ build-system, does not get this right. Where it could offer guarantees, it only offers conventions.
 2. Another benefit is that if two targets export headers to the same include-path, we can detect and resolve this conflict. Otherwise the behavior is determined by the order of compiler flags, which is usually coincidental.
 3. Sometimes there is more than one translation-unit for a given header. In this case, we need to ensure that all translation-units for the header are linked.
