import React, { Component } from './React'
import Welcome from './components/Welcome'
import Counter from './components/Counter'

export default class App extends Component {
  render() {
    return (
      <h1 className="content">
        <p style="width:300px;background:red">hello world !!!</p>
        <p style={{ width:'300px',border: '2px solid #000' }}>hello world !!!</p>
        <Welcome name="hawaiiey" />
        <Counter />
      </h1>
    )
  }
}
