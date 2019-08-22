/**
 * 集中化脚本统计首屏时间的方法
 * 默认将img作为影响首屏时间的关键因素
 */

// 方法1：使用定时器
(function logFSTByInterval() {
  const win = window
  const firstScreenHeight = win.screen.height
  const firstScreenImgs = []
  let isFindLastImg = false
  let allImgLoaded = false
  let collect = []

  const t = setInterval(() => {
    let i, img
    if (isFindLastImg) {
      // 找到了首屏里的最后一张图片
      if (firstScreenImgs.length) {
        for (i = 0; i < firstScreenImgs.length; i++) {
          img = firstScreenImgs[i]
          if (!img.complete) {
            allImgLoaded = false
            break
          } else {
            allImgLoaded = true
          }
        }
      } else {
        allImgLoaded = true
      }
      if (allImgLoaded) {
        collect.push({
          firstScreenLoaded: Date.now() - performance.timing.navigationStart
        })
        console.log('首屏时间：', Date.now() - performance.timing.navigationStart)
        clearInterval(t)
      }
    } else {
      // 还没找到，继续找首屏内的图片
      var imgs = document.body.querySelector('img')
      for (i = 0; i < imgs.length; i++) {
        img = imgs[i]
        var imgOffsetTop = getOffsetTop(img)
        if (imgOffsetTop > firstScreenHeight) {
          isFindLastImg = true
          break
        } else if (imgOffsetTop <= firstScreenHeight && !img.hasPushed) {
          img.hasPushed = 1
          firstScreenImgs.push(img)
        }
      }
    }
  }, 0)

  const doc = document
  doc.addEventListener('DOMContentLoaded', function () {
    var imgs = doc.body.querySelector('img')
    if (!imgs.length) {
      isFindLastImg = true
    }
  })

  win.addEventListener('load', function () {
    // 所有资源都加载完成
    allImgLoaded = true
    isFindLastImg = true
    if (t) {
      clearInterval(t)
    }
    console.log(collect)
  })

  function getOffsetTop(ele) {
    var offsetTop = ele.offsetTop
    if (ele.offsetParent !== null) {
      offsetTop += getOffsetTop(ele.offsetParent)
    }
  
    return offsetTop
  }
})()


// 方法2：不使用定时器
(function logFSTWithoutInterval(win) {
  win.logInfo = {}
  let images = document.getElementsByTagName('img')
  let iLen = images.length
  let curMax = 0
  let inScreenLen = 0

  // 图片加载回调
  function imageBack() {
    this.removeEventListener && this.removeEventListener('load', imageBack, !1)
    if (++curMax === inScreenLen) {
      // 所有在首屏的图片均已加载完成的话，发送日志
      log()
    }
  }

  // 对于所有的位于指定区域的图片，绑定回调事件
  for (var i = 0; i < iLen; i++) {
    var img = images[i]
    var offset = {
      top: 0
    }
    var curImg = img
    while (curImg.offsetParent) {
      offset.top += curImg.offsetTop
      curImg = curImg.offsetParent
    }
    // 判断图片不在首屏
    if (document.documentElement.clientHeight < offset.top) {
      continue
    }
    // 图片还没有加载完成的话
    if (!img.complete) {
      inScreenLen++
      img.addEventListener('load', imageBack, !1)
    }
  }
  // 如果首屏没有图片的话，直接发送日志
  if (inScreenLen === 0) {
    log()
  }
  // 发送日志进行统计
  function log() {
    win.logInfo.firstScreen = +new Date() - window.performance.timing.navigationStart
    console.log('首屏时间：', win.logInfo.firstScreen)
  }
})(window)