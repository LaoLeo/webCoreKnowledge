## multirepo和monorepo
* multirepo就是将应用按照模块分别在不同的创库进行管理，App-project和Component-lib的管理模式，倡导分而治之
* monorepo就是将应用模块全部集中到一个项目管理

monorepo现在越来越流行，主要解决多package项目的包更新、发布与测试不统一过于分散操作繁琐的问题。

**monorepo 的优势：**
* 所有项目拥有一致的 lint，以及构建、测试、发布流程
* 不同项目之间容易调试、协作
* 方便处理 issues
* 容易初始化开发环境
* 易于发现 bug

**monorepo 的劣势：**
* 源代码不易理解
* 项目体积过大

**使用lerna实现monorepo**

[lerna](https://github.com/lerna/lerna)
> A tool for managing JavaScript projects with multiple packages.

安装：
```
npm i -g lerna
```

最终项目结构为：
```
packages/
  module-1/
    package.json
  module-2/
    package.json
  module-3/
    package.json
package.json
lerna.json
```
关键命令：
```
lerna bootstrap # 安装子package的依赖
lerna publish # 发布packages
```


但是monorepo项目依赖问题尤为明显，子package目录下可能会存在重复的npm包，这样会造成冗余。可以使用yarn workspaces来管理项目依赖。

## 管理依赖
workspaces定位：
> It allows you to setup multiple packages in such a way that you only need to run yarn install once to install all of them in a single pass.

意思就是可以更好的管理多个package的monorepo的包依赖。本身属于yarn中的一个功能。

在根目录的package.json中引入：
```
  "private": true,
  "workspaces": ["packages/*"] // ["package-1", "package-2"]
```

全部安装或更新包：
```
yarn install / yarn upgrade <npm-package>
```

如果只想更新某个package下的依赖包版本：
```
yarn workspace <workspace-name> upgrade <npm-package>
```

现在有个场景: 有两个packages，package-1和package-2，他们的package.json如下：
```
{
  "name": "package-1",
  "version": "1.0.0",

  "dependencies": {
    "react": "16.2.3"
  }
}
```
以及：
```
{
  "name": "package-2",
  "version": "1.0.0",

  "dependencies": {
    "react": "16.2.3",
    "package-1": "1.0.0"
  }
}
```
执行 yarn install 之后，发现项目根目录下的 node_modules 内已经包含所有声明的依赖，且各个子 package 的 node_modules 里面不会重复存在依赖，只会有针对根目录下 node_modules 中的 React 引用。

一般结合lerna来发挥更大的作用：
* lerna管理package的更新与发布
* workspace管理整个项目包括所有子package的依赖

一起配合的使用的配置更改如下：
lerna.json
```
  "npmClient": "yarn",
  "useWorkspaces": true,
  ...
```
根目录package.json
```
  "private": true,
  "workspaces": [
    "packages/*"
  ]
```

lerna开启workspace后packages配置将不再生效，需要在package.json的workspaces中配置。