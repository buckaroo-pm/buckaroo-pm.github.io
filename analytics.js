import { withRouter } from 'react-router';

const onUpdate = () => {
  if (typeof window !== undefined) {
    if (window.ga) {
      window.ga('set', 'page', window.location.pathname + window.location.search);
      window.ga('send', 'pageview');
    }

    if (window.mixpanel) {
      window.mixpanel.track('Page View');
    }
  }
}

export default withRouter(() => {
  onUpdate();
  return null;
});

