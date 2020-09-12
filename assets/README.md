# 배포 README  
다음 사항을 주의해주세요.  
1. 수정사항이 있다면 `dist`에 배포된 파일의 이름을 조금 바꿔주세요. (browser caching)
2. `/pages`에 있던 `js` 파일과 `css` 파일은 모두 `dist/js`와 `dist/css` 위치에 번들링 됩니다.  
  `/pages/[page name]`에 있던 모든 파일들은 `dist/[page name]`에 번들링 됩니다.
3. `*.html`에서 파일을 가져올 땐 모두 상대 경로를 사용합니다.