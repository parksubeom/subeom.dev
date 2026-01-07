import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"

export const mdxOptions = {
  parseFrontmatter: true,
  mdxOptions: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["anchor-link"],
          },
        },
      ],
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: false,
          onVisitLine(node: any) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }]
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push("highlighted")
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ["highlighted-word"]
          },
        },
      ],
    ],
  },
}

