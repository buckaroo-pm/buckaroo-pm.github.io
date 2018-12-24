import superDown from "./superdown";
import * as components from "./components/*/index.js";
import * as markdownPages from "./pages/**/*.md";
import * as jsPages from "./pages/**/*.js";


const pages = [].concat(
  Object.entries(jsPages)
    .map( ([path, component]) => {
      return {
        path:'/' + path.replace(/[$]/g,'/').replace('-','').toLowerCase(),
        component: component,
        meta: component.meta,
        toc: component.toc
      }  
    }),  
  Object.entries(markdownPages)
    .map( ([path, text]) => {
      const {md, meta, toc} = superDown(text, components); 
      return {
        path:'/'+path.replace(/[$]/g,'/').replace('-','').toLowerCase(),
        component: md,
        meta,
        toc
      }
    })
);

export default pages;
