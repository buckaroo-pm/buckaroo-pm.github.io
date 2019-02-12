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
        ${scripts.map(url =>`<script type="text/javascript" src="${root}/${url}"></script>\n`)}
      </body>
    </html>`
  );
};
