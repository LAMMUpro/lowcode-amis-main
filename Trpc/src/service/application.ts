import { prisma } from "../../prisma/prisma.service";
import { ApplicationCreateDto, ApplicationUpdateDto } from "../types/zodExt/Application";

export async function addApplication(data: ApplicationCreateDto) {
  return await prisma.$transaction(async (mysql) => {
    const res = await mysql.application.create({ data });
    if (!res.id) return;
    /** 
     * 应用默认版本1.0.0
     */
    const versionData = {
      applicationId: res.id,
      version: '1.0.0',
      isAuditing: false,
      isPass: false,
      auditContent: '',
      isDeleted: false
    };
    const res_version = await mysql.appVersion.create({ data: versionData});
    /** 
     * 应用默认环境test、pre、master
     */
    const envData = {
      applicationId: res.id,
      env: 'test',
      envCh: '测试',
      canDelete: false,
      appVersionId: res_version.id,
      version: '1.0.0',
      isDeleted: false
    };
    await mysql.appEnv.create({ data: envData });
    envData.env = 'pre';
    envData.envCh = '预发';
    await mysql.appEnv.create({ data: envData });
    envData.env = 'master';
    envData.envCh = '正式';
    envData.appVersionId = 0; // 正式环境不绑定版本！
    envData.version = ''; // 正式环境须审核通过才能绑定！
    await mysql.appEnv.create({ data: envData });
    const pageNode = {
      name: 'root',
      nameCh: '根节点',
      describe: '根节点, 有且唯一',
      applicationId: res.id,
      version: '1.0.0'
    };
    return await mysql.pageNode.create({
      data: pageNode
    });
  })
}

export async function deleteApplicationById(id: number) {
  const res = await prisma.application.update({
    where: { id },
    data: {
      isDeleted: true
    }
  })
  console.log(res);
  return res;
}

export async function getApplicationList() {
  return await prisma.application.findMany({
    where: {
      isDeleted: false,
    }
  })
}

export async function getPageList() {
  return await prisma.application.findMany({
    where: {
      isDeleted: false,
    }
  })
}

export async function updateApplicationById(data: ApplicationUpdateDto) {
  return await prisma.application.update({
    where: {
      id: data.id
    },
    data: {
      name: data.name,
      describe: data.describe
    }
  })
}