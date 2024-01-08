import inquirer from 'inquirer';

/**
 * 命令行单选交互
 * @param msg 标题
 * @param options 选项
 * @param answer 答案
 */
export async function select<T extends string>(msg: string, options: { name: string, value: T }[], answer?: T): Promise<T> {
  let res = await inquirer.prompt({
    type: 'list',
    name: 'res',
    message: msg,
    choices: options,
    pageSize: 12
  }, { res: answer });
  return res.res;
}