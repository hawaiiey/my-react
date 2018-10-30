import React from '../../React'
import Name from '../Name'

export default class Welcome extends React.Component {
  render() {
    return <h1>
      Hello,
      <Name name={this.props.name} />!!!
    </h1>
  }
}
