const analytics = ua  => `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', ${ua}, 'buckaroo.pm');
ga('send', 'pageview');
`;

export default ({ content, root = '', meta = { title: "blog" }, styles = [], scripts = [] }) => {
  styles = styles.slice().reverse();

  return (
  `<!DOCTYPE html>
    <html>
      <head>
        <title>Buckaroo - The C++ Package Manager ${meta.title}</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" type="text/css" href="./styles/normalize.min.css"/>
        ${styles.map(url =>`<link rel="stylesheet" type="text/css" href="${root}/${url}"/>\n`)}
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro" rel="stylesheet">
        <script type="text/javascript">
          window.rootUrl = "${root}"
        </script>
      </head>
      <body>
        <div id="react-root">
        ${content}
      </div>
      <script>${analytics("UA-98721445-1")}</script>
      ${scripts.map(url =>`<script type="text/javascript" src="${root}/${url}"></script>\n`)}
      </body>
    </html>`
  );
};
