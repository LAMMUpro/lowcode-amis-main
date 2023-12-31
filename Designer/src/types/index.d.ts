
interface BaseObj<T = string|number|boolean> {
  [key: string]: T
}

interface PageInfo {
  /** 每页数据 */
  pageSize: number
  /** 当前页，从1开始 */
  currentPage: number
  /** 后端返回总数字段 */
  totalCount?: number
}

/** 请求方法 */
type requestMethods = "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "OPTIONS";

type ApiResponse = {
  /** 1表示成功, -1表示失败 */
  code: 1 | -1
  /** 状态码, 0表示无异常, 其他为错误异常码 */
  status: 0 | number
  /** 信息 */
  msg: 'ok' | string
  /** 弹窗时间 */
  msgTimeout?: number
  /** 成功为json格式数据, 失败可能为null */
  data?: BaseObj<any>
}

/** 两个类型是否相等 */
type IsEqual<T, U> = 
  (<T1>() => T1 extends T ? 1 : 2) extends
  (<T2>() => T2 extends U ? 1 : 2)
    ? true
    : false