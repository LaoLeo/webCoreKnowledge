/**
 * (1)布局抖动问题
 * 
 * 指DOM元素被js多次反复读写，导致文档多次发生无无意义重排。浏览器有个机制是会把多次dom写操作组成队列，当达到预设的阈值或者时机恰当时，统一执行
 * 
 * 下面段代码当element1进行了读写操作后，紧接着去获取element2的值，为了得到准确的数据，浏览器只能去重排了
 */
var h1 = element1.clientHeight
element1.style.height = (h1 * 2) + 'px'

var h2 = element2.clientHeight
element2.style.height = (h2 * 2) + 'px'

var h3 = element3.clientHeight
element3.style.height = (h3 * 2) + 'px'

// 解决方案1：读写分离
var h1 = element1.clientHeight
var h2 = element2.clientHeight
var h3 = element3.clientHeight

element1.style.height = (h1 * 2) + 'px'
element2.style.height = (h2 * 2) + 'px'
element3.style.height = (h3 * 2) + 'px'

// 解决方案2：requestAnimationFrame 延后执行
var h1 = element1.clientHeight
window.requestAnimationFrame(() => element1.style.height = (h1 * 2) + 'px')

var h2 = element2.clientHeight
window.requestAnimationFrame(() => element2.style.height = (h2 * 2) + 'px')

var h3 = element3.clientHeight
window.requestAnimationFrame(() => element3.style.height = (h3 * 2) + 'px')


/**
 * (2) requestAnimationFrame polyfill
 */
if (!window.requestAnimationFrame) window.requestAnimationFrame = (callback, element) => {
  const id = window.setTimeout(() => {
    callback()
  }, 1000 / 60)
  return id
}
if (!window.cancelAnimationFrame) window.cancelAnimationFrame = id => {
  clearTimeout(id)
}


/**
 * 防抖：把短时间内多个连续调用合并成一次，即只触发一次回调函数
 * 
 * 跟节流都是针对resize，scroll，keyup这类高频率触发的事件
 */
const debounce = (func, wait, immediate) => {
  let timeout
  return function() {
    const context = this
    const args = arguments

    const callNow = immediate & !timeout

    timeout && clearTimeout(timeout)

    timeout = setTimeout(function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)

    if (callNow) func.apply(context. args)
  }
}

window.addEventListener('scroll', debounce(() => {
  console.log("debounce scroll")
}), 500)

window.addEventListener('scroll', () => {
  console.log("scroll")
}, 500)


/**
 * 节流: 以一定的频率来执行频繁的调用
 * 
 * 所有的调用都会执行，只是减缓了执行而已
 */
const throttle = (func, wait) => {
  let startTime = 0
  return function() {
    let handleTime = +new Date()
    let context = this
    const args = arguments

    if (handleTime - startTime >= wait) {
      func.apply(context, args)
      startTime = handleTime
    }
  }
}

// 利用setTimeout 跟防抖的区别就是少了clearTimeout
const throttle1 = (func, wait) => {
  let timeout
  return function() {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout  = setTimeout(() => {
        func.apply(context, args)
        timeout = null
      }, wait)
    }
  }
}

/**
 * 可取消的防抖
 */
const debounce = (func, wait, immediate) => {
  let timeout
  return function() {
    const context = this
    const args = arguments

    const callNow = immediate & !timeout

    timeout && clearTimeout(timeout)

    args.callee.__timeout = timeout = setTimeout(function() {
      timeout = null
      args.callee.__timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)

    if (callNow) func.apply(context. args)
  }
}

const cancelDebounce = (debounceFn) => {
  debounceFn.__timeout && clearTimeout(debounceFn.__timeout)
}
