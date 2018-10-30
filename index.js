import React from './React'
import ReactDOM from './ReactDOM'
import Welcome from './components/Welcome'
import Counter from './components/Counter'

ReactDOM.render(
  <h1 className="content">
    <p style="width:300px;background:red">hello world !!!</p>
    <p style={{ width:'300px',border: '2px solid #000' }}>hello world !!!</p>
    <Welcome name="hawaiiey" />
    <Counter />
  </h1>,
  document.getElementById('root'),
)
