import React, {createContext, Component} from 'react';
import IsVisible from 'react-visibility-sensor';

const visibilityObserver = createContext('visibility'); 

const nop = (props)=>(state)=>{};

export class TrackVisibility extends Component {
  static contextType = visibilityObserver;
  render() {
    const { onChange = nop } = (this.context||{});
    const ref = React.createRef();
    return (
      <IsVisible onChange={onChange(this.props, ref)} ref={ref}>
        {this.props.children}
      </IsVisible>
    );
  }
}

export const VisibilityTracker = visibilityObserver.Provider;
