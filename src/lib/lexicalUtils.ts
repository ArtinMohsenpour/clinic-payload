interface LexicalNode {
  type: string
  text?: string
  children?: LexicalNode[]
  [key: string]: any
}

export function lexicalToPlainText(content: any): string {
  if (!content || !content.root || !content.root.children) {
    return ''
  }

  function traverse(nodes: LexicalNode[]): string {
    return nodes
      .map((node) => {
        if (node.type === 'text' && node.text) {
          return node.text
        }
        if (node.children) {
          return traverse(node.children)
        }
        if (node.type === 'linebreak') {
          return '\n'
        }
        return ''
      })
      .join('')
  }

  return traverse(content.root.children).trim()
}
