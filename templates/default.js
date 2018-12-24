export default ({content, root='', meta={title:"blog"}, styles = [], scripts = []}) =>
 `<!DOCTYPE html>
  <html>
    <head>
      <title>${meta.title}</title>
      <meta charset="utf-8" />
      ${styles.map(url =>`<link rel="stylesheet" type="text/css" href="${root}/${url}"/>\n`)}
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
