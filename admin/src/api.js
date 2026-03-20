export const API = "http://192.168.0.111:3000";

/** 创建带 token 的请求函数，在 App 里初始化后传给各组件 */
export const makeApi = (token) => async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });
  return res.json();
};
