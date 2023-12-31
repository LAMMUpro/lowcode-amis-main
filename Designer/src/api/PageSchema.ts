
import { request } from "src/utils";
import { PageSchemaDtoCreate, PageSchemaDtoUpdate } from 'src/types/dto/PageSchema';
import defaultSchema from '@/schema/default.json';

/**
 * 添加一个页面schema
 */
export async function createPageSchema(params: PageSchemaDtoCreate) {
  return request('POST', '/api/page-schema', params);
}

/**
 * 删除某个页面schema
 */
export async function deletePageSchemaById(params: { nodeId: number }) {
  return request('DELETE', `/api/page-schema/${params.nodeId}`, {});
}

/**
 * 查找页面schema
 */
export async function findPageSchemaByNodeId(params: { nodeId: number }) {
  const res = await request('GET', `/api/page-schema/${params.nodeId}`, {});
  if (res.code == 1) {
    res.data.schema = res.data.schema ? JSON.parse(res.data.schema) : defaultSchema;
  }
  return res;
}

/**
 * 更新页面schema信息
 */
export async function updatePageSchemaById(params: { id: number } & PageSchemaDtoUpdate) {
  return request('PUT', `/api/page-schema/${params.id}`, params);
}
