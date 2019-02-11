import Markdown from 'markdown-to-jsx';
import frontMatter from 'front-matter';
import { Light as Code } from "react-syntax-highlighter";
import docco from 'react-syntax-highlighter/dist/styles/hljs/docco';
import purebasic from 'react-syntax-highlighter/dist/styles/hljs/purebasic';
import github from 'react-syntax-highlighter/dist/styles/hljs/github';
import atomonelight from 'react-syntax-highlighter/dist/styles/hljs/atom-one-dark';
import { renderToString } from "react-dom/server"
import React from "react"

import js from 'react-syntax-highlighter/dist/languages/hljs/javascript';
import cpp from 'react-syntax-highlighter/dist/languages/hljs/cpp';

Code.registerLanguage('js', js);
Code.registerLanguage('cpp', cpp);

const code = (xs) => {
  console.log(xs);
  const { className, children } = xs;
  const [_, langString = ''] = (className || "").split("lang-");
  const [ lang , maybeLineNo ] = langString.split("=");
  const showLineNumbers = maybeLineNo !== undefined;
  const lineNo =
    showLineNumbers ?
      parseInt(maybeLineNo) || 0 :
      undefined;

  if (lang) {
    return (
      <Code
        useInlineStyles={true}
        style={atomonelight}
        lang={lang}
        className="code"
        showLineNumbers={showLineNumbers}
        startingLineNumber={lineNo}>{children}</Code>
    );
  }

  return (<span className="inline-code">{children}</span>);
};

export default function SuperDown (content, components = {}) {
  const {attributes, body} = frontMatter(content);

  const overrides = {
    code,
    // ...components
  };

  const slugifier = (ids = {}) => str => {
    const id = str
      .trim()
      .replace(/[*]/g, '')
      .replace(/ /g, '-');

    // ensure the generation of unique ids even if the title is identical
    ids[id] = (ids[id]||0) + 1;
    return id + ((ids[id]>1) ? ('-' + ids[id]) : '');
  }

  const slugifyTOC = slugifier();

  return {
    md: (props={}) => {
      const options = {
        overrides,
        slugify: slugifier(),
      };
      return <Markdown options={options} {...props}>{body}</Markdown>
    },
    meta: attributes,
  };
}
