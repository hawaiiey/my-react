/**
 *
 * @param {object} tag 元素标签名
 * @param {object} attrs 属性
 * @param  {...any} children 子元素
 *
 * @description transform-react-jsx插件去识别jsx后，再去循环调用createElement方法
 *
 */
function createElement (tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children,
   }
}

export default createElement
