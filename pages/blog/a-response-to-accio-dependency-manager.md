---
title: A Response to "Accio Dependency Manager"
created: "2019-02-22T22:00:00.000Z"
author: Team Buckaroo
summary: "There is a Medium post making the rounds at the moment about a dream C++ dependency manager. It's well written, and definitely worth a read. Here's our take. "
banner: https://raw.githubusercontent.com/JamitLabs/Accio/stable/Logo.png
---
There is a Medium post making the rounds at the moment about a dream C++ dependency manager. It's well written, and definitely worth a read: [Accio Dependency Manager](https://medium.com/@corentin.jabot/accio-dependency-manager-b1846e1caf76).

As you might imagine, we have spent a *lot of time* thinking about these issues. Package management is much harder in C++ than in other languages, and the design of Buckaroo went through quite a few iterations! Here's our take on the points discussed in "Accio Dependency Manager".

## "A sane naming scheme"

We agree! That's why packages in Buckaroo are one of two kinds:

 - A (normalized) URL to their project on GitHub, BitBucket or GitLab. For example: `github.com/LoopPerfect/neither`
 - A simple organization and project pair, for ad-hoc dependencies. For example: `myorg/myproject`

## "A sane versioning scheme"

Most Buckaroo packages use *sem-ver*, as you suggest. However, we think it is also important to be able to depend on versions that are not yet ready to be given a sem-ver. For this reason, packages can also depend directly on Git branches and tags. It is always clear what a version refers to because you can view it in Git.

The version DSL is [described in our docs](https://github.com/LoopPerfect/buckaroo/wiki/Version-Constraints-DSL).

## "A Serious dependency Manager"

This is a big difference between Buckaroo and other package managers. We don't want to host your packages and we don't have to. This is because [Buckaroo packages live directly in source-control](https://github.com/LoopPerfect/buckaroo/wiki/Git-as-a-Package-Registry), which is a piece of infrastructure your company already has.

Furthermore, after the packages have been resolved, we save the exact hashes of each. Future installations will use *precisely* the same versions you installed the first time.

## "A source-based dependency manager"

We agree in principle, and Buckaroo is *source-first*.

But there is one big exception: proprietary packages that are only available in binary form. For these we support packages that download the binaries during the build process. The hash is locked-down and always verified.

## "But compile times are slow?"

Not when you use a build-system with [hermetically sealed build-steps and network caching](https://buckbuild.com/concept/what_makes_buck_so_fast.html). This is the main reason that we use [Buck](https://buckbuild.com/) for packages. CMake does not scale well here.

## "What’s a dependency anyway?"

A package might be a signed tar-ball, but that is only half the story. We need to give packages sensible names, and that implies a registry of some kind. Buckaroo [uses existing Git providers](https://github.com/LoopPerfect/buckaroo/wiki/Git-as-a-Package-Registry) for these names.

OK, sure, GitHub is a single-point of failure. However, it is a single-point of failure that most developers *already have*. We think depending on GitHub (or BitBucket, or GitLab) is completely reasonable. For the paranoid, Buckaroo works equally well with a self-hosted Git instance.

## "Building dependencies"

We need a build-system.

To see why, consider what we need to be able to do to build each package:

 - Set the toolchain
 - Set any flags for compilation
 - Build a shared library (where applicable)
 - Build a static library (where applicable)
 - Find the headers provided by the library (generated and source-files)
 - Figure out which artifacts are required from its dependencies (so we can build those, and only those)
 - Link static and shared libraries from its dependencies (where does the package expect them to be?)
 - Extract the list of translation-units (generated and source-files) for IDE integration
 - Cache the build steps so that from-source builds are practical
 - Balance memory and CPU usage across the build so that the whole thing doesn't fall over (hello `make -j12`)
 - Ensure unrelated packages don't interfere with each-other's build process (hermetically sealed builds)

If you have implemented all of these things, then... you have implemented a build-system. You might call this just a "wrapper" script that defers work to another build-system, but this is analagous to how CMake relies on Make. It's another layer of indirection.

Fixing C++ build-system fragmentation is a huge challenge. Luckily, the vast majority of builds are actually quite simple (Boost can be described entirely with globs, for example). We are going to open-source [automated build-system transpilation tools](https://buildinfer.loopperfect.com/) in the very near future. Stay tuned!

And of course you can always call one build-system from other. It's hacky, but in a pinch it can work.


## Summing Up

### "Decentralized"

Check!

### "Have discovery and aggregation features that are or feel centralized, so that end users don’t have to handle URL/URI."

We have GitHub search, but Buckaroo could be improved in this aspect. More tools are coming!

### "Impervious to the loss of nodes, robust and transparently mirrored"

We rely on GitHub, BitBucket and GitLab here. This is a reasonable trade-off given that people already depend on them. Self-hosted Git is fully supported. Buckaroo works offline if your cache is populated.

### "Based on strong security foundations"

We hash everything, and access-control leverages your existing Git key infrastructure. Using Git commits you have full audits of every build.

### "Orthogonal to build systems"

A nice idea, but not really compatible with from-source packages. This approach will lead to a reimplementation of build-system features in meta-meta-build-systems. Build-system transpilation is a better approach in the long run (not to mention the other benefits).

### "Only handling sources, not binaries"

We are source-first, but not handling binaries is impractical. We always check the hash of binaries.

### "Easy to use for a variety of use cases."

We think so, but would love your feedback! 🤠
