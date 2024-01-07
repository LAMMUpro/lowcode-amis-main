/** 基础对象 */
interface BaseObj<T = string|number|boolean> {
  [key: string]: T
}

/** 分页信息 */
interface PageInfo {
  /** 每页数据 */
  pageSize: number
  /** 当前页，从1开始 */
  currentPage: number
  /** 后端返回总数字段 */
  totalCount?: number
}

/** API响应 */
type ApiResponse<T extends Array<BaseObj<any>> | BaseObj<any>> = {
  /** 是否成功 */
  success: false
  /** 状态码, 不同状态码代表不同含义 */
  code: string
  /** 错误信息 */
  msg: string
  /** 弹窗时间 */
  msgTimeout?: number
} | {
  /** 是否成功 */
  success: true
  /** 成功为json[] 或者 json格式数据 */
  data: T
}

/** API响应(分页数据) */
type ApiPageResponse<T extends BaseObj<any>> = ApiResponse<Required<PageInfo> & {
  /** 分页数据 */
  list: Array<T>
}>;