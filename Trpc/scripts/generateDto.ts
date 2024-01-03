import { Prisma} from "@prisma/client";
import * as fs from 'fs';
import * as path from 'path';
import { generateApiProperty } from "../src/utils";

/** dto文件夹路径 */
const __dir = path.resolve(__dirname, `../src/types/dto`);
/** 如果存在, 删除prisma/dto文件夹 */
if (fs.existsSync(__dir)) {
  fs.rmSync(__dir, { recursive: true });
}
/** 创建prisma/dto文件夹 */
fs.mkdir(__dir, { recursive: true }, (err)=>{
  if (err) throw(err);
});

/** 解析后的模型(JSON格式) */
const models = Prisma.dmmf.datamodel.models;

/** 可以指定生成某个文件的 */
// models.filter(model=>['Application',].includes(model.name)). // 列表
models.filter(model=>model.name!==''). // 全部
forEach(model => {

  fs.writeFileSync(`${__dir}/${model.name}.ts`, `
import { ApiProperty } from "@nestjs/swagger";
import { ${model.name}, Prisma} from "@prisma/client";
import { model2ApiPropertyInit } from "src/utils";

/** 文件名=模块名, 需和Prisma model保持一致 */
const modelName = __filename.match(/([^\\/\\\\]+?)(?:\.[^\.\\/]*)?$/)?.[1];
/** 解析后的模型(JSON格式) */
const model = Prisma.dmmf.datamodel.models.find(item=>item.name==modelName);
/** 模型转swagger @ApiProperty 函数 */
const model2ApiProperty = model2ApiPropertyInit(model);

/** ${model.documentation??''} */
export type ${model.name}Dto = ${model.name};

/** 新增${model.documentation??model.name} */
export class ${model.name}DtoCreate implements Omit<${model.name}, ${model.fields.filter(field=>field.default!==undefined).map(field=>`'${field.name}'`).join('|')}> {
  ${generateApiProperty(model.fields, 'create', model.name)}
}

/** 删除${model.documentation??model.name} */
export class ${model.name}DtoDelete implements Pick<${model.name}, 'id'> {
  ${generateApiProperty(model.fields, 'delete', model.name)}
}

/** 查单个${model.documentation??model.name} */
export class ${model.name}DtoFindUnique implements Pick<${model.name}, 'id'> {
  ${generateApiProperty(model.fields, 'find', model.name)}
}

/** 查全部${model.documentation??model.name} */
export class ${model.name}DtoFindAll {
  
}

/** 查分页${model.documentation??model.name} */
export class ${model.name}DtoFindBatch implements PageInfo {
  @ApiProperty({default: 10,description: '每页数据',type: Number,required: true})
  pageSize!: number;

  @ApiProperty({default: 1,description: '当前页,从1开始',type: Number,required: true})
  currentPage!: number;

  @ApiProperty({default: 0,description: '总数(后端返回)',type: Number,required: false})
  totalCount?: number;
}

/** 更新${model.documentation??model.name} */
export class ${model.name}DtoUpdate {
  ${generateApiProperty(model.fields, 'update', model.name)}
}
`
  );
})
