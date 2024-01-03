import { Prisma} from "@prisma/client";
import * as fs from 'fs';

/** controller文件夹路径 */
const __dir = `${__dirname}/controller`;
/** 如果存在, 删除prisma/controller文件夹 */
if (fs.existsSync(__dir)) {
  fs.rmSync(__dir, { recursive: true });
}
/** 创建prisma/controller文件夹 */
fs.mkdir(__dir, { recursive: true }, (err)=>{
  if (err) throw(err);
});

/** 解析后的模型(JSON格式) */
const models = Prisma.dmmf.datamodel.models;

models.forEach(model => {
  fs.writeFileSync(`${__dir}/${upperCase2gan(model.name)}.controller.ts`, `
import { PrismaService } from 'prisma/prisma.service';
import { Controller, Body, Param, Delete, Get, Post, Put } from '@nestjs/common';
import { getDefaultResponse } from 'src/utils/default';
import { ${model.name}DtoCreate, ${model.name}DtoUpdate } from 'src/types/dto/${model.name}';
import { filterUndefined } from 'src/utils';

@Controller('${upperCase2gan(model.name)}')
export class ${model.name}Controller {
  constructor(private readonly mysql: PrismaService) {}
  
  @Post()
  async create${model.name}(@Body() data: ${model.name}DtoCreate) {
    const response: ApiResponse = getDefaultResponse();
    await this.mysql.${first2lowerCase(model.name)}.create({ data });
    return response;
  }

  @Delete('/:id')
  async delete${model.name}(@Param('id') _id: string) {
    const response: ApiResponse = getDefaultResponse();
    const id = Number(_id);
    await this.mysql.${first2lowerCase(model.name)}.update({
      where: { id },
      data: { isDeleted: true }
    });
    return response;
  }

  @Get()
  async findAll${model.name}() {
    const response: ApiResponse = getDefaultResponse();
    const ${first2lowerCase(model.name)}List = await this.mysql.${first2lowerCase(model.name)}.findMany({
      where: {
        isDeleted: false
      }
    });
    response.data = ${first2lowerCase(model.name)}List;
    return response;
  }

  @Put('/:id')
  async update${model.name}(
    @Param('id') _id: string,
    @Body() data: ${model.name}DtoUpdate
  ) {
    const response: ApiResponse = getDefaultResponse();
    const id = Number(_id);
    delete (data as any).id;
    delete (data as any).isDeleted;
    await this.mysql.${first2lowerCase(model.name)}.update({
      where: {
        id
      },
      data: filterUndefined(data)
    })
    return response;
  }
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