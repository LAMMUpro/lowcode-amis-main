本项目前后端一体, 适用monorepo管理方式
> [amis低代码官网](https://baidu.github.io/amis/zh-CN/docs/index)
> 项目使用node18.3.0(兼容阿里serveless)+pnpm(兼容windows)
## 目录结构
designer - 低代码编辑器
admin - 成品后台
trpc - 后端

## designer编辑器
> 

## admin渲染器

## nest后端

## 打包
- tsc ✅
- ncc ❎ (trpc是module, prisma是commonjs不兼容)
- webpack 待验证

## 部署
> docker部署
tsc编译后上传

> serveless部署
打包用?
