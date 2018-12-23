import express from "express"
import { renderToString } from "react-dom/server"
import React from "react"
import fs from "fs"
import superDown from "./superdown";
import post from "./posts/test.md";

import * as components from "./components/*/index.js";


const {md, toc, meta} = superDown(post, components);
const app = express();


const App = () => {

  return (<div>
    <div>
      {md()}
    </div>
    
    <div>
      <h2> auto generated Table of contents </h2>
      {
        toc.map( ({id, text, level}) => (
          <p key={id}>
            <a href={"#"+id} style={{marginLeft: level+"em"}}>{text}</a>
          </p>
        ))
      }
    </div>

    <div>
      
      <h2>extracted Meta information </h2>
      {
        Object.entries(meta).map( ([k, v], id) => (
          <p key={id}>{k} = {v}</p>
        ))
      }
    </div>

  </div>
  )
};

app.get("/", (req, res) => { 
  const html = renderToString(<App/>);
  res.end(html) 
})

app.listen(1337)
