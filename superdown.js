import Markdown from 'markdown-to-jsx';
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

export default function SuperDown (content) {
  const TOC = [];
  const meta = {};

  const overrides = {
    code,
  }

  const options = visitOnly => ({
    overrides,
    createElement: (type, props, children) => {
      switch(type) {
        case 'meta': Object.assign(meta, props); return null;
        case 'h1': 
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5': TOC.push({level: parseInt(type[1]), id: props.id, text:children.join(' ')});
        default:
         if (!visitOnly)
            return React.createElement(type, props, children);
         return React.createElement('div','');
      }
    }
  });

  // traverse only
  renderToString(
    <Markdown options={options(true)}>{content}</Markdown>
  )

  return {
    doc: () => 
      <Markdown options={options(false)}>{content}</Markdown>,
    meta: meta, 
    TOC: TOC
  };
}
