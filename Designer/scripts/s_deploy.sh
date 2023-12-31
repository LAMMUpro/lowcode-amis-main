### s deploy部署前重新打包脚本
### node版本：16.18.0以上
### 依赖第三方：yarn\ncc\s

# 删除编译后产物
rm -rf ../dist
# 代码打包(需要下载ncc到全局)
yarn build
# 将nginx移动到build下
cp ../nginx.conf ../dist/nginx.conf
# 将.fcignore移动到build
cp ../.fcignore ../dist/.fcignore