#!/usr/bin/env node
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { ConfigDto, ConfigZod } from './types';

// process.cwd()
// TODO 获取命令的参数, 处理不同的命令!

function main(config: ConfigDto) {
  /** 
   * 设置软链接
   */
  if (config.symlink) {
    for (let i = 0; i < config.symlink.length; i++) {
      const link = config.symlink[i];
      fse.ensureSymlinkSync(link.from, link.to);
    }
  }
  /** 
   * 设置硬链接
   */
}

try {
  console.log('>>> local-cli脚手架启动');
  const config = yaml.load(fs.readFileSync('./monorepo.yaml', 'utf8')) as ConfigDto;
  main(ConfigZod.parse(config));
  console.log('>>> local-cli脚手架结束');
} catch (e) {
  console.log(e);
}
