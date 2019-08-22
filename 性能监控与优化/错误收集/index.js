/**
 * 利用uglify-js为每个函数代码添加try catch
 */

const fs = require('fs')
const _ = require('lodash')
const UglifyJS = require('uglify-js')

const isASTFunctionNode = node => node instanceof UglifyJS.AST_Defun || node instanceof UglifyJS.AST_Function

const globalFuncTryCatch = (source, errorHandler) => {
  if (!_.isFunction(errorHandler)) {
    throw 'errorHandler should be a valid function'
  }

  const errorHandlerSource = errorHandler.toString()
  const errorHandlerAST = UglifyJS.parse('(' + errorHandlerSource + ')(error);')
  var tryCatchAST = UglifyJS.parse('try{}catch(error){}')
  const sourceAST = UglifyJS.parse(source)
  var topFuncScope = []

  tryCatchAST.body[0].catch.body[0] = errorHandlerAST

  const walker = new UglifyJS.TreeWalker(function (node) {
    if (isASTFunctionNode(node)) {
      topFuncScope.push(node)
    }
  })

  const transfer = new UglifyJS.TreeTransformer(null, node => {
    if (isASTFunctionNode(node) && _.includes(topFuncScope, node)) {
      var stream = UglifyJS.outputStream()
      for (var i = 0; i< node.body.length; i++) {
        node.body[i].print(stream)
      }
      var innerFuncCode = stream.toString()
      tryCatchAST.body[0].body.splice(0, tryCatchAST.body[0].body.length)
      var innerTryCatchNode = UglifyJS.parse(innerFuncCode, { topLevel: tryCatchAST.body[0] })
      node.body.splice(0, node.body.length)
      return UglifyJS.parse(innerTryCatchNode.print_to_string(), { topLevel: node })
    }
  })

  sourceAST.walk(walker)
  sourceAST.transform(transfer)

  const outputCode = sourceAST.print_to_string({ beautify: true })
  return outputCode
}

module.exports.globalFuncTryCatch = globalFuncTryCatch