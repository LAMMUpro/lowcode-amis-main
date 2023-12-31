import axios from 'axios';
import { host, env } from './index';

export function request(
  method: requestMethods = "GET",
  url: string,
  data: BaseObj<any> = {},
  options: {
    mode?: "no-cors" | "cors" | "same-origin"
    headers?: any
  } = {
    headers: {
      /** 将Content-Type设置成application/json会受到同源政策的限制。他会先发送一个option请求嗅探服务器是否具有应答的能力，然后才会发送真正的请求。 */
      'Content-Type':'application/json'
    }
  }
) {
  return amisRequest({
    url,
    method: method.toLowerCase(),
    data,
    headers: options.headers,
  }).then((response: any) => response.data);
}

export function amisRequest ({
  url: _url, // 接口地址
  method, // 请求方法 get、post、put、delete
  data, // 请求数据
  responseType,
  config, // 其他配置
  headers // 请求头
}: any) {
  /** url处理，加上pathname | 处理/api问题 */
  const url = host + (env === 'localhost' ? _url : _url.replace(/^\/api/, ''))
  config = config || {};
  config.withCredentials = true;
  responseType && (config.responseType = responseType);

  if (config.cancelExecutor) {
    config.cancelToken = new (axios as any).CancelToken(
      config.cancelExecutor
    );
  }

  config.headers = headers || {};

  if (method !== 'post' && method !== 'put' && method !== 'patch') {
    if (data) {
      config.params = data;
    }
    return (axios as any)[method](url, config);
  } else if (data && data instanceof FormData) {
    config.headers = config.headers || {};
    config.headers['Content-Type'] = 'multipart/form-data';
  } else if (
    data &&
    typeof data !== 'string' &&
    !(data instanceof Blob) &&
    !(data instanceof ArrayBuffer)
  ) {
    data = JSON.parse(JSON.stringify(data));
    config.headers = config.headers || {};
    config.headers['Content-Type'] = 'application/json';
  }
  
  return (axios as any)[method](url, data, config);
}