---
title: "Getting Started with Buck build on Travis CI"
created: "2017-06-14T11:00:00.000Z"
author: Team Buckaroo
banner: "/posts/berlin.jpeg"
attribution: "Travis CI, Made in Berlin (Photo by Markus Spiske)"
---


Getting Started with Buck build on Travis CI

[Travis CI](https://travis-ci.org/) is a service that offers free build servers for open-source projects ([thanks, VCs!](https://www.crunchbase.com/organization/travis-ci/timeline#/timeline/index)). It has tight integration with GitHub, allowing you to automatically build and test code in a pull request before merging. This is great for projects with multiple contributors, because you can run tests without checking-out the code yourself.

But how do you integrate a [Buck](https://buckbuild.com/) based project with Travis CI?

To follow this guide you will need the following:

* A [GitHub project](https://github.com/njlr/buck-cxx-hello-world) that builds with Buck

* An account on [Travis CI](https://travis-ci.org/)

### TL;DR

Grab the relevant files from the [example repo on GitHub](https://github.com/njlr/buck-travis-example).

### Create a .travis.yml File

At the heart of a Travis project is the .travis.yml file. This is a YAML file that defines the build steps and build environment for your project. The most important property is script, which is the list of Bash commands.

For example:

```yaml
dist: trusty
language: generic

script:
  - ./build.sh
```

### Install Build Dependencies

Buck is not packaged with any of the Travis system images, so we will need to add an installation step to the Travis file. Installation steps live under the before_install element.

The easiest way to get Buck running on Linux is via [Linuxbrew](http://linuxbrew.sh/), the Linux port of [Homebrew](https://brew.sh/). Like Homebrew, Linuxbrew allows us to easily install packages in userland, and it is mostly package-compatibile.

```yaml
before_install:
  # Install Linuxbrew
  - git clone https://github.com/Linuxbrew/brew.git $HOME/.linuxbrew
  - PATH="$HOME/.linuxbrew/bin:$PATH"
  - echo 'export PATH="$HOME/.linuxbrew/bin:$PATH"' >>~/.bash_profile
  - export MANPATH="$(brew --prefix)/share/man:$MANPATH"
  - export INFOPATH="$(brew --prefix)/share/info:$INFOPATH"
  - brew --version
  # Install Buck
  - brew tap facebook/fb
  - brew install buck
  - buck --version
```

This snippet runs before the project is built. First, it installs Linuxbrew, then it uses Linuxbrew to install Buck.

You might have noticed that we *did not* use the provided Linuxbrew install script. This is because it is best to keep everything in the home folder, which ensures that the Travis user has read and write access.

Once we have Buck installed, the script portion of .travis.yml can call Buck:

```yaml
script:
  - buck build :hello
```

Pulling everything together, we have the following:

```yaml
dist: trusty
language: generic

before_install:
  # Install Linuxbrew
  - git clone https://github.com/Linuxbrew/brew.git $HOME/.linuxbrew
  - PATH="$HOME/.linuxbrew/bin:$PATH"
  - echo 'export PATH="$HOME/.linuxbrew/bin:$PATH"' >>~/.bash_profile
  - export MANPATH="$(brew --prefix)/share/man:$MANPATH"
  - export INFOPATH="$(brew --prefix)/share/info:$INFOPATH"
  - brew --version
  # Install Buck
  - brew tap facebook/fb
  - brew install buck
  - buck --version

script:
  - buck build :hello
```

Add this file to the root of your project, and be sure to change the buck build command to point to the correct Buck target!

### Connect Travis CI to GitHub

Once the Travis file is in place, you need to connect Travis CI to your GitHub project. [Create an account on Travis CI](https://travis-ci.org/), then flick the switch on the project you want to integrate.

![](/posts/travis-toggles.png)

Travis will now be integrated with your project, and it will start building master. You will also notice useful notifications appear in your pull requests!

### Accelerating the Build

The build will take a while because it has to install all of the dependencies each time! We can improve this massively by taking advantage of Travis CI’s cache feature.

Travis CI allows you to mark a directory as cached, which means it gets re-used between builds. Since we installed Linuxbrew in userland, we can just cache the whole ~/.linuxbrew directory. On subsequent builds, Linuxbrew will detect that our dependencies are already installed and skip the installation step.

```yaml
cache:
  directories:
    - $HOME/.linuxbrew/
```

We also need to make sure that we do not git clone Linuxbrew twice:

```yaml
before_install:
  # Install Linuxbrew
    - test -d $HOME/.linuxbrew/bin || git clone https://github.com/Linuxbrew/brew.git $HOME/.linuxbrew
```

Pulling everything together gives us the finished Travis file:

```yaml

dist: trusty
language: generic

before_install:
  # Install Linuxbrew
  - test -d $HOME/.linuxbrew/bin || git clone https://github.com/Linuxbrew/brew.git $HOME/.linuxbrew
  - PATH="$HOME/.linuxbrew/bin:$PATH"
  - echo 'export PATH="$HOME/.linuxbrew/bin:$PATH"' >>~/.bash_profile
  - export MANPATH="$(brew --prefix)/share/man:$MANPATH"
  - export INFOPATH="$(brew --prefix)/share/info:$INFOPATH"
  - brew --version
  # Install Buck
  - brew tap facebook/fb
  - brew install buck
  - buck --version

script:
  - buck build :hello

branches:
  except:
    - gh-pages

cache:
  directories:
    - $HOME/.linuxbrew/
```

### Conclusion

And that’s it! The full Travis file should be enough to get started, or you can grab the relevant files from the [example repo on GitHub](https://github.com/njlr/buck-travis-example).

![](https://cdn-images-1.medium.com/max/2272/1*0hqOaABQ7XGPT-OYNgiUBg.png)

![](https://cdn-images-1.medium.com/max/2272/1*Vgw1jkA6hgnvwzTsfMlnpg.png)

![](https://cdn-images-1.medium.com/max/2272/1*gKBpq1ruUi0FVK2UM_I4tQ.png)
> [Hacker Noon](http://bit.ly/Hackernoon) is how hackers start their afternoons. We’re a part of the [@AMI](http://bit.ly/atAMIatAMI) family. We are now [accepting submissions](http://bit.ly/hackernoonsubmission) and happy to [discuss advertising & sponsorship](mailto:partners@amipublications.com) opportunities.
> If you enjoyed this story, we recommend reading our [latest tech stories](http://bit.ly/hackernoonlatestt) and [trending tech stories](https://hackernoon.com/trending). Until next time, don’t take the realities of the world for granted!

![](https://cdn-images-1.medium.com/max/30000/1*35tCjoPcvq6LbB3I6Wegqw.jpeg)
