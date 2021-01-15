_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[25],{KBGk:function(e,a,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog/how-to-create-a-buck-based-project",function(){return t("MlSY")}])},MlSY:function(e,a,t){"use strict";t.r(a),t.d(a,"frontMatter",(function(){return l})),t.d(a,"default",(function(){return u}));var n=t("rePB"),c=t("Ff2n"),o=(t("q1tI"),t("7ljp")),s=t("ZDfL");function p(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function r(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?p(Object(t),!0).forEach((function(a){Object(n.a)(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):p(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}var l={title:"How to Create a Buck-based C/C++ Project",banner:"/posts/deer.jpeg",author:"Team Buckaroo",created:"2017-05-15T11:00:00.000Z",__resourcePath:"blog/how-to-create-a-buck-based-project.md",__scans:{},layout:"index"},m={frontMatter:l},i=s.a;function u(e){var a=e.components,t=Object(c.a)(e,["components"]);return Object(o.a)(i,r(r(r({},m),t),{},{components:a,mdxType:"MDXLayout"}),Object(o.a)("p",null,Object(o.a)("a",r({parentName:"p"},{href:"https://buckbuild.com/"}),"Buck")," is a fast build tool developed by Facebook. There are ",Object(o.a)("a",r({parentName:"p"},{href:"https://hackernoon.com/7-reasons-to-use-buck-build-5b44d7413585"}),"many reasons to choose Buck"),", but how should you get started?"),Object(o.a)("p",null,"This walk-through will cover:"),Object(o.a)("ul",null,Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"How to organize your project")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"Integration of Google Test")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"Explanation of the basic Buck commands"))),Object(o.a)("h3",null,"TL;DR"),Object(o.a)("p",null,"Browse ",Object(o.a)("a",r({parentName:"p"},{href:"https://github.com/njlr/buck-cpp-example"}),"the project files on GitHub"),", or clone them onto your system:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"git clone [git@github.com](mailto:git@github.com):njlr/buck-cpp-example.git\n")),Object(o.a)("p",null,"Install existing Buck ports from ",Object(o.a)("a",r({parentName:"p"},{href:"https://www.buckaroo.pm"}),"Buckaroo.pm"),"."),Object(o.a)("h2",null,"How Buck Works"),Object(o.a)("p",null,"Before we start, it might be helpful to understand how Buck works. Rather than retread old ground, take a look at this talk from the Buck devs."),Object(o.a)("center",null,Object(o.a)("iframe",{width:"560",height:"315",src:"https://www.youtube.com/embed/uvNI_E0ZgZU",frameborder:"0",allowfullscreen:!0})),Object(o.a)("h2",null,"Installing Buck"),Object(o.a)("p",null,"The official guide for installing Buck is ",Object(o.a)("a",r({parentName:"p"},{href:"https://buckbuild.com/setup/getting_started.html"}),"available on their website"),". However, the quickest way is probably to use Homebrew or Linuxbrew."),Object(o.a)("ul",null,Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"If you are using Linux, you can install Linuxbrew using a ",Object(o.a)("a",r({parentName:"p"},{href:"http://linuxbrew.sh/"}),"one-liner on their website"),".")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"Ditto for ",Object(o.a)("a",r({parentName:"p"},{href:"https://brew.sh/"}),"Homebrew")," on macOS."))),Object(o.a)("p",null,"Once you have a \u201cbrew\u201d installed, add the Facebook tap and install Buck:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"brew tap facebook/fb\nbrew install --HEAD facebook/fb/buck\n")),Object(o.a)("p",null,"Verify your installation with:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"buck --version\n")),Object(o.a)("h2",null,"Organizing Your Files"),Object(o.a)("p",null,"Once Buck is installed, it\u2019s time to create the project folders. Buck makes it easy to support any folder structure you like, but for this demo we will be following the C/C++ convention of src and include folders."),Object(o.a)("p",null,"This project will consist of two parts:"),Object(o.a)("ul",null,Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"demo \u2014 an executable that computes 3 + 4and prints the result")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"mathutils \u2014 a library that provides simple adding functionality"))),Object(o.a)("p",null,Object(o.a)("em",{parentName:"p"},"Note: This is a simple example for demonstration purposes; Buck is capabable of building ","[complex C/C++ projects]","(",Object(o.a)("a",r({parentName:"em"},{href:"http://buckaroo.pm/search?q="}),"http://buckaroo.pm/search?q=")),")!*"),Object(o.a)("p",null,"First, create the following structure somewhere on your drive:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"    .\n    \u251c\u2500\u2500 .buckconfig\n    \u251c\u2500\u2500 BUCK\n    \u2514\u2500\u2500 demo\n        \u251c\u2500\u2500 include\n        \u2514\u2500\u2500 src\n            \u2514\u2500\u2500 main.cpp\n")),Object(o.a)("p",null,"Using the command-line:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"    touch .buckconfig\n    touch BUCK\n\n    mkdir demo\n    mkdir demo/include\n    mkdir demo/src\n    touch demo/src/main.cpp\n")),Object(o.a)("p",null,"That\u2019s quite a few files \u2014 let\u2019s run through them:"),Object(o.a)("ul",null,Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"A ",Object(o.a)("inlineCode",{parentName:"p"},".buckconfig")," is required before you can run any Buck commands. It tells Buck where the root of your project is and can also be used to configure any settings that are global to your project. For now we can leave it empty.")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"The ",Object(o.a)("inlineCode",{parentName:"p"},"BUCK")," file is where we will define the target for our binary. There can be multiple ",Object(o.a)("inlineCode",{parentName:"p"},"BUCK")," files in a ",Object(o.a)("inlineCode",{parentName:"p"},"Buck")," project, which is useful when you want to seperate the build logic for different aspects of your project, such as libraries and tests.")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},Object(o.a)("inlineCode",{parentName:"p"},"demo/include")," is where we will be putting any headers used by the binary.")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},Object(o.a)("inlineCode",{parentName:"p"},"demo/src")," is where we will be putting our translation-units (in this case .cpp files) for the binary.")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},Object(o.a)("inlineCode",{parentName:"p"},"demo/src/main.cpp")," will be the entry-point for our application."))),Object(o.a)("h3",null,"main.cpp"),Object(o.a)("p",null,"To get started, we will write a simple hello-world program. Paste the following into main.cpp:"),Object(o.a)("pre",r({},{className:"language-cpp"}),Object(o.a)("code",r({parentName:"pre"},{className:"language-cpp"}),Object(o.a)("span",r({parentName:"code"},{className:"token macro property"}),Object(o.a)("span",r({parentName:"span"},{className:"token directive-hash"}),"#"),Object(o.a)("span",r({parentName:"span"},{className:"token directive keyword"}),"include")," ",Object(o.a)("span",r({parentName:"span"},{className:"token string"}),"<iostream>")),"\n\n",Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"int")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"main"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")")," ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"{"),"\n  std",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"::"),"cout ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"<<")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),'"Hello, world. "')," ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"<<")," std",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"::"),"endl",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),";"),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"return")," ",Object(o.a)("span",r({parentName:"code"},{className:"token number"}),"0"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),";"),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"}"),"\n")),Object(o.a)("h3",null,"BUCK"),Object(o.a)("p",null,"To build the main.cpp file, we need to write a Buck target for it. Into the BUCK file, paste the following:"),Object(o.a)("pre",r({},{className:"language-cpp"}),Object(o.a)("code",r({parentName:"pre"},{className:"language-cpp"}),Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"cxx_binary"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),"\n  name ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'demo'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  header_namespace ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'demo'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  headers ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"subdir_glob"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"["),"\n    ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'demo/include'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'**/*.hpp'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"]"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  srcs ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"glob"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"["),"\n    ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'demo/src/**/*.cpp'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"]"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),"\n")),Object(o.a)("p",null,"BUCK files are written in a dialect of Python 2, with a few extensions. When you call buck build, Buck will execute the Python and record any targets the are defined. Once the list of targets has been resolved, each target is built in accordance with its type."),Object(o.a)("p",null,"You can see the full list of target-types in ",Object(o.a)("a",r({parentName:"p"},{href:"https://buckbuild.com/rule/cxx_binary.html"}),"the Buck docs"),", but the important ones for C/C++ are cxx_binary, cxx_library and prebuilt_cxx_library."),Object(o.a)("ul",null,Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},Object(o.a)("inlineCode",{parentName:"p"},"cxx_binary")," \u2014 a bundle of C/C++ translation-units and headers that contain an entry-point (e.g. int main()). A cxx_binary can be executed once compiled. It should not be a dependency.")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},Object(o.a)("inlineCode",{parentName:"p"},"cxx_library")," \u2014 a bundle of C/C++ translation-units that can be used by other targets. Unlike a cxx_binary, a library also defines a list of exported_headers, which are the header-files made available to its dependents.")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},Object(o.a)("inlineCode",{parentName:"p"},"prebuilt_cxx_library")," \u2014 like a ",Object(o.a)("inlineCode",{parentName:"p"},"cxx_library"),", but with an optional object-file in the place of translation units. Header-only libraries are implemented as a ",Object(o.a)("inlineCode",{parentName:"p"},"prebuilt_cxx_library")," with no object-file."))),Object(o.a)("h2",null,"Buck Commands"),Object(o.a)("p",null,"Now that the BUCK file is in place, Buck can build the target. Run the following:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"buck build //:demo\n")),Object(o.a)("p",null,"The command tells Buck to build the target :demo found in the BUCK file adjacent to .buckconfig."),Object(o.a)("p",null,"Buck uses a simple addressing system for targets based on the actual folder-structure of the project. For example, //examples/basic/:demo refers to the target demo defined in examples/basic/BUCK."),Object(o.a)("p",null,"After the build completes, you should find an executable at buck-out/gen/demo. You can build and run this using:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"buck build //:demo && ./buck-out/gen/demo\n")),Object(o.a)("p",null,"Or, Buck can do it for you:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"buck run //:buck-cpp-example\n")),Object(o.a)("p",null,"You will notice that running the build for a second time is extremely fast. This is because Buck caches everything, including the output of the Python scripts!"),Object(o.a)("h2",null,"Adding a Dependency"),Object(o.a)("p",null,"Let\u2019s implement mathutils so that we can use it in the demo application."),Object(o.a)("p",null,"Create the following folder structure in your project:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"   .\n    \u2514\u2500\u2500 mathutils\n        \u251c\u2500\u2500 BUCK\n        \u251c\u2500\u2500 include\n        \u2502   \u2514\u2500\u2500 add.hpp\n        \u2514\u2500\u2500 src\n            \u2514\u2500\u2500 add.cpp\n")),Object(o.a)("p",null,"Using the command-line:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"mkdir mathutils\nmkdir mathutils/include\nmkdir mathutils/src\n\ntouch mathutils/BUCK\ntouch mathutils/include/add.hpp\ntouch mathutils/src/add.cpp\n")),Object(o.a)("p",null,"And the files themselves:"),Object(o.a)("pre",r({},{className:"language-cpp"}),Object(o.a)("code",r({parentName:"pre"},{className:"language-cpp"}),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token macro property"}),Object(o.a)("span",r({parentName:"span"},{className:"token directive-hash"}),"#"),Object(o.a)("span",r({parentName:"span"},{className:"token directive keyword"}),"ifndef")," ",Object(o.a)("span",r({parentName:"span"},{className:"token expression"}),"MATH_HPP")),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token macro property"}),Object(o.a)("span",r({parentName:"span"},{className:"token directive-hash"}),"#"),Object(o.a)("span",r({parentName:"span"},{className:"token directive keyword"}),"define")," ",Object(o.a)("span",r({parentName:"span"},{className:"token macro-name"}),"MATH_HPP")),"\n\n",Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"int")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"add"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"int")," x",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," ",Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"int")," y",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),";"),"\n\n",Object(o.a)("span",r({parentName:"code"},{className:"token macro property"}),Object(o.a)("span",r({parentName:"span"},{className:"token directive-hash"}),"#"),Object(o.a)("span",r({parentName:"span"},{className:"token directive keyword"}),"endif")),"\n")),Object(o.a)("pre",r({},{className:"language-cpp"}),Object(o.a)("code",r({parentName:"pre"},{className:"language-cpp"}),Object(o.a)("span",r({parentName:"code"},{className:"token macro property"}),Object(o.a)("span",r({parentName:"span"},{className:"token directive-hash"}),"#"),Object(o.a)("span",r({parentName:"span"},{className:"token directive keyword"}),"include")," ",Object(o.a)("span",r({parentName:"span"},{className:"token string"}),"<mathutils/add.hpp>")),"\n\n",Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"int")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"add"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"int")," x",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," ",Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"int")," y",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")")," ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"{"),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"return")," x ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"+")," y",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),";"),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"}"),"\n")),Object(o.a)("pre",r({},{className:"language-cpp"}),Object(o.a)("code",r({parentName:"pre"},{className:"language-cpp"}),Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"cxx_library"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),"\n  name ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'mathutils'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  header_namespace ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'mathutils'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  exported_headers ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"subdir_glob"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"["),"\n    ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'include'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'**/*.hpp'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"]"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  srcs ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"glob"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"["),"\n    ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'src/**/*.cpp'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"]"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  visibility ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"["),"\n    ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'//...'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"]"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),"\n")),Object(o.a)("p",null,"There are a few important points about this BUCK file:"),Object(o.a)("ul",null,Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"The header_namespace is set to 'mathutils'. This puts every header-file that the library exports into a folder with that name, making file-name collisions with other libraries less likely.")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"The glob rules are rooted at the BUCK file, so src/",Object(o.a)("strong",{parentName:"p"},"/*.cpp actually corresponds to mathutils/src/"),"/*.cpp from the project root.")),Object(o.a)("li",{parentName:"ul"},Object(o.a)("p",{parentName:"li"},"The visibility is set to //... so that the target can be taken as a dependency by all other targets in the project. In English it means \u201cthis library is visibile to every other target below root\u201d."))),Object(o.a)("h3",null,"Using the Add Function"),Object(o.a)("p",null,"Now we can use the mathutils library in the demo executable."),Object(o.a)("p",null,"First, declare the dependency of demo on mathutils. Change the BUCK file at the root of the project to:"),Object(o.a)("pre",r({},{className:"language-cpp"}),Object(o.a)("code",r({parentName:"pre"},{className:"language-cpp"}),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"cxx_binary"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),"\n  name ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'demo'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  header_namespace ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'demo'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  headers ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"subdir_glob"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"["),"\n    ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'demo/include'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'**/*.hpp'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"]"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  srcs ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"glob"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"["),"\n    ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'demo/src/**/*.cpp'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"]"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  deps ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"["),"\n    ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'//mathutils:mathutils'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"]"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),"\n")),Object(o.a)("p",null,"Now update main.cpp to:"),Object(o.a)("pre",r({},{className:"language-cpp"}),Object(o.a)("code",r({parentName:"pre"},{className:"language-cpp"}),Object(o.a)("span",r({parentName:"code"},{className:"token macro property"}),Object(o.a)("span",r({parentName:"span"},{className:"token directive-hash"}),"#"),Object(o.a)("span",r({parentName:"span"},{className:"token directive keyword"}),"include")," ",Object(o.a)("span",r({parentName:"span"},{className:"token string"}),"<iostream>")),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token macro property"}),Object(o.a)("span",r({parentName:"span"},{className:"token directive-hash"}),"#"),Object(o.a)("span",r({parentName:"span"},{className:"token directive keyword"}),"include")," ",Object(o.a)("span",r({parentName:"span"},{className:"token string"}),"<mathutils/add.hpp>")),"\n\n",Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"int")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"main"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")")," ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"{"),"\n  std",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"::"),"cout ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"<<")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),'"Hello, world. "')," ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"<<")," std",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"::"),"endl",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),";"),"\n  std",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"::"),"cout ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"<<")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),'"3 + 4 = "')," ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"<<")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"add"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token number"}),"3"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," ",Object(o.a)("span",r({parentName:"code"},{className:"token number"}),"4"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")")," ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"<<")," std",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"::"),"endl",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),";"),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token keyword"}),"return")," ",Object(o.a)("span",r({parentName:"code"},{className:"token number"}),"0"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),";"),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"}"),"\n")),Object(o.a)("p",null,"Use Buck to run demo to see the result. You will notice that Buck knows how to link mathutils for you."),Object(o.a)("h2",null,"Google Test"),Object(o.a)("p",null,"Our application is working, but to be diligent we should add some unit-tests!"),Object(o.a)("p",null,"Buck supports all C/C++ testing frameworks via buck run, but it provides additional integration with Google Test."),Object(o.a)("h3",null,"Fetching the Google Test Source-code"),Object(o.a)("p",null,"Git provides a simple way to grab the Google Test source-code using submodules. We will be using ",Object(o.a)("a",r({parentName:"p"},{href:"https://github.com/njlr/googletest"}),"a fork")," that contains a BUCK file, but you can use the master and write your own if desired."),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"git submodule add git@github.com:njlr/googletest.git\ncd googletest/\ngit checkout 48072820e47a607d000b101c05d796ebf9c4aad2\ncd ../\n")),Object(o.a)("p",null,"Now we need to tell Buck where to find the Google Test sources. Open the .buckconfig and add the following:"),Object(o.a)("pre",r({},{className:"language-ini"}),Object(o.a)("code",r({parentName:"pre"},{className:"language-ini"}),Object(o.a)("span",r({parentName:"code"},{className:"token selector"}),"[cxx]"),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token constant"}),"  gtest_dep")," ",Object(o.a)("span",r({parentName:"code"},{className:"token attr-value"}),Object(o.a)("span",r({parentName:"span"},{className:"token punctuation"}),"=")," //googletest:gtest"),"\n")),Object(o.a)("p",null,"This tells Buck where to find the Google Test target that it can use for your tests. There are other config properties that can be set; have a browse in the ",Object(o.a)("a",r({parentName:"p"},{href:"https://buckbuild.com/concept/buckconfig.html"}),"Buck docs"),"."),Object(o.a)("h3",null,"Writing a Test"),Object(o.a)("p",null,"We will put the tests into a mathutils/test, alongsidemathutils/src and mathutils/include:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"    .\n    \u2514\u2500\u2500 mathutils\n        \u251c\u2500\u2500 BUCK\n        \u251c\u2500\u2500 include\n        \u2502   \u2514\u2500\u2500 add.hpp\n        \u251c\u2500\u2500 src\n        \u2502   \u2514\u2500\u2500 add.cpp\n        \u2514\u2500\u2500 test\n            \u251c\u2500\u2500 BUCK\n            \u2514\u2500\u2500 add.cpp\n")),Object(o.a)("p",null,"Using the command-line:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"mkdir mathutils/test\ntouch mathutils/test/add.cpp\n")),Object(o.a)("p",null,"And the test itself:"),Object(o.a)("pre",r({},{className:"language-cpp"}),Object(o.a)("code",r({parentName:"pre"},{className:"language-cpp"}),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token macro property"}),Object(o.a)("span",r({parentName:"span"},{className:"token directive-hash"}),"#"),Object(o.a)("span",r({parentName:"span"},{className:"token directive keyword"}),"include")," ",Object(o.a)("span",r({parentName:"span"},{className:"token string"}),"<gtest/gtest.h>")),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token macro property"}),Object(o.a)("span",r({parentName:"span"},{className:"token directive-hash"}),"#"),Object(o.a)("span",r({parentName:"span"},{className:"token directive keyword"}),"include")," ",Object(o.a)("span",r({parentName:"span"},{className:"token string"}),"<mathutils/add.hpp>")),"\n\n",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"TEST"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),"mathutils",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," add",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")")," ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"{"),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"ASSERT_EQ"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token number"}),"3"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"add"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token number"}),"1"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," ",Object(o.a)("span",r({parentName:"code"},{className:"token number"}),"2"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),";"),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"ASSERT_EQ"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token number"}),"7"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," ",Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"add"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),Object(o.a)("span",r({parentName:"code"},{className:"token number"}),"4"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),",")," ",Object(o.a)("span",r({parentName:"code"},{className:"token number"}),"3"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),";"),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"}"),"\n")),Object(o.a)("p",null,"Finally, we need to declare the test in the BUCK file:"),Object(o.a)("pre",r({},{className:"language-cpp"}),Object(o.a)("code",r({parentName:"pre"},{className:"language-cpp"}),Object(o.a)("span",r({parentName:"code"},{className:"token function"}),"cxx_test"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"("),"\n  name ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'add'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  srcs ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"["),"\n    ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'add.cpp'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"]"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  deps ",Object(o.a)("span",r({parentName:"code"},{className:"token operator"}),"=")," ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"["),"\n    ",Object(o.a)("span",r({parentName:"code"},{className:"token string"}),"'//mathutils:mathutils'"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n  ",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),"]"),Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),","),"\n",Object(o.a)("span",r({parentName:"code"},{className:"token punctuation"}),")"),"\n")),Object(o.a)("p",null,"Now the tests can be run by Buck:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"buck test //mathutils/test:add\n")),Object(o.a)("p",null,"Or, to run all tests:"),Object(o.a)("pre",null,Object(o.a)("code",r({parentName:"pre"},{}),"buck test\n")),Object(o.a)("h2",null,"Conclusion"),Object(o.a)("p",null,"And that\u2019s it! Buck is a powerful tool that will ",Object(o.a)("a",r({parentName:"p"},{href:"http://zserge.com/blog/buck-build-system.html"}),"save you hours of waiting over the development cycle of a project"),". To learn more, read ",Object(o.a)("a",r({parentName:"p"},{href:"https://buckbuild.com/setup/getting_started.html"}),"the docs")," or watch some of the ",Object(o.a)("a",r({parentName:"p"},{href:"https://buckbuild.com/presentations/index.html"}),"Buck presentations"),"."),Object(o.a)("p",null,"If there is a library you need to port to Buck, take a look at ",Object(o.a)("a",r({parentName:"p"},{href:"https://www.buckaroo.pm/"}),"Buckaroo.pm"),". We\u2019ve already ported 300 projects, and are ",Object(o.a)("a",r({parentName:"p"},{href:"https://github.com/LoopPerfect/buckaroo-wishlist"}),"working on even more"),"!"))}u.isMDXComponent=!0}},[["KBGk",0,2,1,3,4]]]);