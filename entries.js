module.exports = {
  // root에서는 entries에서 dist 디렉터리의 root에 위치해야할 번들 이름을 적어준다.
  // 그렇지 않으면 번들 이름의 폴더로 이동하게 된다.
  'root': ['common', 'reset', 'main'],
  'entries': {
    // page로 구성을 하는 경우엔 요소가 하나더라도 배열로 만들어주세요. (html을 만드는 기준이 path 값이 배열인지 여부로 결정됨)
    'common': './src/js/common.js',
    'reset': './src/css/reset.scss',
    'sample': ['./src/pages/sample/index.js', './src/pages/sample/css.scss'],
    'main': ['./src/pages/index.js', './src/pages/style.scss'],
  }
};

