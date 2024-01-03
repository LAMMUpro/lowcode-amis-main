import * as chokidar from 'chokidar';
import * as child_process from 'child_process';

console.log("持续监控schema.prisma, 执行代码生成命令");

const { exec, spawn } = child_process;

/** 命令是否正在执行中 */
let isRunning = false;

chokidar.watch('./prisma/schema.prisma').on('all', throttle((event, path) => {
  if (event === 'change' && path==='prisma/schema.prisma') {
    if (isRunning) return console.log('正在运行中!');
    /** 格式化schema.prisma!!! */
    exec('yarn formatSchema');
    isRunning = true;
    console.log('>>> 代码重新生成: ', new Date());
    _migrate_();
    exec('yarn build');
    console.log(">>> yarn build执行成功");
    exec('yarn generate');
    console.log(">>> yarn generate执行成功");
    exec('yarn generate:dto');
    console.log(">>> yarn generate:dto执行成功");
    exec('yarn generate:controller');
    console.log(">>> yarn generate:controller执行成功");
    exec('yarn generate:api');
    console.log(">>> yarn generate:api执行成功");
  }
}, 500));

/** 交互式执行yarn migrate */
function _migrate_() {
  const shell2migrate = spawn('yarn', ['migrate']);
  shell2migrate.stdout.on('data', (data: Buffer)=>{
    const context = data.toString();
    if (context.includes('Enter a name for the new migration')) {
      /** 输入, 回车确定 */
      shell2migrate.stdin.write(`${new Date().getTime()}\n`);
      shell2migrate.stdin.end();
    }
  })
  shell2migrate.stderr.on('close', ()=>{
    console.log(">>> yarn migrate执行失败!!![结束]");
    isRunning = false;
  })
  shell2migrate.stdout.on('close', (code)=>{
    console.log(">>> yarn migrate执行成功[结束]");
    isRunning = false;
  })
}

/**
 * 节流函数
 * @param fn 执行函数
 * @param delay 延时（ms）
 */
function throttle(fn: Function, delay: number = 500) {
  let currentTime = Date.now();
  return function (this:any, ...args: Array<any>) {
    const context = this;
    const nowTime = Date.now();
    if (nowTime - currentTime > delay) {
      fn.apply(context, args);
      currentTime = Date.now();
    }
  }
}