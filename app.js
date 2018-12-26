import React from 'react';
import {Route, Link} from 'react-router-dom'
import pages from './pages'
import { hot } from 'react-hot-loader';
import { VisibilityTracker } from './context';

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
  padding:0,
  margin:0,
};

const postContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap-reverse',
};

const articleContainer = {
  width: "800px"
}

const tocContainer = {
  fontSize: "1em",
  maxWidth: "400px"
};

const Toc = ({toc}) => (
  <div style={tocContainer}>TOC
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
            <h2 style={{paddingLeft:"15px"}}>Nikhedonia's blog</h2>
            <div style={{
              marginLeft:'10px',
              borderLeft: 'solid 1px #fff',
              display:'flex',
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

          <div className="Iconbar">
            <b> Follow </b>
            <a href="https://www.linkedin.com/shareArticle?mini=true&url=google.com&title=YourarticleTitle&summary=YourarticleSummary&source=google.com">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"/>
            </a>
              
              <img src="https://vignette.wikia.nocookie.net/logopedia/images/6/6b/2000px-Twitter_2012_logo.svg.png/revision/latest?cb=20120608112551"/>
              <img src="https://s18955.pcdn.co/wp-content/uploads/2017/05/LinkedIn.png"/>


              <b> Share </b>
              <img src="https://vignette.wikia.nocookie.net/logopedia/images/6/6b/2000px-Twitter_2012_logo.svg.png/revision/latest?cb=20120608112551"/>
              <img src="https://img.freepik.com/free-icon/facebook-logo_318-49940.jpg?size=338c&ext=jpg" />
              <img src="https://s18955.pcdn.co/wp-content/uploads/2017/05/LinkedIn.png"/>
            </div>

          <div className="Content"> {children} </div> 
        </div>
      </VisibilityTracker>
    )
  }
}


const post = (props) => (
  <Route path={props.path} key={props.path} component={
    () => <Post {...props}>{props.component()}</Post>
  }/>
)

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
        <Link to="/sitemap">Sitemap</Link> 
      </div>
    </>
  )
}

export default hot(module)(App);
