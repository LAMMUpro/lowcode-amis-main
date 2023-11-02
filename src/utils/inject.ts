
export function injectContext(options: {
  store: any
}) {
  return {
    /** 列表类型数据不能直接使用！ */
    store: options.store,
    auth: 'Lammu'
  };
} 

export function injectData(options: {
  store: any
  match?: any
  location?: any
}) {
  return {
    pathname: location.pathname,
    params: options.match?.params || {},
  };
} 