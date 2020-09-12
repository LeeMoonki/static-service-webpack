import { go, isUndefined, reduce, map, isArray } from './fx';

const html = (strs, ...vals) => {
  return go(
    vals,
    map(v => isArray(v) ? v.join('') : isUndefined(v) ? '' : v),
    (vals, i=0) => reduce((res, str) => `${res}${vals[i++]}${str}`, strs));
};

export default html;
