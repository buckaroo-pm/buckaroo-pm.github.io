import React from 'react';
import {TrackVisibility} from '../../context';


export default (props) => (
  <TrackVisibility {...props}>
    <h4 {...props}>{props.children}</h4>
  </TrackVisibility>
)
