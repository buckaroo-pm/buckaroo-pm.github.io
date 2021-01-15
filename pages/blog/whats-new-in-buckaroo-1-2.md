---
title: "What's New in Buckaroo 1.2?"
created: "2017-07-13T17:12:00.000Z"
author: "Team Buckaroo"
banner: "/buckaroo.png"
---

Buckaroo version 1.2.0 has been released, and it brings with it a host of new features. You can grab the latest version from right now, or if you’re just curious here’s a break-down of what’s new.

### Hang on, what’s Buckaroo?

[Buckaroo](http://buckaroo.pm/) is a dependency manager for C/C++. Unlike other solutions, Buckaroo focusses on fast, reproducible, cross-platform builds. It’s also dead-simple to use; if you’re familiar with NPM or Yarn, then you should feel right at home!

### GitHub Dependencies 🌍

It is now trivial to turn your GitHub projects into Buckaroo recipes. These recipes are created and managed directly on GitHub, so you don’t need to run a server or wait for approvals to create a package! 😌

Simply add a buckaroo.json file to the root level of your project and create a release tag on the GitHub website. Buckaroo will intelligently crawl the repository when resolving the dependency.

See: [Adding Buckaroo Support for a GitHub Project](http://buckaroo.readthedocs.io/en/latest/github-package-guide.html)

### Dependency Locks 🔒

Buckaroo now saves the resolved dependencies into a lock-file that lives inside your project. This is a much better approach when building on multiple machines, because it ensures that all dependency information is carried with the project’s source-code.

If your project is already using Buckaroo, run buckaroo install to create a lock-file.

### Asynchronous Execution ⏱️

We have put in lots of work to enable the asynchronous execution of tasks inside Buckaroo. Now, downloads, dependency resolution and installation all happen in parallel, so you can quickly get back to writing code.

### Reactive UI ⚡

The new console UI is ANSI-enabled, giving rich output as tasks are executed.

![Reactive Console UI](/posts/rxterm.gif)*Reactive Console UI*

The implementation is quite interesting, borrowing ideas from React and Cycle.js. [Take a look](https://github.com/LoopPerfect/buckaroo/tree/master/src/main/java/com/loopperfect/buckaroo/virtualterminal).

### Better Caching 📦

We have improved the caching strategy so that caches are shared between projects. This ensures that you will never download a dependency twice, and it also enables the GitHub integration to be fast.

### Better Error Messages 🐛

Error messages are greatly improved, and now Buckaroo will suggest actions to resolve errors in many cases.

![Informative Error Messages](/posts/buckaroo-error.gif)*Informative Error Messages*

### Debian Packaging 🐧

Some of you were unhappy about using [Linuxbrew](http://linuxbrew.sh/) for the main installation process, so now we offer a Debian package too. Head over to [the docs](https://buckaroo.readthedocs.io/en/latest/installation.html#linux) to get started.

## Try Buckaroo

And that’s it! 🙌 If you would like try Buckaroo, the best place to start is [the documentation](https://buckaroo.readthedocs.io/en/latest/). You can [browse the existing packages on Buckaroo.pm](https://buckaroo.pm/) or request more over on [the wishlist](https://github.com/LoopPerfect/buckaroo-wishlist).

![“Hello world” with Buck and Buckaroo](/posts/buckaroo-quickstart.gif)*“Hello world” with Buck and Buckaroo*
