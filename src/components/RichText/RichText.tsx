import React from 'react'

type LexicalNode = {
  type: string
  version: number
  children?: LexicalNode[]
  direction?: string | null
  format?: string | number
  indent?: number
  text?: string
  mode?: string
  style?: string
  detail?: number
  fields?: any
  [key: string]: any
}

type RichTextProps = {
  content: {
    root: LexicalNode
  }
  className?: string
  disableLinks?: boolean
}

export const RichText: React.FC<RichTextProps> = ({ content, className, disableLinks }) => {
  if (!content?.root?.children) return null

  const renderNode = (node: LexicalNode, index: number): React.ReactNode => {
    switch (node.type) {
      case 'root':
        return <div key={index}>{node.children?.map(renderNode)}</div>

      case 'paragraph':
        return (
          <p key={index} className="[&:not(:last-child)]:mb-4">
            {node.children?.map(renderNode)}
          </p>
        )
      
      case 'text':
        let text: React.ReactNode = node.text
        if (node.format === 1 || (typeof node.format === 'number' && (node.format & 1))) {
          text = <strong key={index}>{text}</strong>
        }
        if (node.format === 2 || (typeof node.format === 'number' && (node.format & 2))) {
          text = <em key={index}>{text}</em>
        }
        if (node.format === 4 || (typeof node.format === 'number' && (node.format & 4))) {
          text = <span key={index} className="line-through">{text}</span>
        }
        if (node.format === 8 || (typeof node.format === 'number' && (node.format & 8))) {
          text = <u key={index}>{text}</u>
        }
        if (node.format === 16 || (typeof node.format === 'number' && (node.format & 16))) {
          text = <code key={index} className="bg-card px-1 rounded text-secondary">{text}</code>
        }

        const style: React.CSSProperties = {}
        if (node.style) {
          const styles = node.style.split(';')
          styles.forEach((s) => {
            const [prop, value] = s.split(':')
            if (prop && value) {
              const camelProp = prop.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as keyof React.CSSProperties
              // @ts-ignore
              style[camelProp] = value.trim()
            }
          })
        }

        // Ensure bold format takes precedence over style if style doesn't explicitly specify a bold weight
        if ((node.format === 1 || (typeof node.format === 'number' && (node.format & 1))) && !style.fontWeight) {
          style.fontWeight = '800'
        }

        return (
          <span key={index} style={style}>
            {text}
          </span>
        )
      
      case 'linebreak':
        return <br key={index} />
      
      case 'autolink':
      case 'link':
        const isCustom = node.fields?.linkType === 'custom'
        const href = isCustom ? node.fields?.url : `/${node.fields?.doc?.value}`

        if (disableLinks) {
          return <span key={index}>{node.children?.map(renderNode)}</span>
        }

        return (
          <a
            key={index}
            href={href}
            className="hover:text-secondary hover:underline transition-all"
            target={node.fields?.newTab ? '_blank' : undefined}
            rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
          >
            {node.children?.map(renderNode)}
          </a>
        )
      
      case 'list':
        const ListTag = node.tag === 'ol' ? 'ol' : 'ul'
        return (
          <ListTag key={index} className={ListTag === 'ul' ? 'list-disc mr-6 mb-4' : 'list-decimal mr-6 mb-4'}>
            {node.children?.map(renderNode)}
          </ListTag>
        )
      
      case 'listitem':
        return <li key={index}>{node.children?.map(renderNode)}</li>

      case 'heading': {
        const HeadingTag = `h${node.tag?.replace('h', '') || '2'}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
        return (
          <HeadingTag key={index} className="font-bold mb-4 mt-6">
            {node.children?.map(renderNode)}
          </HeadingTag>
        )
      }

      default:
        if (node.children) {
          return <React.Fragment key={index}>{node.children.map(renderNode)}</React.Fragment>
        }
        return null
    }
  }

  return (
    <div className={`rich-text ${className || ''}`} dir="rtl">
      {content.root.children.map(renderNode)}
    </div>
  )
}
