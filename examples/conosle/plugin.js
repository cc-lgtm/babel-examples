module.exports = function({ types, template }) {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.isNew) {
          return
        }
        const name = path.get('callee').toString()
        if (name === 'console.log') {
          const { line, column } = path.node.callee.loc.start
          const newNode = template.expression(`console.log("${state.filename}: (${line}, ${column})")`)()
          newNode.isNew = true
          path.insertBefore(newNode)
        }
      }
    }
  }
}
