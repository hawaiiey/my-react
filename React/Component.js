// import { renderComponent } from '../ReactDOM/componentCycle'
import { queueSetState } from './setStatequeue'

export default class Component {
  constructor(props = {}) {
    this.state = {}
    this.props = props
  }

  setState(stateChange) {
    // 将修改合并到state
    // Object.assign(this.state, stateChange)
    // renderComponent(this)

    // 不再重新渲染组件，而是添加进队列
    queueSetState(stateChange, this)
  }
}
