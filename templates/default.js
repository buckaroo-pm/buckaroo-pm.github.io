export default ({content, meta={title:"blog"}, styles = [], scripts = []}) =>
 `<!DOCTYPE html>
  <html>
    <head>
      <title>${meta.title}</title>
      <meta charset="utf-8" />
      ${styles.map(url =>`<link rel="stylesheet" type="text/css" href="/${url}"/>\n`)}
    </head>
    <body>
      <div id="react-root">
      ${content}
      </div>
      ${scripts.map(url =>`<script type="text/javascript" src="/${url}"></script>\n`)}
    </body>
  </html>`
