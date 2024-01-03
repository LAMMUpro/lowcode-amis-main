### 需要传入模块名, 驼峰命名会转为短横线命名
moduleName=$1
nest generate module ./modules/${moduleName}
nest generate controller ./modules/${moduleName}
nest generate service ./modules/${moduleName}