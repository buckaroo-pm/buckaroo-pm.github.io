import Markdown from 'markdown-to-jsx';
import frontMatter from 'front-matter';
import { Light as Code } from "react-syntax-highlighter";
import docco from 'react-syntax-highlighter/dist/styles/hljs/docco'; 
import { renderToString } from "react-dom/server"
import React from "react"


const code = ({className, children}) => {
  const [_, langString = ''] = (className||"").split("lang-");
  const [lang , maybeLineNo] = langString.split("=");
  const showLineNumbers = maybeLineNo !== undefined
  const lineNo = showLineNumbers? parseInt(maybeLineNo)||0 : undefined
  return ( 
    <Code 
      style={docco} 
      lang={lang}
      showLineNumbers={showLineNumbers}
      startingLineNumber={lineNo}>{children}</Code> 
  );
}

export default function SuperDown (content, components = {}) {
  const {attributes, body} = frontMatter(content);

  const overrides = {
    code,
    ...components
  }

  const ids = {};
  const slugifier = (ids={}) => str => {
    const id = str
      .replace(/[*]/g, '')
      .replace(/ /g, '-');

    // ensure the generation of unique ids even if the title is identical
    ids[id] = (ids[id]||0) + 1;
    return id + ((ids[id]>1) ? ('-' + ids[id]) : '');
  }

  const slugifyTOC = slugifier(); 

  const toc = body
    .replace(/```.*```\n/gs,'')
    .split('\n')
    .filter(x => x.startsWith('#'))
    .map(x => {
      const text = x.replace(/^#+/,'').trim();
      const level = x.match(/^#+/)[0].length;
      const id = slugifyTOC(text);
      return {
        level,
        text,
        id
      }
    })

  const options = {
    overrides,
    slugify: slugifier(),
  };
    
  return {
    md: () => <Markdown options={options}>{body}</Markdown>,
    meta: attributes, 
    toc
  };
}
