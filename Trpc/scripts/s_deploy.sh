### s deploy部署前重新打包脚本
### node版本：16.18.0以上
### 依赖第三方：yarn\ncc\s

# 重新生成一下prisma代码
yarn generate
# 删除编译后产物
rm -rf ../build
# 代码打包(需要下载ncc到全局)
yarn ncc
# 移动prisma二进制文件
mv ../build/client/libquery_engine-debian-openssl-1.1.x.so.node ../build/libquery_engine-debian-openssl-1.0.x.so.node
# 删除多余文件夹
rm -rf ../build/client
# 将.env移动到build
cp ../.env ../build/.env
# 将.fcignore移动到build
cp ../.fcignore ../build/.fcignore