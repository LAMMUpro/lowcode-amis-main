import { z } from "zod";

/** 
 * 获取响应Zod对象
 */
export function ApiResponseZod<T extends z.ZodArray<z.AnyZodObject> | z.AnyZodObject>(data?: T) {
  return z.object({
    /** 请求是否成功 */
    success: z.literal(false),
    /** 状态码, 不同状态码代表不同含义 */
    code: z.string(),
    /** 错误信息 */
    msg: z.string(),
    /** 弹窗时间 */
    msgTimeout: z.number().optional(),
  }).or(z.object({
    /** 请求是否成功 */
    success: z.literal(true),
    /** 数据 */
    data: data ? data : z.literal(void 0),
  }))
}

/**
 * 获取分页查询Zod对象
 */
export const PageInfoQueryZod = z.object({
  currentPage: z.number(),
  pageSize: z.number(),
})

/**
 * 获取分页响应Zod对象
 */
export function PageInfoZod<T extends z.AnyZodObject>(item: T) {
  return z.object({
    currentPage: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    list: z.array(item),
  })
}

/** 
 * 获取分页响应Zod对象
 */
export function ApiPageResponseZod<T extends z.AnyZodObject>(listItem: T) {
  return ApiResponseZod(PageInfoZod(listItem));
}