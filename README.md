# react-electron-admin

Built with [React](https://facebook.github.io/react/), [Material-UI](https://material-ui.com), [React Router](https://reacttraining.com/react-router/), [Electron](https://www.electronjs.org/), [Immer](https://github.com/immerjs/immer), [react-use](https://github.com/streamich/react-use)

## Quick Start

#### run `yarn dev`

Open http://localhost:2233 to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.
<s>

#### run `yarn build`

Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.
</s>

## Sign in

account : admin , password : admin

## Updated （2021/10/09）

1.重构 scripts 为 `packages/electron-app-build` ,目前支持的 builder 有 `esbuild` （esbuild 永远滴神，太快了）

2.项目结构改为 monorepo，引入了 lerna & yarn workspace 用于 packages 管理
