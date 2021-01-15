_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[34],{RBb8:function(e,t,o){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog/whats-new-in-buckaroo-2",function(){return o("Vnxp")}])},Vnxp:function(e,t,o){"use strict";o.r(t),o.d(t,"frontMatter",(function(){return l})),o.d(t,"default",(function(){return d}));var a=o("rePB"),n=o("Ff2n"),r=(o("q1tI"),o("7ljp")),c=o("ZDfL");function s(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,a)}return o}function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?s(Object(o),!0).forEach((function(t){Object(a.a)(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):s(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}var l={title:"What's New in Buckaroo 2?",created:"2019-02-11T17:12:00.000Z",author:"Team Buckaroo",summary:"We are proud to announce Buckaroo v2.0.0! Buckaroo has been re-architected to accommodate the lessons learned from v1.x, incorporate your feedback and close more than 85 issues in the process...",banner:"/buckaroo.png",__resourcePath:"blog/whats-new-in-buckaroo-2.md",__scans:{},layout:"index"},u={frontMatter:l},p=c.a;function d(e){var t=e.components,o=Object(n.a)(e,["components"]);return Object(r.a)(p,i(i(i({},u),o),{},{components:t,mdxType:"MDXLayout"}),Object(r.a)("p",null,"We are proud to announce Buckaroo ",Object(r.a)("inlineCode",{parentName:"p"},"v2.0.0"),"!"),Object(r.a)("p",null,"Buckaroo has been re-architected to accommodate the lessons learned from v1.x, incorporate your feedback and close more than 85 issues in the process."),Object(r.a)("p",null,"We also removed 17k lines of Java code and replaced it with 8k of F#! \ud83d\ude4c"),Object(r.a)("p",null,"Here are the key points\u2026"),Object(r.a)("h2",null,"Live at Head\u200a-\u200aDepend on Moving Branches &\xa0Tags"),Object(r.a)("p",null,"You can now treat Git branches & tags as versions too!\nThanks to our locking mechanism, we ensure that the installation is reproducible even if the branch or tag is updated. When you are ready to move to the next version, just do buckaroo upgrade."),Object(r.a)("h2",null,"New Robotic Team-Members: Upgrade Bot & Patch Bot\xa0\ud83e\udd16"),Object(r.a)("p",null,"Upgrade Bot and Patch Bot are now operational and work hard to update and port packages to the Buckaroo ecosystem. Don't worry though, their contributions are all tested on Travis CI."),Object(r.a)("h2",null,"100% Decentralised, no Cookbook or Publishing Process"),Object(r.a)("p",null,"Buckaroo now does not need a central repository of packages. ZERO! This means any URL\u200a-\u200aGit or HTTP\u200a-\u200acan be installed as long as it has a buckaroo.toml file."),Object(r.a)("h2",null,"Works Offline\u200a-\u200aDownload Once, Install Many\xa0Times."),Object(r.a)("p",null,'We cache all packages centrally, so you can work offline. Reconnect to fetch more versions.\nPrivate and public dependencies to avoid "dependency hell"'),Object(r.a)("p",null,"Packages can declare private dependencies, whose version does not have to be shared with the rest of the project. Use this feature to escape dependency hell!"),Object(r.a)("h2",null,"Multiple libraries per package, so tools like Lerna are unnecessary"),Object(r.a)("p",null,"You can now pull individual components out of a package. This works really nicely with libraries that ship optional add-ons. Now you can take only what you need."),Object(r.a)("h2",null,"Smart Version Reconciliation"),Object(r.a)("p",null,"Did you know that ",Object(r.a)("inlineCode",{parentName:"p"},"boostorg/iterator")," ",Object(r.a)("inlineCode",{parentName:"p"},"v1.67.0")," points to the same commit as ",Object(r.a)("inlineCode",{parentName:"p"},"v1.68.0"),"?\nBuckaroo is now smart enough to detect that those two version on Git point to the same revision and are therefore equivalent. We discovered that when a package manager understands this, it reduces the need to resolve many dependency conflicts."),Object(r.a)("h2",null,"No Java Dependency"),Object(r.a)("p",null,"We got rid of the JVM and use a Warp bundle to ship a self contained executable for Linux, Mac and Windows. Oh, and we also did this for Buck!"),Object(r.a)("p",null,"Just wget and go. \ud83d\ude0e"),Object(r.a)("h2",null,"TOML over\xa0JSON"),Object(r.a)("p",null,"It might seem like a small cosmetic change, but we found TOML is not only easier to read but it also reduces the number of merge conflicts in manifest and lock-files. Buckaroo ",Object(r.a)("inlineCode",{parentName:"p"},"v2.0.0")," only uses TOML."),Object(r.a)("h2",null,"What to Try Buckaroo?"),Object(r.a)("p",null,"Head over to our ",Object(r.a)("a",i({parentName:"p"},{href:"https://github.com/LoopPerfect/buckaroo"}),"GitHub page")," to get started. \u2764\ufe0f"))}d.isMDXComponent=!0}},[["RBb8",0,2,1,3,4]]]);