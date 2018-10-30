import React, { Component } from '../../React'
import Name from '../Name'

export default class Welcome extends Component {
  render() {
    return <h1>
      Hello,
      <Name name={this.props.name} />!!!
    </h1>
  }
}
