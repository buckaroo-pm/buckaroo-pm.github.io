import { useRouter } from 'next/router'
import Footer from '../../../components/Footer';
import Navigation from '../../../components/Navigation';
import ReactMarkdown from 'react-markdown/with-html';
import gfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import Link from 'next/link';
import {dark} from 'react-syntax-highlighter/dist/cjs/styles/hljs/docco';
import docco from 'react-syntax-highlighter/dist/cjs/styles/hljs/docco';

const renderers = {
  code: ({language, value}) => {
    return <SyntaxHighlighter style={dark} language={language} children={value} />
  }
}

function Tag({name, url}) {
  return (
    <span className="tag" 
      style={{
        borderRadius: '5px',
        padding: '10px',
        background:'white', 
        color: 'black',
        fontSize: '0.7em',
        margin:'5px',
      }}>
      {name}
    </span>
  )
}

function Topics({topics}) {
  return (
    <div style={{display:'inline-flex', flexFlow:'row wrap'}}>{
      topics.map((t) => <Tag key={t} name={t} />)
    }</div>
  );
}

function Code({content, lang}) {
  return <SyntaxHighlighter language={lang} style={docco}>{content}</SyntaxHighlighter>
}

function Content(props) {
  const [name, content] = props.tab || ['', ''];

  switch (name) {
    case '': return null;
    case "ReadMe":
      return (
        <>
          <h2>ReadMe</h2>
          <ReactMarkdown plugins={[gfm]} renderers={renderers} children={content} />
        </>
      )
    case "Buck":
      return (<>
        <h2>BUCK</h2>
        <Code lang="python" content={content} />
      </>)
    case "Bazel":
      return (<>
        <h2>BUILD</h2>
        <Code lang="python" content={content} />
      </>)
    case "Manifest":
      return (<>
        <h2>buckaroo.toml</h2>
        <Code lang="toml" content={content} />
      </>);

    case "LockFile":
      return (<>
        <h2>Parsed buckaroo.lock.toml</h2>
        <br/>
        <table>
          <thead>
            <tr><th>Dependency</th><th>Spec</th><th>Resolved</th></tr>
          </thead>
          <tbody>
            {content.map( (x,i)=>(
              <tr key={i}>
                <td>{x.name}</td>
                <td>{x.spec.versions.join(', ')}</td>
                <td>
                  <a target="_blank" style={{textDecoration:'underline', fontWeight:'bold'}} 
                    href={`https://${x.uri}/tree/${x.spec.revision}/buckaroo.toml`}>{x.spec.revision}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>);
    default:
      return <pre>{content}</pre>
  }
}

export default function Packages({data}) {
  const router = useRouter();
  const {owner, name:pname, tab} = router.query;

  const {
    packageName = '',
    readme = '',
    licence = '',
    versions = [],
  } = data;


  const tabs = [
    ['ReadMe', readme],
    ['Buck', !!versions.length && versions[0].buck],
    ['Bazel', !!versions.length && versions[0].bazel],
    ['Manifest', !!versions.length && versions[0].manifest],
    ['LockFile', !!(versions.length && versions[0].lock && versions[0].lock.length) && versions[0].lock],
    ['Dependencies', !!versions.length && versions[0].deps]
  ].filter(x=>x[1]).reduce( (a, b) => ({...a, [b[0].toLowerCase()]: b}), {});

  const active = tab || Object.keys(tabs)[0];

  return (
    <>
      <Navigation/>
      <div className="banner">
        <div style={{display:'flex'}}>
          <div className="package">
            <img src={`/packages/${packageName}/logo.png`} />
          </div>
          <div>
            <h1>{packageName}</h1>
            <div style={{maxWidth:'600px'}}>{data.description}</div>
            <br/>
            {(data.stars >0) && <div><b>{data.stars}</b></div>}
            {data.license && <div>License: <b>{licence}</b></div>}
          </div>
        </div>
        <Topics {...data} />
      </div>

      <div style={{display:'flex', width:'100%', justifyContent:'center', marginTop:'-2.7em'}}>{
        Object.entries(tabs).map( ([i, [name]]) => (
          <Link key={name}  href={`/packages/${owner}/${pname}?tab=${name.toLowerCase()}`}>
            <div className="tab-control" style={{
              padding:'0.5em', 
              borderRadius: '0.2em', 
              fontSize:'1.5em', 
              background:(active==i) ? 'white': 'none',
              color: (active==i)?'black': 'white',
              border: 'solid 1px #fff'
            }}>{name}</div></Link>
        ))
      }</div>

      <div className="banner white">
        <div className="view column">
          <Content tab={tabs[active]} />
        </div>
      </div>
      <Footer/>
    </>
  );
}

export function getStaticProps(context) {
  const data = require(`../../../public/packages/buckaroo-pm/${context.params.name}/full.json`);
  return {props: {
    data
  }}
}

export function getStaticPaths() {
  return {
    fallback: false,
    paths: 
      require('../../../public/packages/names.json')
        .map(params=>({params}))
  };
}

//Object.assign(Packages, {getInitialProps});