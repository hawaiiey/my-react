import React, { Component } from '../../React'

export default class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = { num: 0 }
  }

  componentWillMount() {
    console.log('<Counter />: willmount!!!')
  }

  componentDidMount() {
    console.log('<Counter />: didmount!!!')
    for (let i = 0; i < 100; i++) {
      // this.setState({ num: this.state.num + 1 }) // 1
      this.setState(prevState => ({ num: prevState.num + 1 })) // 100
    }
  }

  componentWillReceiveProps() {
    console.log('<Counter />: willreceiveprops!!!')
  }

  componentWillUpdate() {
    console.log('<Counter />: willupdate!!!')
  }

  componentDidUpdate() {
    console.log('<Counter />: didupdate!!!')
  }

  _onClick() {
    this.setState({ num: this.state.num + 1 })
  }

  render() {
    console.log('<Counter />: render!!!', 'props: ', this.props, 'state: ', this.state)
    return (
      <div>
        <h1>number: {this.state.num}</h1>
        <button onClick={() => this._onClick()}>add</button>
      </div>
    )
  }
}
