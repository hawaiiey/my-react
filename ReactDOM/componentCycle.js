import { Component } from '../React'
import { diff } from './diff'

/**
 *
 * @param {class/function} component 类或函数
 * @param {object} props 属性
 *
 * @description 创建React组件的方法
 * @returns 实例化组件
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
 * @returns 赋值后的组件
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

  return component
}

/**
 *
 * @param {class} component React组件
 *
 * @description 渲染组件的方法，setState方法中会直接调用这个方法进行重新渲染。其中可实现componentWillUpdate、componentDidUpdate、componentDidMount三个生命周期方法
 *
 */
function renderComponent (component) {
  // 千万不能用结构！！！会导致原型链丢失！！！this变为undefined！！！
  // const { componentWillUpdate, componentDidUpdate, componentDidMount } = component
  let base

  // 若不是第一次渲染，则执行componentWillUpdate
  if (component.base && component.componentWillUpdate) component.componentWillUpdate()

  // render，返回虚拟DOM
  const renderer = component.render()

  // 赋值base为真实DOM
  base = diff(component.base, renderer)

  // 如果不是首次渲染，则执行componentDidUpdate
  if (component.base) {
    if (component.componentDidUpdate) component.componentDidUpdate()
  // 如果是首次渲染，则执行componentDidMount
  } else if (component.componentDidMount) {
    component.componentDidMount()
  }

  // 如果不是首次渲染且存在父元素，则用新的DOM替换旧的DOM
  // if (component.base && component.base.parentNode) {
  //   component.base.parentNode.replaceChild(base, component.base)
  // }

  // 将base挂载到component上
  component.base = base
  base._component = component
}

/**
 *
 * @param {class} component react component
 *
 * @description 卸载组件
 *
 */
function unmountComponent(component) {
  if (component.componentWillUnmount) component.componentWillUnmount()

  // 删除真实DOM
  if (component.base && component.base.parentNode) {
    component.base.parentNode.removeChild(component.base)
  }
}

export {
  createComponent,
  setComponentProps,
  renderComponent,
  unmountComponent,
}
