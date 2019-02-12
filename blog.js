import React from 'react';
import { Link } from 'react-router-dom';

import postSummary from './components/postSummary';

const headlinePost = (props) => {
  const { path, meta } = props;
  return (
    <div>
      <h1><Link to={path}>{meta.title}</Link></h1>
      <p>{meta.summary}</p>
      <p><Link to={path}>📚 Read More</Link></p>
    </div>
  );
};

export default props => {
  const pages =
    (props.pages || [])
      .sort((x, y) => x.meta.created < y.meta.created);

  return (
    <div className="page mt-4 ph-1">
      <div className="content">
        {pages.length ? headlinePost(pages[0]) : null}
        <hr className="mt-4" />
        <h1 className="mt-2">Older Posts</h1>
        {
          pages
            .slice(1)
            .map((x, i) => (<div key={i}>{postSummary(x)}</div>))
        }
      </div>
    </div>
  );
};
