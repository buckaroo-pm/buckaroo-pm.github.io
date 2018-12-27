import superDown from "./superdown";
import * as components from "./components/*/index.js";
import * as markdownPages from "./pages/**/*.md";
import * as jsPages from "./pages/**/*.js";

function pathToSlug( str ) {
  return str
    .replace(/[$]/g,'/')
    .replace( /([a-z])([A-Z])/g, '$1-$2' )
    .toLowerCase();
}

const sluggifyPath = ([p,v]) => [pathToSlug(p),v];

const pages = [].concat(
  Object.entries(jsPages)
  .map(sluggifyPath)
  .map( ([path, component]) => {
      return {
        path:'/' + path.toLowerCase(),
        component: component,
        meta: component.meta,
        toc: component.toc
      }  
    }),  
  Object.entries(markdownPages)
  .map(sluggifyPath)
  .map( ([path, text]) => {
      const {md, meta, toc} = superDown(text, components); 
      return {
        path:'/'+path.replace(/[$]/g,'/').toLowerCase(),
        component: md,
        meta,
        toc
      }
    })
);

export default pages;
