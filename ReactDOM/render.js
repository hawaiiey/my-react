import setAttribute from './setAttribute'

/**
 *
 * @param {object} vnode 虚拟DOM
 * @param {DOM} container 真实DOM容器
 *
 * @description 将虚拟DOM渲染成真实DOM
 *
 */
function render (vnode, container) {
  // 当vnode为字符串时，渲染结果是一段文本
  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode)
    return container.appendChild(textNode)
  }

  const { tag, attrs, children } = vnode

  // 创建DOM
  const dom = document.createElement(tag)

  // 遍历attrs
  if (attrs) {
    Object.keys(attrs).forEach(key => {
      const value = attrs[key]
      setAttribute(dom, key, value) // 调用setAttribute函数，设置属性
    })
  }

  // 遍历children，递归render
  children.forEach(child => render(child, dom))

  // 将渲染结果挂载到真实的DOM容器中
  return container.appendChild(dom)
}

export default render
