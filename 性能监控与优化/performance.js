// 获取通过performance API计算得到的典型性能指标
const calcTime = () => {
  let times = {}
  let t = window.performance.timing

  // 重定向时间
  times.redirectTime = t.redirectEnd - t.redirectStart

  // DNS 查询耗时
  times.dnsTime = t.domainLookupEnd - t.domainLookupStart

  // TCP 建立连接完成握手的时间
  times.connect = t.connectEnd - t.connectStart

  // TTFB 最初的网络请求发起到服务器接收第一个字节的时间
  times.ttfbTime = t.responseStart - t.navigationStart

  // DNS 缓存时间
  times.appcacheTime = t.domainLookupStart - t.fetchStart

  // 卸载页面的时间
  times.unloadTime = t.unloadEventEnd - t.unloadEventStart

  // request 请求耗时
  times.reqTime = t.responseEnd - t.requestStart

  // 解析dom树耗时
  times.analysisTime = t.domComplete - t.domInteractive

  // domReadyTime dom可交互的时间
  times.domReadyTime = t.domContentLoadedEventEnd - t.fetchStart

  // 白屏时间
  times.blankTime = t.domLoading - t.fetchStart

  // 用户等待页面完全可用的时间
  times.loadPage = t.loadEventEnd - t.navigationStart

  return times
}