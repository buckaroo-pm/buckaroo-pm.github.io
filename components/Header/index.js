import React from 'react';
import { Link } from 'react-router-dom';

export default (props) => (
  <header id="header">
    <div className="content">
      <Link id="logo" to="/">
        Buckaroo
        {/* <img id="icon" src="img/logo-small-negative.png" alt="Buckaroo" /> */}
      </Link>
      <nav>
        <ul>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          <li>
            <a href="https://github.com/LoopPerfect/buckaroo/wiki">Docs</a>
          </li>
          <li>
            <a href="https://github.com/LoopPerfect/buckaroo">GitHub</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);
