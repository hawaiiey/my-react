import React, { Component } from '../../React'

export default class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = { num: 0 }
  }

  componentWillMount() {
    console.log('willmount')
  }

  componentDidMount() {
    console.log('didmount')
    for (let i = 0; i < 100; i++) {
      // this.setState({ num: this.state.num + 1 }) // 1
      this.setState(prevState => ({ num: prevState.num + 1 })) // 100
    }
  }

  componentWillReceiveProps() {
    console.log('willreceiveprops')
  }

  componentWillUpdate() {
    console.log('willupdate')
  }

  componentDidUpdate() {
    console.log('didupdate')
  }

  _onClick() {
    this.setState({ num: this.state.num + 1 })
  }

  render() {
    console.log('render', this.props, this.state)
    return (
      <div>
        <h1>number: {this.state.num}</h1>
        <button onClick={() => this._onClick()}>add</button>
      </div>
    )
  }
}
