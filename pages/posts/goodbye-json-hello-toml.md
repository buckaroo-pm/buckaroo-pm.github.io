---
title: "Goodbye JSON, Hello TOML"
created: "2019-02-11T22:00:00.000Z"
author: Team Buckaroo
summary: "For the next version of Buckaroo, we wanted to make improvements to the manifest format. Old versions of Buckaroo used JSON for the manifest and lock-files. This choice was not made very consciously, but at the time it seemed reasonable..."
---
For the next version of Buckaroo, we wanted to make improvements to the manifest format. Old versions of Buckaroo used JSON for the manifest and lock-files. This choice was not made very consciously, but at the time it seemed reasonable:

 * Yarn and NPM (arguably the most successful language package managers) both use JSON.
 * There is a JSON parser for literally every language (and usually [more](https://github.com/buckaroo-pm/dropbox-json11) [than](https://github.com/buckaroo-pm/open-source-parsers-jsoncpp) [one](https://github.com/buckaroo-pm/nlohmann-json)).
 * Everyone is familiar with JSON.

Over time, we've come to regret this decision:

 * JSON is tedious to edit by hand, since objects must be closed with curly braces.
 * JSON does not support comments.
 * Large JSON files can be difficult to read.

So we started looking for an alternative.

Amoungst newer package managers (Cargo, Dep), there is a clear winner: TOML. Tom's Obvious, Minimal Language (yes, the name is a tad egotistical)...

 > ... aims to be a minimal configuration file format that's easy to read due to obvious semantics. TOML is designed to map unambiguously to a hash table. TOML should be easy to parse into data structures in a wide variety of languages.

Already we have found it more convenient when tweaking packages over on [buckaroo-pm](https://github.com/buckaroo-pm). Often the TOML is a bit longer, but it's so much easier to read and edit!

Here's a side-by-side comparison:

```json
{
  "name": "satori",
  "dependencies": {
    "libuv/libuv": "1.11.0",
    "google/gtest": "1.8.0",
    "nodejs/http-parser": "2.7.1",
    "madler/zlib": "1.2.11",
    "loopperfect/neither": "0.4.0",
    "loopperfect/r3": "2.0.0"
  }
}
```

And the TOML:

```toml
targets = [ "//:satori" ]

[[dependency]]
package = "github.com/buckaroo-pm/google-googletest"
version = "branch=master"
private = true

[[dependency]]
package = "github.com/buckaroo-pm/libuv"
version = "branch=v1.x"

[[dependency]]
package = "github.com/buckaroo-pm/madler-zlib"
version = "branch=master"

[[dependency]]
package = "github.com/buckaroo-pm/nodejs-http-parser"
version = "branch=master"

[[dependency]]
package = "github.com/loopperfect/neither"
version = "branch=master"

[[dependency]]
package = "github.com/loopperfect/r3"
version = "branch=master"
```

But the biggest improvement is when fixing a Git merge. Unlike JSON, each line of TOML is largely self-contained. Without having to worry about trailing commas or closing braces, Git will get things right far more often. This is a huge relief when updating lock-files.

TOML files are use in [Buckaroo](https://github.com/LoopPerfect/buckaroo/) v2 upwards. Let us know what you think! 💖
