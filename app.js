import React from 'react';
import {Route, Link} from 'react-router-dom'
import pages from './pages'
import { hot } from 'react-hot-loader';
import { VisibilityTracker } from './context';

import Twitter from './components/twitter';
import Github from './components/github';
import Facebook from './components/facebook';
import LinkedIn from './components/linkedin';

const wrapper = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100vw",
  padding:0,
  margin:0
};

const main = {
  width: "80vw",
  minWidth: "400px",
  maxWidth: "1200px",
  padding: 0,
  margin: 0,
};

const postContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap-reverse',
};

const articleContainer = {
  width: "800px",
}

const tocContainer = {
};

const Toc = ({toc}) => (
  <div className="TocContainer">
    <h1> TOC </h1>
    {toc.map( ({level, text, id}) => (
      <p key={id} 
        style={{marginLeft:level+'em'}}>
        <a href={'#'+id}> {text} </a>
      </p> 
    ))}
  </div>
);

class Post extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      top: null,
      bottom: null
    };
  }

  onVisibilityChange({id}, ref, state) {
    if(!ref.current) return;
    
    const { top } = ref.current.node.getBoundingClientRect();
    const event = [id, state, top];
  
    if (top >= 300) {
      this.setState({bottom: [id, state, top]})
    } else {
      this.setState({top: [id, state, top]})
    } 
  }

  getCurrentHeadingIndex() {
    if (!this.state.top) 
      return 0;
    if (!this.state.top[1]) {
      return (this.props.toc
        .map( (x, i) => [x.id, i])
        .find( ([id]) => id == this.state.top[0])||[0, 0])[1]
    } else {
      const index = (this.props.toc
        .map((x, i) => [x.id, i])
        .find(([id]) => id == this.state.top[0])||[])[1];
      if (!index) 
        return 0;
      return index-1;
    }
  }

  getTitles() {
    const {children, toc, meta} = this.props;
    const titles = [toc[0]]; 
    const index = this.getCurrentHeadingIndex();
    if (index) {
      if (index > 2 ) {
        let prev = toc.slice(0, index)
          .map( (x, i) => [x.level, i])
          .reverse()
          .find( ([level]) => level < toc[index].level);

        if (prev) {
          titles.push(toc[prev[1]]);
        }
      }
      titles.push(toc[index]);
    }
    return titles;
  }

  render() {
    const {children, toc, meta} = this.props;
    const titles = this.getTitles();
      
    return (    
      <VisibilityTracker 
        value={{onChange:(props, ref) => state => this.onVisibilityChange(props, ref, state)}}
      >  
        <div className="PostContainer">
          <div className="Header">
            <h2 className="Logo">
              <Link to={'/'}> {"\u2115"}<span>ikhedonia</span></Link>
            </h2>
            <div style={{
              marginLeft: '10px',
              borderLeft: 'solid 1px #fff',
              display: 'flex',
              flexDirection: 'column',
              padding: "0.5em",
              fontSize: "0.9em"
            }}>
              {titles.map( ({text, id}, i) => 
              <b key={id}>
                <span>{'> '.repeat(i)}</span>
                <a href={'#'+id}>{text}</a>
              </b>
              )}
            </div>

          </div>


          {
          (meta.bannerImg) ? 
            <div className="Banner">
              <img 
                style={{
                  display:"block",
                  width: "100%",
                  marginTop: meta.bannerOffset 
                }}
                src={meta.bannerImg} /> 
              </div>

              : null
          }

          <div className="Content">
            <Toc toc={toc}/>
            {children}
          </div> 
        </div>
      </VisibilityTracker>
    )
  }
}


const post = (props) => {
  const Article = props.component;
  return <Route path={props.path} key={props.path} component={
    () => <Post {...props}><Article className="Article"/></Post>
  }/>
}

const SiteMap = () => (
  <div>{
    pages.map(v => <Link to={v.path} key={v.path}>{v.path}</Link>)
  }</div>  
)

const App = () => {
  return  (
    <>
      {pages.map(post)}
      <Route path="/sitemap" component={SiteMap} />
      <div className="Footer">
        <div className="Links">
          <b>Links</b>
          <div>
          <Link to="/sitemap">Sitemap</Link> 
          </div>
        </div> 

        <div className="Follow">
          <b> Follow </b>
          <div>
            <a href="//github.com/nikhedonia">
              <Github className="follow-icon" />
            </a>

            <a href="//linkedin.com/in/gaetano-checinski">
              <LinkedIn className="follow-icon" />
            </a>
              
            <a href="//twitter.com/tanoChecinski">
              <Twitter className="follow-icon" />
            </a>
          
          </div>
       </div>

       <div className="Subscribe">
          <b> Subscribe to Newsletter </b>
          <form action="https://jyt.us13.list-manage.com/subscribe/post?u=a3756f5e475cb6820f59c0201&amp;id=9719b50c7d" 
            method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
            <input type="email" name="EMAIL" width="100" placeholder="email address"/>
            <button type="submit"> subscribe </button>
          </form>
        </div>


      </div>
    </>
  )
}

export default hot(module)(App);
