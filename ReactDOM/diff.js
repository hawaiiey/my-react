import setAttribute from './setAttribute'
import { createComponent, setComponentProps, renderComponent, unmountComponent } from './componentCycle'

/**
 *
 * @param {DOM} dom 真实DOM
 * @param {object} vnode 虚拟DOM
 *
 * @description 对比真实DOM和虚拟DOM，在对比过程中直接更新真实DOM。只对比同一层级的变化
 *
 */
export function diff (dom, vnode) {
  console.log('diff', dom, vnode)
  let out = dom

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = ''

  if (typeof vnode === 'number') vnode = String(vnode)

  // 对比文本节点
  if (typeof vnode === 'string') {
    // 如果当前的DOM就是文本节点，则直接替换
    if (dom && isSameNodeType(dom, vnode)) {
      if (dom.textContent !== vnode) dom.textContent = vnode
    // 如果当前的DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
    } else {
      out = document.createTextNode(vnode)
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom)
      }
    }

    return out
  }

  const { tag } = vnode

  // 对比react component
  if (typeof tag === 'function') return diffComponent(out, vnode)

  // 对比HTML元素节点：
  // 若真实DOM不存在 或者 真实DOM存在且新旧两个节点类型不一样，需要多做以下操作
  if (!dom || !isSameNodeType(dom, vnode)) {
    out = document.createElement(tag)

    if (dom) {
      [...dom.childNodes].map(out.appendChild) // 将原来的子节点移到新节点下

      if (dom.parentNode) dom.parentNode.replaceChild(out, dom) // 替换原来的DOM
    }
  }

  // 对比属性
  diffAttributes(out, vnode)

  // 对比子节点
  if (vnode.children && vnode.children.length > 0 || (out.childNodes && out.childNodes.length > 0)) diffChildren(out, vnode.children)

  return out
}

/**
 *
 * @param {DOM} dom 真实DOM
 * @param {object} vnode 虚拟DOM
 *
 * @description 对比react component
 *
 */
function diffComponent (dom, vnode) {
  console.log('diffcomp', dom, vnode)
  let c = dom && dom._component
  let oldDom = dom

  // 如果组件类型没有变化，则重新set props
  if (c && c.constructor === vnode.tag) {
    setComponentProps(c, vnode.attrs)
    dom = c.base
  // 如果组件类型变化，则移除掉原来的组件，并渲染新的组件
  } else {
    if (c) {
      unmountComponent(c)
      oldDom = null
    }

    c = createComponent(vnode.tag, vnode.attrs)
    c = setComponentProps(c, vnode.attrs)
    renderComponent(c)
    dom = c.base

    if (oldDom && dom !== oldDom) {
      oldDom._component = null
      removeNode(oldDom)
    }
  }

  return dom
}

/**
 *
 * @param {DOM} dom 真实DOM
 * @param {object} vnode 虚拟 DOM
 *
 * @description 对比节点属性
 *
 */
function diffAttributes (dom, vnode) {
  const oldAttrs = {} // 当前DOM的属性
  const attrs = vnode.attrs || {} // 虚拟DOM的属性

  // 赋值old
  for (let i = 0; i < dom.attributes.length; i++) {
    const attr = dom.attributes[i]
    oldAttrs[attr.name] = attr.value
  }

  // 原来的属性不在新的属性上，则将其移除
  Object.keys(oldAttrs).forEach(name => {
    if (!(name in attrs)) setAttribute(dom, name, undefined)
  })

  // 更新属性值
  Object.keys(attrs).forEach(name => {
    if (oldAttrs[name] !== attrs[name]) setAttribute(dom, name, attrs[name])
  })
}

/**
 *
 * @param {DOM} dom 真实DOM
 * @param {object} vchildren 虚拟DOM
 *
 * @description 对比子节点
 *
 */
function diffChildren (dom, vchildren) {
  const domChildren = dom.childNodes // DOM子节点
  const children = [] // 没有key的子节点
  const keyed = {} // 有key的子节点以及它的key

  // 将有key的节点和没有key的节点分开
  if (domChildren.length > 0) {
    for (let i = 0; i < domChildren.length; i++) {
      const child = domChildren[i]
      const key = child.key
      if (key) {
        keyed[key] = child
      } else {
        children.push(child)
      }
    }
  }

  if (vchildren && vchildren.length > 0) {
    let min = 0
    let childrenLen = children.length

    vchildren.forEach((vchild, i) => {
      const key = vchild.key // key值
      let child = null

      // 如果有key，找到对应key值得节点
      if (key) {
        if (keyed[key]) {
          child = keyed[key]
          keyed[key] = undefined
        }
      // 如果没有key，则优先找到类型相同的节点
      } else if (min < childrenLen) {
        for (let j = min; j < childrenLen; j++) {
          let c = children[j]
          if (c && isSameNodeType(c, vchild)) {
            child = c
            children[j] = undefined

            if (j === childrenLen - 1) childrenLen--
            if (j === min) min++

            break
          }
        }
      }

      // 对比
      child = diff(child, vchild)

      // 更新DOM
      const f = domChildren[i]
      if (child && child !== dom && child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(child)
        // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
        } else if (child === f.nextSibling) {
          removeNode(f)
        // 将更新后的节点移动到正确的位置
        } else {
          // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已经存在的节点
          dom.inserBefore(child, f)
        }
      }
    })
  }
}

/**
 *
 * @param {DOM} dom 真实DOM
 * @param {object} vnode 虚拟DOM
 *
 * @description 判断DOM类型是否相同
 *
 */
function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') return dom.nodeType === 3;

  if (typeof vnode.tag === 'string') return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase()

  return dom && dom._component && dom._component.constructor === vnode.tag;
}
