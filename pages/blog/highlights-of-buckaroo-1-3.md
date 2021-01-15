---
title: "Highlights of Buckaroo 1.3"
banner: "/buckaroo.png"
author: "Team Buckaroo"
created: "2017-08-14T11:00:00.000Z"
---


Buckaroo 1.3 has been released! Here’s a break-down of what we’ve been up to…

## Simplified Installation for Debian 🐧

We now host [Debian](https://github.com/LoopPerfect/buckaroo/releases/tag/v1.3.0) packages for Buckaroo and Buck for a simpler installation process. Furthermore we offer a self-contained version of Buckaroo for linux-amd64 that does not require a java installation

## GitHub, GitLab and BitBucket Integration 🐙🐈

We strongly believe in decentralisation and want to encourage open-source, so now you can install packages directly from GitHub, GitLab and BitBucket. All you have to do is specify the package source when you install. For example:

buckaroo install github+loopperfect/neither

We connect via SSH, so private repositories are supported too!

## Support for 4 Digit Version Numbers 🍀

Some libraries, such as [GLM](https://github.com/g-truc/glm), have a 4th digit in their version number. Whilst this isn’t strictly a [semantic version](http://semver.org/), it is easy to extend the semantic versioning scheme to support them. We think this is a pragmatic solution, so we have added it to Buckaroo.

## Ready to Quickstart? 🏃‍♀️

Head over to [the docs](https://buckaroo.readthedocs.io/en/latest/) to get started.

![](https://cdn-images-1.medium.com/max/2000/1*nvWj-hBQrbMNkzk_1Kd04g.gif)

## Why Buckaroo? 🤔
[**Approaches to C++ Dependency Management, or Why We Built Buckaroo**
*C++ is an unusual language in that it does not yet have a dominant package manager (we’re working on it!). As a result…*hackernoon.com](https://hackernoon.com/approaches-to-c-dependency-management-or-why-we-built-buckaroo-26049d4646e7)
[**6 Reasons Why We Distribute C++ Libraries as Source-Code**
*When writing C++ applications, you will inevitably make use of external libraries. This is a good thing! Code re-use…*hackernoon.com](https://hackernoon.com/6-reasons-why-we-distribute-c-libraries-as-source-code-2dc614d5ef1e)
[**7 Reasons to Use Buck Build**
*Buck is a cross-platform, cross-language build system made for large scale compilation at Facebook. All Buckaroo…*hackernoon.com](https://hackernoon.com/7-reasons-to-use-buck-build-5b44d7413585)
