const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const types = require('@babel/types')
const tempalte = require('@babel/template')

const sourceCode = `
function add(a: number, b: number): number {
    console.log('执行成功了')
    return a + b
  }
`

const ast = parser.parse(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['typescript']
})

traverse(ast, {
  CallExpression(path) {
    if (path.node.isNew) {
      return
    }
    const name = generator(path.node.callee).code
    if (name === 'console.log') {
      const { line, column } = path.node.callee.object.loc.start
      const newNode = tempalte.expression(`console.log("filename: (${line}, ${column})")`)()
      newNode.isNew = true
      path.insertBefore(newNode)
    }
  }
})

const { code } = generator(ast)
console.log(code)
