// @ts-check
import { defineConfig } from 'astro/config';

// 배포 주소. GitHub Pages 설정이 바뀌면 SITE_URL / BASE_PATH 만 수정하면 됩니다.
//  - https://<계정>.github.io            → BASE_PATH '/'
//  - https://<계정>.github.io/<저장소>   → BASE_PATH '/<저장소>'
//  - 개인 도메인(예: https://mprl.pusan.ac.kr) → BASE_PATH '/'
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://mprl-pnu.github.io',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});
