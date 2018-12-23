import express from "express"
import { renderToString } from "react-dom/server"
import React from "react"
import fs from "fs"
import superDown from "./superdown"

const app = express();



const md = fs.readFileSync("posts/test.md","utf8");

const App = () => {
  const {meta, TOC, doc} = superDown(md);
  return (<div>
    <div>
      {doc()}
    </div>
    
    <div>
      {
        TOC.map( ({id, text}) => (
          <p key={id}> <a href={"#"+id}>{id} : {text}</a></p>
        ))
      }
    </div>

    <div>
      <h2> meta </h2>
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
