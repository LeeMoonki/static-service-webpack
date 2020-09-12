export const obj_to_qs = obj => go(
  obj,
  L.entries,
  L.filter(([k, v]) => k && v),
  map(([k, v]) => `${k}=${v}`),
  match.case({ length: 0 })(() => '').else(arr => `?${arr.join('&')}`));
