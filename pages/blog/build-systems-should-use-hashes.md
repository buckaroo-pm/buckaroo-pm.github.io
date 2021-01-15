---
title: "Build-Systems Should Use Hashes Over Timestamps"
banner: "/posts/build-systems-should-use-hashes.jpeg"
author: "Team Buckaroo"
created: "2018-10-26T11:00:00.000Z"
attribution: "“cube white block lot on gray surface” by Christian Fregnan on Unsplash"
---

“cube white block lot on gray surface” by Christian Fregnan on Unsplash

An integral part of any build-system is to detect what has changed and what needs to be rebuilt.

There are two approaches common approaches to this:

* Compare timestamps between the output and input files. If the input files are newer than the output files, then a rebuild is required. *Make* works this way.

* Compare the hashes of input files between runs. If the hashes have changed, then the output needs to be rebuilt. *Buck*, *Bazel* and *SCons* work this way.

Hash-based build-systems only rebuild an artefact if the hash of any of its input files have changed. This reduces the amount of unnecessary rebuilds.

The hashes of all inputs forms a cache-key, allowing build-artefacts to be shared between machines and build runs. This is a huge win, since you can reliably share build artefacts across a team.

Although hash-based systems offer many benefits, only a few build-systems use a hashing system. Why is this?

The common argument is simple: computing all of those hashes is slow… much slower than stat.

Often this is followed by giving SCons as an example. Sure, SCons is slow, but is this evidence that hashing is slow, or is SCons just a slow implementation?

## How Much Slower is Hashing?

We put md5sum shasum and stat to the test on various code-bases. For each project we computed the hash or timestamp of every single file:

find . -not -path '*/\.*' -type f -exec stat "{}" + > /dev/null

Here are the results:


|  Project   |  Files  | Disk Space |   stat    |   md5sum  |  shasum  | sha256sum  |
| ---------- | ------- | ---------- | --------- | --------- | -------- | ---------  |
|  LLVM      | 319618  |   9.5 GB   |   1.7s    |   7.5s    |  9.7s    |    20s     |
|  OpenCV    |  26923  |   2.5 GB   |   0.3s    |   2.0s    |  2.4s    |    5.5s    |
|  OpenSSL   |  35699  |   855 MB   |   0.3s    |   0.4s    |  0.8s    |    1.2s   |

So hashing is **2.5x–5x slower**.

*Note: it is uncommon to hash the entire code-base. In practice, you would only hash the inputs to the artefact being built.*

## How to Make Hashing Fast?

It appears that hashing is slow, but we still want to gain the benefits of a hash-based system. Can we optimise the *use* of hashing to get the best of both worlds?

* We could compute the hash only if a file has been modified (stat *then* shasum)

* Use a native implementation of a hashing algorithm (calling shasum for each file has some overhead)

* Use a service like [Watchman](https://github.com/facebook/watchman) to trigger the hashing out of process

With these improvements, we reduce the number of hashes computed and also precompute many of them. This makes the time spent hashing negligible, whilst still giving the benefits of a hash-based system. For some cases, the hash-based system will be significantly faster than a timestamp-based one.

For instance, imagine an input file has been touched, but its hash has not changed. In this case, the timestamp-based system will rebuild all dependencies (*expensive!*). A hash-based system will notice that no real change has occurred, and skip the rebuild.

Another example: a new developer joins the team and must build from scratch. It so happens that they are building the same files that someone else on the team has already built. Since the hash can be used as a cache key, the build step can be skipped entirely and a cached artefact can be downloaded from the build server. This would not be possible with a timestamp-based system.

**Timestamp-based systems save a small amount of time computing hashes, but lose massive amounts of time performing unnecessary rebuilds.**

## You may also be Interested in…
[**Announcing BuildInfer for C++**
*Analyze, Visualize and Migrate Between Build-systems*hackernoon.com](https://hackernoon.com/announcing-buildinfer-for-c-3dfa3eb15feb)
[**(Even) More Reasons to Use Buck Build**
*Excellent Precompiled Header Support*medium.com](https://medium.com/@buckaroo.pm/even-more-reasons-to-use-buck-build-9e2f6bf451d4)
[**Error Handling in C++ or: Why You Should Use Eithers in Favor of Exceptions and Error-codes**
*TL;DR*hackernoon.com](https://hackernoon.com/error-handling-in-c-or-why-you-should-use-eithers-in-favor-of-exceptions-and-error-codes-f0640912eb45)
