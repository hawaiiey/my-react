import { renderComponent } from '../ReactDOM/componentCycle'

// 保存每次setState的数据的队列
const setStateQueue = []
// 渲染的队列
const renderQueue = []

/**
 *
 * @param {object} stateChange 新状态
 * @param {class} component 组件
 *
 * @description 保存setState的数据
 *
 */
function queueSetState (stateChange, component) {
  // 如果setStateQueue的长度为0，也就表示上次flush执行之后第一次往队列里添加数据
  if (setStateQueue.length === 0) defer(flush)

  // 添加setStateQueue
  setStateQueue.push({
    stateChange,
    component,
  })

  // 如果renderQueue当前没有该组件，则添加到队列中
  if (!renderQueue.some(item => item === component)) {
    renderQueue.push(component)
  }
}

/**
 *
 * @description 清空setState队列，并渲染
 *
 */
function flush () {
  let item, component

  // 遍历setStateQueue，清空队列，合并状态
  while (item = setStateQueue.shift()) {
    const { stateChange, component } = item

    // 如果没有prevState，则将当前state作为初始的prevState
    // if (!component.prevState) component.prevState = Object.assign({}, component.state)
    if (!component.prevState) component.prevState = component.state

    // 如果stateChange是个方法，则把通过方法的返回值合并到state中
    if (typeof stateChange === 'function') {
      Object.assign(component.state, stateChange(component.prevState, component.props))
    // 如果stateChange不是个方法，则直接合并到state中
    } else {
      Object.assign(component.state, stateChange)
    }

    // 赋值prevState，保存前一次state
    // component.prevState = component.state
  }

  // 遍历renderQueue，渲染组件
  while (component = renderQueue.shift()) {
    renderComponent(component)
  }
}

function defer (fn) {
  return Promise.resolve().then(fn)
}

export { queueSetState }
