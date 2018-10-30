import setAttribute from './setAttribute'
import { Component } from '../React'

/**
 *
 * @param {object} vnode 虚拟DOM
 * @param {DOM} container 真实的DOM容器
 *
 * @description 将虚拟DOM处理成真实DOM后，放入真实DOM容器
 *
 */
export function render (vnode, container) {
  return container.appendChild(_render(vnode))
}

/**
 *
 * @param {object} vnode 虚拟DOM
 *
 * @description 将虚拟DOM渲染成真实DOM
 *
 */
function _render (vnode) {
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
    setComponentProps(component, attrs)
    return component.base
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

/**
 *
 * @param {class[function]} component 类或函数
 * @param {object} props 属性
 *
 * @description 创建React组件的方法
 *
 */
function createComponent (component, props) {
  let inst

  // 如果是类定义组件，则直接返回实例
  if (component.prototype && component.prototype.render) {
    inst = new component(props)
  // 如果是函数定义组件，则将其扩展为类定义组件
  } else {
    inst = new Component(props)
    inst.constructor = component
    inst.render = function () {
      return this.constructor(props)
    }
  }

  return inst
}

/**
 *
 * @param {class} component React组件
 * @param {object} props 组件属性
 *
 * @description 组件赋值属性的方法，其中可实现componentWillMount、componentWillReceiveProps两个生命周期方法
 *
 */
function setComponentProps (component, props) {
  // 如果组件第一次渲染
  if (!component.base) {
    if (component.componentWillMount) component.componentWillMount()
  // 如果组件重新渲染
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props)
  }

  component.props = props

  renderComponent(component)
}

/**
 *
 * @param {class} component React组件
 *
 * @description 渲染组件的方法，setState方法中会直接调用这个方法进行重新渲染。其中可实现componentWillUpdate、componentDidUpdate、componentDidMount三个生命周期方法
 *
 */
export function renderComponent (component) {
  const { componentWillUpdate, componentDidUpdate, componentDidMount } = component
  let base

  // 若不是第一次渲染，则执行componentWillUpdate
  if (component.base && componentWillUpdate) componentWillUpdate()

  // render，返回虚拟DOM
  const renderer = component.render()

  // 赋值base为真实DOM
  base = _render(renderer)

  // 如果不是首次渲染，则执行componentDidUpdate
  if (component.base) {
    if (componentDidUpdate) componentDidUpdate()
  // 如果是首次渲染，则执行componentDidMount
  } else if (componentDidMount) {
    componentDidMount()
  }

  // 如果不是首次渲染且存在父元素，则用新的DOM替换旧的DOM
  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base)
  }

  // 将base挂载到component上
  component.base = base
  base._component = component
}
