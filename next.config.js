const rehypePrism = require('@mapbox/rehype-prism');
const withMdxEnhanced = require('next-mdx-enhanced')

module.exports = withMdxEnhanced({
  layoutPath: 'layouts',
  defaultLayout: true,
  fileExtensions: ['mdx', 'md'],
  remarkPlugins: [],
  rehypePlugins: [rehypePrism],
  usesSrc: false,
  extendFrontMatter: {
    process: (mdxContent, frontMatter) => {},
    phase: 'prebuild|loader|both',
  },
  reExportDataFetching: false,
})(/* your normal nextjs config */)