import React from './React'
import ReactDOM from './ReactDOM'

ReactDOM.render(
  <h1 className="content">
    <p style="width:300px;background:red">hello world !!!</p>
    <p style={{ width:'300px',border: '2px solid #000' }}>hello world !!!</p>
  </h1>,
  document.getElementById('root'),
)
