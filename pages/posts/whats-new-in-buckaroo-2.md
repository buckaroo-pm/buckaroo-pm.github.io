---
title: "What's New in Buckaroo 2?"
created: "2019-02-11T17:12:00.000Z"
author: "Team Buckaroo"
summary:
  "We are proud to announce Buckaroo v2.0.0! Buckaroo has been re-architected to accommodate the lessons learned from v1.x, incorporate your feedback and close more than 85 issues in the process..."
---
We are proud to announce Buckaroo `v2.0.0`!

Buckaroo has been re-architected to accommodate the lessons learned from v1.x, incorporate your feedback and close more than 85 issues in the process.

We also removed 17k lines of Java code and replaced it with 8k of F#! 🙌

Here are the key points…

## Live at Head - Depend on Moving Branches & Tags

You can now treat Git branches & tags as versions too!
Thanks to our locking mechanism, we ensure that the installation is reproducible even if the branch or tag is updated. When you are ready to move to the next version, just do buckaroo upgrade.

## New Robotic Team-Members: Upgrade Bot & Patch Bot 🤖

Upgrade Bot and Patch Bot are now operational and work hard to update and port packages to the Buckaroo ecosystem. Don't worry though, their contributions are all tested on Travis CI.

## 100% Decentralised, no Cookbook or Publishing Process

Buckaroo now does not need a central repository of packages. ZERO! This means any URL - Git or HTTP - can be installed as long as it has a buckaroo.toml file.

## Works Offline - Download Once, Install Many Times.

We cache all packages centrally, so you can work offline. Reconnect to fetch more versions.
Private and public dependencies to avoid "dependency hell"

Packages can declare private dependencies, whose version does not have to be shared with the rest of the project. Use this feature to escape dependency hell!

## Multiple libraries per package, so tools like Lerna are unnecessary

You can now pull individual components out of a package. This works really nicely with libraries that ship optional add-ons. Now you can take only what you need.

## Smart Version Reconciliation
Did you know that `boostorg/iterator` `v1.67.0` points to the same commit as `v1.68.0`?
Buckaroo is now smart enough to detect that those two version on Git point to the same revision and are therefore equivalent. We discovered that when a package manager understands this, it reduces the need to resolve many dependency conflicts.

## No Java Dependency

We got rid of the JVM and use a Warp bundle to ship a self contained executable for Linux, Mac and Windows. Oh, and we also did this for Buck!

Just wget and go. 😎

## TOML over JSON

It might seem like a small cosmetic change, but we found TOML is not only easier to read but it also reduces the number of merge conflicts in manifest and lock-files. Buckaroo `v2.0.0` only uses TOML.

## What to Try Buckaroo?

Head over to our GitHub page to get started. ❤️
