---
title: "Why Not Make?"
summary: "Make is a conceptually simple build-system, and it is packaged with major Linux distributions. However, Make should rarely be your build-system of choice when starting a new C++ project."
banner: "/posts/why-not-make.jpeg"
attribution: "“blue building block lot” by Iker Urteaga on Unsplash"
author: "Team Buckaroo"
created: "2018-11-07T11:00:00.000Z"
---
Make is a conceptually simple build-system, and it is packaged with major Linux distributions. However, Make should rarely be your build-system of choice when starting a new C++ project.

That’s a bold claim, so here’s why…

### Writing a Large, Correct Makefile is Really Hard

The dependency graph of a C++ library is actually quite complex. It must be rebuilt every time a linked object-file changes… But an object-file should be rebuilt every time its translation-unit changes, or the compilation flags change, or if any of its included headers change, or if the compiler changes…

You can query this information using the compiler and encode all of this in a Makefile, but it’s going to get really verbose.

There’s a high chance that you will miss a dependency. If this happens, then you might have stale artefacts after a change. Cue a clean build!

### No Sandboxing

The lack of sandboxing is the root problem. Make has a dependency graph, but it does not actually enforce it. What this means is that a build-rule can read a file even if it is not declared as a dependency in Make!

### Caches are Not Portable

Make does not allow you to share build artefacts across a network, so everyone on your development team will be performing the same build-steps over and over!

Yes, you can use CCache, but that is not general (only compiler calls are cached) and it isn’t provided out-of-the-box.

### No Language Abstractions are Provided

Make’s simplicity is a big strength, but it is also a major weakness. Make doesn’t provide any language-specific abstractions, so you have to write them yourself. This can get very tedious, and the odds of making a mistake are high.

This also goes for tests, deployments and so on. You need to build everything yourelf.

### Timestamps, Not Hashes

In determining when to rebuild, Make uses the timestamps of build inputs rather than their hashes. This results in many unnecessary rebuilds when a file has been touched, but has not actually changed. If this happens deep in the dependency tree, then the rebuild will take a long time!

## So When Should You Use Make?

It’s not all bad; Make still has its place as a bootstrapping tool. If you have extreme dependency requirements (for example you are building Linux from source), then you need something simple and self-contained. But for most developers this just isn’t the case. We already fetch Clang, GCC and Visual Studio as prebuilt binaries, so why not download a prebuilt build-system?

## Since You’re Here…

We recently announced [BuildInfer](https://buildinfer.loopperfect.com/), a new tool to optimize your C/C++ build scripts. [Take a look](https://buildinfer.loopperfect.com/)!

![](https://cdn-images-1.medium.com/max/2000/1*pkwieX1RSK5S0LXbFyaEJg.png)
