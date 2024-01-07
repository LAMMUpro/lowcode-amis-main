import { PageInfoQueryZod } from "src/types"
import { z } from "zod"

/**
 * 获取默认响应数据
 */
export function getDefaultResponse<T extends Array<BaseObj<any>> | BaseObj<any>>(data?: T) {
  return {
    success: true as const,
    data,
  }
}

/**
 * 获取默认失败响应数据
 */
export function getDefaultFailResponse(code: string = 'ERROR', msg: string = '', msgTimeout = 2000) {
  return {
    success: false as const,
    code,
    msg,
    msgTimeout,
  }
}

/**
 * 获取默认分页响应数据
 */
export function getDefaultPageResponse<T extends Array<BaseObj<any>>>(pageInfo: z.infer<typeof PageInfoQueryZod>, list: T, totalCount: number): ApiPageResponse<T[number]> {
  return {
    success: true as const,
    data: {
      currentPage: pageInfo.currentPage,
      pageSize: pageInfo.pageSize,
      totalCount,
      list,
    }
  }
}
