import React from 'react';
import {TrackVisibility} from '../../context';


export default (props) => (
  <TrackVisibility {...props}>
    <h5 {...props}>{props.children}</h5>
  </TrackVisibility>
)
