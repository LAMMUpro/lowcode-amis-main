#!/usr/bin/env node
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { ConfigDto, ConfigZod } from './types';
import { select } from './utils';

/**
 * 设置monorepo.yaml的配置
 */
function setMonorepoYamlConfig(config: ConfigDto) {
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
  // TODO
}

/** 设置monorepo.yaml中的配置 */
function markMonorepoYamlEffect() {
  try {
    const config = yaml.load(fs.readFileSync('./monorepo.yaml', 'utf8')) as ConfigDto;
    setMonorepoYamlConfig(ConfigZod.parse(config));
  } catch (e) {
    console.log(e);
  }
}

function main() {
  console.log('>>> 欢迎使用local-cli脚手架');
  const options = [
    { name: '设置monorepo.yaml', value: '1', handler: markMonorepoYamlEffect },
    { name: '启动项目', value: '2', handler: async () => {} },
  ];
  select('请选择要执行的操作', options).then(async value=>{
    options.find(item => item.value === value)?.handler();
  })
}

main();