import React from 'react';
import {Link} from 'react-router-dom';

export default ({href, children}) => {
  if (href.match(/((http|https):\/\/[\w\.\/\-=?#]+)/)) {
    return <a href={href}>{children}</a>
  } else {
    return <Link to={href}>{children}</Link>
  }
}
