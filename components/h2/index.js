import React from 'react';
import {TrackVisibility} from '../../context';


export default (props) => (
  <TrackVisibility {...props}>
    <h2 {...props}>{props.children}</h2>
  </TrackVisibility>
)
