import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => {
  const { path, meta } = props;

  return (
    <div className="summary">
      <h2><Link to={path}>{meta.title}</Link></h2>
      <p>{meta.summary}</p>
      <p><Link to={path}>📚 Read More</Link></p>
    </div>
  );
};
