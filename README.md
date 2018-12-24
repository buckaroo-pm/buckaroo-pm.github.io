# Blog POC

## yarn dev

Runs webpack-dev-server with hot reload

- uses `templates/hot.html` as a default html template
- uses HashRouter meaning all urls are prefixed with `#/my/url`.
  This is a workaround wor webpack-dev-server

## yarn build

Generates static pages and stores in dist.

- uses a crawler to find pages to generate
- `generator.js` and `templates/default.js` is used for each page

## Pages

All Pages are discovered using glob imports (see `pages.js`).
`pages.js` is responsible to compute and export a list of components and paths.

```js
export default [{
  path: "/posts/mypost",
  component: ()=><h1>Hello World</h1>,
  meta: {title: "hello World" ...},
  toc: [
    {level: 1, text: "heading1"},
    {level: 2, text: "heading2"}
  ] //table of content
} ...]
```  


## Markdown aka SuperDown

### Meta Data

You can embed meta data by specifing a yaml section at the beginning of the markdown file

eg:
```md
---
title: hello world
author: your name
---

# Blog Post

...

``` 

### React Components

every react component defined in `components` is automatically available in markdown.

`component/MyComponent/index.js`
can be used in markdown by refering to it's folder name.

```md

<MyComponent prop1="asd" >

# h1

some content

</MyComponent>

```

You can also override base components like `h1` if needed

### Table of Content

All headings within a Markdown document are automatically collected into a list.

The Table of Content is stored within the page object
