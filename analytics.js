import { withRouter } from 'react-router';

const onUpdate = () => {
  if (typeof window !== undefined && window.ga) {
    window.ga('set', 'page', window.location.pathname + window.location.search);
    window.ga('send', 'pageview');
  }
}

export default withRouter(() => {
  onUpdate();
  return null;
});

