import setAttribute from './setAttribute'
import { createComponent, setComponentProps, renderComponent } from './componentCycle'
import { diff } from './diff'

/**
 *
 * @param {object} vnode 虚拟DOM
 * @param {DOM} container 真实的DOM容器
 * @param {DOM} dom 真实DOM
 *
 * @description 清空容器的DOM，并直接进入diff算法
 *
 */
export default function render (vnode, container, dom) {
  // 每次调用时，清除原来挂载在DOM的内容
  container.innerHTML = ''

  // return container.appendChild(_render(vnode))
  return diff(dom, vnode, container)
}

/**
 *
 * @param {object} vnode 虚拟DOM
 *
 * @description 将虚拟DOM渲染成真实DOM
 *
 */
function _render (vnode) {
  console.log('_render', vnode)
  // 当vnode为undefined、null、boolean时，渲染结果为''
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = ''

  // 当vnode为string、number时，渲染结果是一段文本
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    const textNode = document.createTextNode(String(vnode))
    return textNode
  }

  const { tag, attrs, children } = vnode

  // 如果vnode.tag为function时，创建react component赋值组件props
  if (typeof tag === 'function') {
    const component = createComponent(tag, attrs)
    const _component = setComponentProps(component, attrs)
    renderComponent(_component)
    return _component.base
  // 如果vnode.tag为DOM元素标签时，创建真实DOM
  } else {
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

    return dom
  }
}
