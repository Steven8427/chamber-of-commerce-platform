export const API = "http://192.168.0.111:3000";

export const fetchJSON = (path) =>
  fetch(`${API}${path}`).then(r => r.json());