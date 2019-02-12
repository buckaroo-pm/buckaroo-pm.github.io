import React from 'react';
import { Route, Link } from 'react-router-dom';
import pages from './pages';
import { hot } from 'react-hot-loader';

import Home from './home';
import Blog from './blog';
import ScrollToTop from './scrollToTop';
import Analytics from './scrollToTop';
import Header from './components/Header';

const Post = props => {
  const { children, meta } = props;
  const { title, author, created } = meta;

  return (
    <div className="page mt-4 ph-1">
      <div className="content">
        <h1>{title}</h1>
        <p>{author}, {new Date(created).toLocaleDateString()}</p>
        <hr />
        {children}
      </div>
    </div>
  );
};

const post = (props) => {
  const Article = props.component;
  return (
    <Route
      path={props.path}
      key={props.path}
      component={() =>
        <Post {...props}>
          <Article />
        </Post>
      } />
  );
};

const SiteMap = () => (
  <div>{
    pages.map(v => <Link to={v.path} key={v.path}>{v.path}</Link>)
  }</div>
);

const App = () => {
  return  (
    <ScrollToTop>
      <Header />
      <Route exact path="/" component={() => <Home pages={pages} />} />
      <Route exact path="/blog" component={() => <Blog pages={pages} />} />
      {pages.map(post)}
      <Analytics />
    </ScrollToTop>
  );
};

export default hot(module)(App);
