import React from '../../React'

export default class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { num: 0 }
  }

  componentWillMount() {
    console.log('willmount')
  }

  componentDidMount() {
    console.log('didmount')
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
