---
title: "(Even) More Reasons to use Buck Build"
banner: "/posts/even-more-reasons-to-use-buck.jpeg"
author: "Team Buckaroo"
created: "2018-10-12T11:00:00.000Z"
attribution: “Why? signage near grass during daytime” by Ken Treloar on Unsplash
---

## Excellent Precompiled Header Support

Most people have a love-hate relationship with precompiled headers (PCH). On the one hand, they can dramatically accelerate your build-times from scratch (30% is not unheard of), but on the other hand, they *can* have devastating effects on your incremental build-times.

Once in use, precompiled headers must be updated every time an included header changes. Now, every translation-unit that uses the PCH will also need to be recompiled, which may be far more often than necessary. PCHs effectively make every translation-unit depend on every header file in the PCH.

However, with Buck you can have the best of both worlds. By switching enable_pch for your builds from scratch (e.g. CI builds) and then disabling it for incremental builds (e.g. for development) you can use PCHs only when appropriate. Buck encodes PCHs as a high-level abstraction, so no boiler-plate code in your build scripts is required to implement this.

Furthermore, Buck ensures that all PCHs, libraries and executables use the same set of compiler and preprocessor flags.

## Cache Sharing is Built-in

Have you ever hesitated to switch branch when reviewing a PR because it might trigger a full rebuild? Buck can share your cache via your file-system or a HTTP. This means that you can switch to a different branch and return back, whilst maintaining your build cache.

## Builds are Reproducible

Build steps can be very complex, with identical builds resulting in slight differences on a binary level. As a result the hash of artefacts is not reproducible, causing many unnecessary rebuilds due to cache misses. Buck orchestrates common tools such as GCC so as to ensure that the artefact hash only changes with its inputs. With Buck you will rebuild less often.

## Good Support for Custom Build-scripts

Unlike most build-systems, Buck caches every artefact, including generated files. Each artefact is only rebuilt if the hash of its dependencies change. This is more comprehensive than solutions that only cache C++ compiler artefacts, such as CCache.

## Robust Toolchain Support

Build-systems without many abstractions, such as Make, depend on conventions to define your toolchain. For example, the C++ compiler might be defined as $CXX. This is brittle, because it requires everyone to follow the same convention, and can prove to be a nightmare when you have many dependencies. Buck works at a higher level of abstraction, so you define your toolchain once and it guarantees that it is respected across your entire project.

## Extra: Experimental Support for Skylark

Buck and Bazel are converging to the same build description language: Skylark. Skylark is a subset of Python that offers faster parsing time, among other things. In some large projects, this reduces the parsing time from a couple of minutes to just a couple of seconds.

## You may also be interested in…
[**7 Reasons to Use Buck Build**
*Buck is a cross-platform, cross-language build system made for large scale compilation at Facebook. All Buckaroo…*hackernoon.com](https://hackernoon.com/7-reasons-to-use-buck-build-5b44d7413585)
[**Lessons Learned from Porting 300 C/C++ Projects to Buck Build**
*With Buckaroo we are turning the huge ecosystem of C/C++ projects into a collection of easily composable building…*hackernoon.com](https://hackernoon.com/lessons-learned-from-porting-300-projects-to-buck-build-ff6463b65142)
