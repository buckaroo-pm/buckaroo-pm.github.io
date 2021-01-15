_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[11],{"69OR":function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog/announcing-buildinfer-for-c",function(){return a("Tcdl")}])},Tcdl:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return c})),a.d(t,"default",(function(){return d}));var n=a("rePB"),o=a("Ff2n"),i=(a("q1tI"),a("7ljp")),r=a("ZDfL");function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){Object(n.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var c={title:"Why Not Make?",summary:"Make is a conceptually simple build-system, and it is packaged with major Linux distributions. However, Make should rarely be your build-system of choice when starting a new C++ project.",banner:"/posts/why-not-make.jpeg",attribution:"\u201cblue building block lot\u201d by Iker Urteaga on Unsplash",author:"Team Buckaroo",created:"2018-11-07T11:00:00.000Z",__resourcePath:"blog/announcing-buildinfer-for-c.md",__scans:{},layout:"index"},u={frontMatter:c},h=r.a;function d(e){var t=e.components,a=Object(o.a)(e,["components"]);return Object(i.a)(h,s(s(s({},u),a),{},{components:t,mdxType:"MDXLayout"}),Object(i.a)("p",null,"Make is a conceptually simple build-system, and it is packaged with major Linux distributions. However, Make should rarely be your build-system of choice when starting a new C++ project."),Object(i.a)("p",null,"That\u2019s a bold claim, so here\u2019s why\u2026"),Object(i.a)("h3",null,"Writing a Large, Correct Makefile is Really Hard"),Object(i.a)("p",null,"The dependency graph of a C++ library is actually quite complex. It must be rebuilt every time a linked object-file changes\u2026 But an object-file should be rebuilt every time its translation-unit changes, or the compilation flags change, or if any of its included headers change, or if the compiler changes\u2026"),Object(i.a)("p",null,"You can query this information using the compiler and encode all of this in a Makefile, but it\u2019s going to get really verbose."),Object(i.a)("p",null,"There\u2019s a high chance that you will miss a dependency. If this happens, then you might have stale artefacts after a change. Cue a clean build!"),Object(i.a)("h3",null,"No Sandboxing"),Object(i.a)("p",null,"The lack of sandboxing is the root problem. Make has a dependency graph, but it does not actually enforce it. What this means is that a build-rule can read a file even if it is not declared as a dependency in Make!"),Object(i.a)("h3",null,"Caches are Not Portable"),Object(i.a)("p",null,"Make does not allow you to share build artefacts across a network, so everyone on your development team will be performing the same build-steps over and over!"),Object(i.a)("p",null,"Yes, you can use CCache, but that is not general (only compiler calls are cached) and it isn\u2019t provided out-of-the-box."),Object(i.a)("h3",null,"No Language Abstractions are Provided"),Object(i.a)("p",null,"Make\u2019s simplicity is a big strength, but it is also a major weakness. Make doesn\u2019t provide any language-specific abstractions, so you have to write them yourself. This can get very tedious, and the odds of making a mistake are high."),Object(i.a)("p",null,"This also goes for tests, deployments and so on. You need to build everything yourelf."),Object(i.a)("h3",null,"Timestamps, Not Hashes"),Object(i.a)("p",null,"In determining when to rebuild, Make uses the timestamps of build inputs rather than their hashes. This results in many unnecessary rebuilds when a file has been touched, but has not actually changed. If this happens deep in the dependency tree, then the rebuild will take a long time!"),Object(i.a)("h2",null,"So When Should You Use Make?"),Object(i.a)("p",null,"It\u2019s not all bad; Make still has its place as a bootstrapping tool. If you have extreme dependency requirements (for example you are building Linux from source), then you need something simple and self-contained. But for most developers this just isn\u2019t the case. We already fetch Clang, GCC and Visual Studio as prebuilt binaries, so why not download a prebuilt build-system?"),Object(i.a)("h2",null,"Since You\u2019re Here\u2026"),Object(i.a)("p",null,"We recently announced ",Object(i.a)("a",s({parentName:"p"},{href:"https://buildinfer.loopperfect.com/"}),"BuildInfer"),", a new tool to optimize your C/C++ build scripts. ",Object(i.a)("a",s({parentName:"p"},{href:"https://buildinfer.loopperfect.com/"}),"Take a look"),"!"),Object(i.a)("p",null,Object(i.a)("img",s({parentName:"p"},{src:"https://cdn-images-1.medium.com/max/2000/1*pkwieX1RSK5S0LXbFyaEJg.png",alt:null}))))}d.isMDXComponent=!0}},[["69OR",0,2,1,3,4]]]);