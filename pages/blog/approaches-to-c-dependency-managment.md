---
title: "Approaches to C++ Dependency Management, or Why We Built Buckaroo"
banner: "/posts/why-we-built-buckaroo.jpeg"
author: "Team Buckaroo"
created: "2017-07-17T11:00:00.000Z"
attribution: "It’s JavaScript… which is distributed as source-code! (Photo by Markus Spiske on Unsplash)"
---


C++ is an unusual language in that it does not yet have a dominant package manager ([we’re working on it](https://buckaroo.pm/)!). As a result, C++ developers have turned to a few different methods of re-using code across projects.

This lack of standardization has had negative effects on the ecosystem. There is a [cottage industry](https://github.com/nothings/single_file_libs) of “header-only” C++ libraries — tiny libraries of just a few files, ready to be copied directly into a project. Monolithic libraries such as [Boost](https://github.com/boostorg) get larger and larger, since it’s easier to add “one-more-feature” than it is to integrate further libraries. Can we really say that either of these extremes are the best way to organize code, or are they simply the result of a gap in the ecosystem?
> # Can we really say that either of these extremes are the best way to organize code, or are they simply the result of a gap in the ecosystem?

As a C++ developer, what dependency management methods are available? How do they differ and what is the best approach?

## Where are we trying to get to? 🤔

OK, so before deciding on the best approach, and explaining why we built Buckaroo, it’s important to specify what we are trying to achieve. What is a dependency management solution, and what makes one good?

### What is Dependency Management?

Dependency management is the process of maintaining links to external libraries used by your project. By adding dependencies, you can reuse code in your project, which has two advantages:

1. You do not have to write that code yourself.

1. You benefit from a community of other users who test the code in production environments.

A dependency manager makes it easier to maintain these external libraries by providing automated tooling.

### What Makes a Good Dependency Manager?

For the majority use-case, we came up with a list of requirements that a good packaging solution must meet.

### **1. It should be easy to add new dependencies to a project.**

It seems obvious, but this point is easily missed in the pursuit of other requirements. If it is difficult to add dependencies, then developers will be more likely to re-implement functionality. Their one-off implementation will be less well-tested than a community one, and the developer will have diverted time away from other features.

Because dependency graphs can be complicated, transitive dependencies should be fetched and resolved automatically as part of the installation procedure.

### 2. Understanding the dependencies that a project uses should be trivial.

Whilst making it easy to add dependencies encourages code re-use, the down-side is the accidental complexity that can be introduced by over-zealous imports. It is critical that developers can easily inspect the dependencies that are used, and prune them as requirements change. And to aid in debugging, the source-code of dependencies should be readily available.

### 3. It should work on all major platforms. Cross-compilation should be easy, not just an after-thought.

A common misconception of C++ is that unlike VM languages, such as Java, the code is not portable across platforms. The truth is that C++ is portable, but in a different way. Whilst Java compiles to a byte-code format, which is platform neutral and can be deployed anywhere, C++ is only portable *before compilation*. This means that to maintain portability, a C++ package manager must provide the source-code for every package, with binaries only as an optimization.

### 4. Dependency installation should be reproducible. Every developer should be building the same code.

Just as reproducibility is crucial in a build system, it is crucial in any package manager that builds on top. Reproducibility means that the developer can be confident that the code being testing and deployed is what they expected. This prevents subtle bugs from appearing only on some machines, causing production down-time and endless developer frustration!

### 5. A dependency should be project-centric. In other words, installing a dependency should not modify your system.

Project-centric solutions are important when writing software because they reduce friction when trying out different dependencies. If adding a dependency requires changing a machine’s configuration, then developers will be reluctant to try it; something might break and no one wants to have to remember how to reconfigure things afterwards. Even worse, a dependency may be incompatible with a requirement of some system component. A packaging solution should work entirely inside of a project.

### 6. It should be easy to publish new packages.

When developers contribute their work to the open-source community, or just to colleagues within their organization, they are multiplying the impact of their efforts. We should encourage this! The best way to do so is to make it incredibly easy to publish packages. The process should be self-service; there should be no need for additional infrastructure and you shouldn’t need to wait for approvals.

### 7. Require the minimal amount of additional infrastructure, such as servers.

Regardless of how easy it is to deploy, additional infrastructure creates extra costs and adds another point of failure. A good solution will use existing infrastructure wherever possible.

## Different Approaches

OK, let’s start with a quick round-up of the different approaches.

### Copy-and-Paste

This is the simplest method of dependency management, and it’s even [used by some big projects](https://github.com/SFML/SFML/tree/master/extlibs)!

The problem with this method is that it provides very little actual management. The transitive dependencies of code must be resolved by hand, dependency upgrades are manual and, most crucially, the exact version that was copied must be tracked by the developer. If a binary has been copy-pasted, then cross-compilation is difficult.

Still, to it’s credit, the copy-and-paste approach requires no external tools, reproducibility comes for free and it is trivial to set-up.

### apt-get (And Similar)

Some developers argue that C++ already has a package manager, and that it’s built into Linux. Using apt-get, many C++ libraries can be installed onto a target machine.

So why not use apt-get? Whilst apt-get is an excellent way to install applications onto your machine, problems occur when using a system package manager for project-level packages:

* It is tied to the operating system. apt-get only works cleanly on Linux, and usually only on Debian environments.

* Installing binaries onto your system does not help with cross-compilation.

* It modifies your system. What happens when you are working on two projects that require different versions of a dependency?

* apt-get does not guarantee reproducibility, although [other package managers](https://nixos.org/nix/) do. 👍

* You have little control over the chosen ABI, build configuration or standard library used.

### Docker & apt-get 🐳

One solution to the problems of apt-get is to do all of your development inside of a Docker container. Create a container for every project that you are working on, and simply install every project dependency as a system dependency in that container.

This certainly works, but it has a few limitations:

* Developing native Windows software is more or less a non-starter. Yes, you can Docker on Windows, but it is still a Linux environment. You will need to cross-compile and then run outside of Docker for testing.

* You are still limited to the packages that apt-get provides, and these change over time.

* Docker runs as root, which is questionable from a security perspective. *(Correction: [Docker is now root-less](http://www.infoworld.com/article/3030558/application-virtualization/docker-goes-rootless-and-thats-a-good-thing.html))*

* It requires significant disc-space, since Docker keeps a copy of system libraries.

* You may need to install tooling for a second time inside of the Docker container.

* Tooling is now tied to the project, so either everyone on the team must have exactly the same tooling or you will need to manage multiple images.

### Git Submodules

Submodules is a feature of Git that allows you to include another Git repository as a folder. If you’re already using Git, it’s a powerful addition with no extra tooling required.

The limitation of Submodules is that it does not offer dependency resolution. Why does this matter? Suppose you have a dependency graph like this:

```
A v1 requires B v1
A v1 requires C v2
B v1 requires C v1–3
```

Clearly, we can resolve this to:

```
A v1
B v1
C v2
```

However, Submodules does not allow you to express such requirements, and you therefore have to do the resolution by hand. This is not a problem for small projects, but as the list of dependencies grows it becomes one.

On top of that, Submodules provides no way to simplify the dependency graph. Suppose you have this system of projects:

```
A requires B
A requires C
B requires D
C requires D
```

So B and C both require the library D. As such, we should only build D once, and reuse the result for building B and C. Submodules do not help us here. We have to manually ensure this happens by scripting our build system.

### CMake External Projects

CMake has a feature for downloading external projects called ExternalProject_Add. It has [a huge number of settings](https://cmake.org/cmake/help/v3.8/module/ExternalProject.html), so there’s a good chance it can be configured to do what you need.

However:

* It’s not reproducible. ExternalProject_Add can download modules from unstable URLs and Git branches.

* There’s little standardization. CMake relies on variable name conventions, which are rather brittle.

* CMake syntax 😱 is unpleasant to use, and has no advantages over alternative syntax choices.

* Dependency resolution must still be done manually.

### A Project-Centric Package Manager

A project-centric package manager is one that installs dependencies into your project folder, rather than onto your system. Think of it this way: *project-centric packager managers are for building projects; system package managers are for installing software*.

There have been many attempts at building a project-centric package manager for several languages. The most successful of these is inarguably NPM, for the JavaScript ecosystem.

![Source: [blog.npmjs.org](http://blog.npmjs.org/post/143451680695/how-many-npm-users-are-there)](/posts/npm-growth.png)*Source: [blog.npmjs.org](http://blog.npmjs.org/post/143451680695/how-many-npm-users-are-there)*

(As an aside, if you are using JavaScript, do yourself a favour and consider switching to [Yarn](https://yarnpkg.com/)).

## Buckaroo

We built Buckaroo to be a project-centric package manager for C++. [There](https://github.com/pfultz2/cget) [are](https://github.com/ruslo/hunter) [alternatives](https://www.conan.io/), and we will do a full comparison in another article, but none of the existing solutions quite matched our requirements. Here is an overview of how Buckaroo stacks up.

### 1. It should be easy to add new dependencies to a project.

Buckaroo dependencies are installed in one command, for example:

```
buckaroo install boost/asio
```

### 2. Understanding the dependencies that a project uses should be trivial.

Every project contains a buckaroo.json file that specifies the dependencies of the project. Additionally, there is a buckaroo.lock.json file that specifies exactly how the versions were resolved.

### 3. It should work on all major platforms. Cross-compilation should be easy, not just an after-thought.

Buckaroo supports macOS, Windows (preview) and Linux. All Buckaroo packages build from source using [Buck](https://buckbuild.com/) as a build system, which enables cross-compilation using “build flavors”.

### 4. Installing dependencies should be reproducible. Every developer should be building the same code.

Like Yarn, Buckaroo saves the exact result of dependency resolution to a lock file, which ensures that every deployment uses exactly the same dependencies.

Additionally, since all Buckaroo packages build with Buck, it can give reproducible builds. This would not be guaranteed with CMake.

### 5. A dependency should be project-centric. In other words, installing a dependency should not modify your system.

Buckaroo is entirely project-local. Only a download cache and some user-settings live outside of your project folder. This guarantees that your [CI server](https://hackernoon.com/getting-started-with-buck-build-on-travis-ci-d1208d363023) builds exactly the same code that you do.

### 6. It should be easy to publish new packages.

Publishing a Buckaroo package is trivial:

1. Write a Buck build file to your project
 2. Add a buckaroo.json file
 3. Create a GitHub release

That’s it! See [this guide](http://buckaroo.readthedocs.io/en/latest/github-package-guide.html) for more information.

### 7. Require the minimal amount of additional infrastructure, such as servers.

Buckaroo leverages existing infrastructure, such as GitHub, so that you don’t need to host your own server.

## Conclusion

Hopefully this article has explained some of the motivations behind Buckaroo. To summarize:

* There are many advantages to using a project-centric package manager, such as Buckaroo, in your project.

* Use the system package manager to install tooling and for deployments.

* Git sub-modules is a reasonable option if you have a requirement of minimal tooling.

* Copy-and-paste is viable for tiny dependencies, such as [Catch](https://github.com/philsquared/Catch), but it is still more convenient to use a package manager.

### Ready to Get Started? 🤠

If you would like try [Buckaroo](http://buckaroo.pm/), the best place to start is [the documentation](https://buckaroo.readthedocs.io/en/latest/). You can browse the existing packages on [Buckaroo.pm](http://buckaroo.pm/) or request more over on [the wishlist](https://github.com/LoopPerfect/buckaroo-wishlist).
