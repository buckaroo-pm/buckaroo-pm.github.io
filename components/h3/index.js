import React from 'react';
import {TrackVisibility} from '../../context';


export default (props) => (
  <TrackVisibility {...props}>
    <h3 {...props}>{props.children}</h3>
  </TrackVisibility>
)
