import React from 'react';
import {TrackVisibility} from '../../context';


export default (props) => (
  <TrackVisibility {...props}>
    <h1 {...props}>{props.children}</h1>
  </TrackVisibility>
)
