# MPRL 연구실 홈페이지

부산대학교 기계공학부 다중물리 로보틱스 연구실(MPRL) 홈페이지입니다.
[Astro](https://astro.build)로 만든 정적 사이트이며, GitHub에 올리면 자동으로 배포됩니다.

> **핵심 원칙: 내용은 `src/data/` 폴더의 YAML 파일에만 적습니다.**
> 한 곳에 적으면 홈·소식·연구·구성원 페이지와 한국어/영어 페이지에 모두 자동 반영됩니다.

---

## 1. 무엇을 어디서 고치나요?

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 뉴스·사진(갤러리) 추가 | `src/data/news.yaml` |
| 논문·특허 추가, 대표 논문 지정 | `src/data/publications.yaml` |
| 구성원 추가/졸업 처리 | `src/data/people.yaml` |
| 학생 모집 중/마감, 마감일 | `src/data/site.yaml` → `recruiting` |
| 연구과제 추가 | `src/data/projects.yaml` |
| 연구 분야 설명 | `src/data/research.yaml` |
| 초청강연·언론보도 | `src/data/talks.yaml` |
| 강의 | `src/data/courses.yaml` |
| 모집 페이지 문구 | `src/data/join.yaml` |
| 연구실 소개 문구, 연락처 | `src/data/site.yaml` |
| 사진 파일 | `public/images/` (news, people, research 폴더) |

**`ko:` / `en:`** 두 줄을 함께 적으면 언어별로 다르게 나오고, 한 줄만 적으면 두 언어 모두 그 문구가 나옵니다.

---

## 2. 자주 하는 작업 (GitHub 웹사이트에서 바로 수정)

GitHub 저장소에서 파일을 열고 연필 아이콘(✏️ Edit)을 눌러 수정한 뒤 **Commit changes**를 누르면
1~2분 뒤 사이트에 반영됩니다. (진행 상황은 저장소의 **Actions** 탭에서 확인)

### 뉴스 추가 — `src/data/news.yaml` 맨 위에 붙여넣기

```yaml
- date: 2026-10-15
  tag: paper
  ko: 홍길동 군의 "논문 제목" 논문이 Science Robotics에 게재되었습니다. 축하합니다!
  en: Our paper "Paper title" has been published in Science Robotics.
  link: https://doi.org/...
  images: [news/2026-10-15-paper.jpg]
```

- `tag`: `paper`(논문) `award`(수상) `grant`(과제) `collab`(공동연구) `conference`(학회) `talk`(강연) `people`(입학·졸업) `media`(언론·대외) `lab`(연구실 생활)
- 날짜를 정확히 모르면 `2026-10` 또는 `2026`처럼 적어도 됩니다.
- `link`, `images`, `en`은 생략 가능합니다.

### 사진 올리기

1. GitHub에서 `public/images/news/` 폴더로 이동 → **Add file → Upload files**
2. 파일 이름은 영문·숫자·하이픈만 사용 (예: `2026-10-15-kroc-1.jpg`), 가로 1600px 이하 권장
3. 뉴스 항목에 `images: [news/2026-10-15-kroc-1.jpg, news/2026-10-15-kroc-2.jpg]` 처럼 적기

### 논문 추가 — `src/data/publications.yaml` 위쪽에 붙여넣기

```yaml
- title: 논문 제목
  authors: Gildong Hong, Donghoon Son
  venue: Science Robotics
  details: 11(98), eabc1234
  year: 2026
  type: journal          # journal | conference | preprint | thesis | patent
  link: https://doi.org/...
  video: YouTube영상ID    # 선택
  thrusts: [magnetic, medical]   # 선택: magnetic | medical | soft | design
  selected: true         # 선택: 홈 화면 '대표 논문'에 표시
```

`thrusts`를 적으면 연구(Research) 페이지의 해당 분야 아래 "관련 논문"에 자동으로 나타납니다.

### 학생 모집 열기/닫기 — `src/data/site.yaml`

```yaml
recruiting:
  open: true             # false 로 바꾸면 "상시 문의 가능"으로 표시
  deadline: 2026-12-31   # 선택. 날짜가 지나면 자동으로 숨겨집니다
```

### 구성원 졸업 처리 — `src/data/people.yaml`

`members`에서 해당 학생 블록을 지우고 `alumni`에 추가합니다.

```yaml
  - name: Gil-* Hong
    degree: ms        # ms | phd | undergrad
    year: 2026
    now: Samsung Electronics
```

### 연구과제 — `src/data/projects.yaml`

`end`(종료 연월)가 지나면 자동으로 "종료" 목록으로 이동합니다. 사이트는 매주 월요일 자동으로 다시 빌드되어 날짜가 반영됩니다.
과제명을 공개하기 어려우면 `confidential: true`로 두면 "산학협력 과제"로만 표시됩니다.

---

## 3. 수정했는데 사이트가 안 바뀌면

저장소의 **Actions** 탭에서 빨간 ✗가 있는지 확인하세요. 클릭하면 어느 파일 몇 번째 항목이 잘못됐는지 한국어로 나옵니다.

```
[src/data/news.yaml] 형식 오류
  • 3번째 항목 › tag: tag는 paper | award | ... 중 하나여야 합니다
```

흔한 실수:
- 들여쓰기(스페이스) 칸 수가 위 항목과 다름 — **탭 대신 스페이스**를 사용하세요
- 콜론(`:`)이 들어간 문장은 따옴표로 감싸기: `title: "Robots: a review"`
- 사진 파일 이름 오타 (이 경우 빌드는 되지만 사진만 빠지고, 로그에 `[이미지 없음]` 경고가 나옵니다)

---

## 4. 내 컴퓨터에서 미리보기 (선택)

Node.js 22 이상이 필요합니다.

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:4321 을 열면 수정 내용이 즉시 반영됩니다. `npm run build`로 배포 전 검사를 할 수 있습니다.

---

## 5. 최초 배포 설정 (한 번만)

1. GitHub에 저장소를 만들고 이 폴더를 push 합니다.
   - 저장소 이름을 `<계정명>.github.io`로 하면 주소가 `https://<계정명>.github.io/`가 됩니다.
   - 다른 이름이면 `https://<계정명>.github.io/<저장소명>/`이 됩니다. (경로는 자동으로 맞춰집니다)
2. 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택합니다.
3. `main` 브랜치에 push 하면 자동 배포됩니다.
4. (선택) 학교 도메인(예: `mprl.pusan.ac.kr`)을 쓰려면 Settings → Pages → Custom domain에 입력하고, 학교 전산팀에 CNAME 레코드(`<계정명>.github.io`)를 요청합니다.

---

## 폴더 구조

```
src/data/        ← 내용 (여기만 수정)
public/images/   ← 사진
src/views/       ← 페이지 레이아웃 (한/영 공용)
src/components/  ← 뉴스·논문·인물 카드 등 부품
src/lib/         ← 데이터 검사, 한/영 문구(i18n.ts)
src/pages/       ← 주소 정의 (/, /en/ …)
```
