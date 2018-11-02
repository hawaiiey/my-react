import render from './render'

export default {
  render: (vnode, container) => {
    // 每次调用时，清除原来挂载在DOM的内容
    container.innerHTML = ''
    return render(vnode, container)
  },
}
