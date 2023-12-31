

export * from './request';

let _env: 'test'|'dev'|'master'|'localhost' = 'localhost';

if (location.hostname.includes('test.lammu.cn')) {
  _env = 'test';
} else if (location.hostname.includes('dev.lammu.cn')) {
  _env = 'dev';
} else if (location.hostname.includes('lammu.cn')) {
  _env = 'master';
}

export const env = _env;

export const host = {
  'localhost': '', // 本地做了代理！
  'test': 'https://amisbase.test.nodeservice.cn',
  'dev': 'https://amisbase.dev.nodeservice.cn',
  'master': 'https://amisbase.nodeservice.cn',
}[env];

/**
 * json转url查询参数
 */
 export function json2query(json: BaseObj) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined)
      return ''
    return encodeURIComponent(key) +
    '=' + encodeURIComponent(json[key])
  })).join('&')
}
function cleanArray(actual: string[]) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * 打开链接
 */
export function openLink(link: string, target:'_blank'|'_self'|'_parent'|'_top' = "_blank") {
  const label = document.createElement("a");
  label.href = link;
  label.target = target;
  document.body.appendChild(label);
  label.click();
  document.body.removeChild(label);
}

/**
 * 从树中寻找节点
 */
export function findNode(treeList: any, fn: (node: any)=>boolean): any {
  for (let index = 0; index < treeList.length; index++) {
    const node = treeList[index];
    if (fn(node)) return node;
    if (node.children?.length) {
      const result = findNode(node.children, fn);
      if (result) return result;
    }
  }
}