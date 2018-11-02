/**
 *
 * @param {object} tag 元素标签名
 * @param {object} attrs 属性
 * @param  {...any} children 子元素
 *
 * @description transform-react-jsx插件去识别jsx后，再去循环调用createElement方法
 * @abstract 如果jsx片段中某个元素是组件，则tag将会是一个方法而不是一个字符串。区分组件和原生DOM的工作，babel-plugin-transform-react-jsx会帮我们做
 *
 */
function createElement (tag, attrs, ...children) {
  attrs = attrs || {}

  return {
    tag,
    attrs,
    children,
    key: attrs.key || null,
   }
}

export default createElement
