/**
 *
 * @param {DOM} dom
 * @param {string} name
 * @param {any} value
 *
 */
function setAttribute (dom, name, value) {
  // 如果属性名是className，改回class
  if (name === 'className') name = 'class'

  // 如果属性名是onXXX，则是一个事件监听方法
  if (/on\w+/.test(name)) {
    name = name.toLowerCase()
    dom[name] = value || ''
  // 如果属性名是style，则更新style对象
  } else if (name === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || ''
    } else if (value && typeof value === 'object') {
      Object.keys(value).forEach(key => {
        dom.style[key] = typeof value[key] === 'number' ? `${value[key]}px` : value[key]
      })
    }
  // 普通属性则直接更新
  } else {
    // 自定义属性
    if (name in dom) {
      dom[name] = value || ''
    }
    // 固有属性
    if (value) {
      dom.setAttribute(name, value)
    } else {
      dom.removeAttribute(name)
    }
  }
}

export default setAttribute
