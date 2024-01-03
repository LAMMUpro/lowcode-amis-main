# shell/js脚本命令
> 直接在package.json执行的命令由于不同设备运行环境不一样, 可能会导致命令不存在
> 使用shell脚本可以统一执行命令

- `generate_module.sh` - 生成nest模块命令，包括module、controller、service
- `s_deploy.sh` - 部署前打包命令
- `watchPrismaSchema.ts` - 监控/prisma/schema.prisma文件，并实时生成代码
  
## 常用命令
> mac运行sh可能会有权限问题 `chmod u+x ./scripts/s_deploy.sh`

`rm -rf ../build` - 删除文件夹
`mv ./.env ../build/.env` - 移动文件
`cp ../.env ../build/.env` - 复制文件

