import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote/rsc"
import { mdxComponents } from "./components"
import { CodeBlock } from "./code-block"

interface MdxComponentProps {
  source: MDXRemoteSerializeResult
}

export function MdxComponent({ source }: MdxComponentProps) {
  return (
    <MDXRemote
      {...source}
      components={{
        ...mdxComponents,
        pre: (props: any) => {
          const { children, ...rest } = props
          return <CodeBlock {...rest}>{children}</CodeBlock>
        },
      }}
    />
  )
}

