
## 前端错误收集方案对比
方案 | 覆盖范围 | 不能覆盖范围 | 优缺点 | 注意点
---|---|---|---|---
try catch | 运行时非异步错误 | 语法错误、异步错误 | 代码侵入性太强 | 可以利用AST给函数代码外包一层try catch
window.error | 运行时异步、非异步错误 |  语法错误、网络错误（因为网络请求异常不会事件冒泡） | 侵入性小 | 1. 处理函数内显式返回true，保证错误不被向上抛出 <br>2. 跨域脚本需要加上crossorigin="anonymous"，否则虽能捕获错误但是缺少异常信息，同时服务器添加Access-Control-Allow-Origin指定允许域请求访问<br>3. 对于压缩的脚本需要结合sourcemap文件来获取异常详细信息 <br><br>关于script标签知识可以参考[这里](https://github.com/rainjay/blog/issues/1)
promise错误处理 | | | | 1. 要养成使用catch的方式，因为onReject不能捕获到同级then内的错误<br>2. window.addEventListener("unhandledrejection", e=>{})可以捕获promise全局异常
script和link标签绑定onerror事件， window.addEventListener('error', e=>{}, true) | 网络资源加载错误 | | | 1. 区别网络资源加载错误和其他一般错误在于，前着没有error.message<br>2. 至于判断加载类别如404需要结合后端日志来排查
React componentDidCatch<br>Vue.config.errorHandler | 响应框架错误处理方案 | | | 这两个框架都会用console.error来抛出错误，因此可以劫持console.error来做处理

## 错误上报
* 使用单域名上报，减少服务器压力同时避免浏览器对同域名请求数量的限制
* 构造空的Image对象方式跳过请求跨域问题
```
let url = 'xxx?data=' + JSON.stringify(data)
let img = new Image()
img.src = url
```
* 何时上报
    - 页面加载和重新刷新
    - 页面切换路由
    - 页面所在的 Tab 标签重新变得可见
    - 页面关闭
* 单页应用上报
    - 如果路由切换通过改变hash，则监听hashchange
    - 如果使用historyAPI，则需要使用pushState和replaceState事件
* 当在页面关闭时上报数据
    - 使用同步的方式会影响跳转流程，异步的方式又难以确保
    - 使用sendBeacon
```
window.addEventListener('unload', logData, false)

const logData = () => {
    navigator.sendBeacon("/log", data)
}

// google analytics采用如下方式
const reportData = url => {
    // ...
    if (urlLength < 2083) {
        imgReport(url, times)
    } else if (navigator.sendBeacon) {
        sendBeacon(url, times)
    } else {
        xmlLoadData(url, times)
    }
}
```
* 页面访问量大，设置采样率
```
const reportData = url => {
    // 采集30%
    if (Math.random() < 0.3) {
        send()
    }
}
```