import { Prisma} from "@prisma/client";
import * as fs from 'fs';

/** api文件夹路径 */
const __dir = `${__dirname}/api`;
/** 如果存在, 删除prisma/api文件夹 */
if (fs.existsSync(__dir)) {
  fs.rmSync(__dir, { recursive: true });
}
/** 创建prisma/api文件夹 */
fs.mkdir(__dir, { recursive: true }, (err)=>{
  if (err) throw(err);
});

/** 解析后的模型(JSON格式) */
const models = Prisma.dmmf.datamodel.models;

models.forEach(model => {
  fs.writeFileSync(`${__dir}/${model.name}.ts`, `
import { request } from "src/utils";
import { ${model.name}DtoCreate, ${model.name}DtoUpdate } from 'src/types/dto/${model.name}';

/**
 * 添加一个${model.documentation}
 */
export async function create${model.name}(params: ${model.name}DtoCreate) {
  return request('POST', '/${upperCase2gan(model.name)}', params);
}

/**
 * 删除某个${model.documentation}
 */
export async function delete${model.name}ById(params: { id: number }) {
  return request('DELETE', \`/${upperCase2gan(model.name)}/\${params.id}\`, {});
}

/**
 * 查找全部${model.documentation}
 */
export async function findAll${model.name}() {
  return request('GET', \`/${upperCase2gan(model.name)}\`, {});
}

/**
 * 更新${model.documentation}信息
 */
export async function update${model.name}ById(params: { id: number } & ${model.name}DtoUpdate) {
  return request('PUT', \`/${upperCase2gan(model.name)}/\${params.id}\`, params);
}
`
  );
})

/** 首字母小写 */
function first2lowerCase(name: string) {
  if (!name?.length) return name;
  return name[0].toLocaleLowerCase() + name.substring(1);
}

/** 驼峰转- */
function upperCase2gan(_name: string) {
  const name = first2lowerCase(_name);
  return name.replace(/([A-Z])/g, ($, $1, index)=>{
    return `-` + $1.toLocaleLowerCase();
  })
}