export const LANGS = ['ko', 'en'] as const;
export type Lang = (typeof LANGS)[number];

/** A string shared by both languages, or a per-language pair. */
export type Text = string | { ko?: string; en?: string };
export type TextList = string[] | { ko?: string[]; en?: string[] };

/** Pick the text for `lang`, falling back to the other language. */
export function tx(value: Text | undefined, lang: Lang): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.ko ?? value.en ?? '';
}

export function txList(value: TextList | undefined, lang: Lang): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  return value[lang] ?? value.ko ?? value.en ?? [];
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Internal link for a page, e.g. href('en', '/research') → '/en/research/'. */
export function href(lang: Lang, path = '/'): string {
  const clean = path.replace(/^\/|\/$/g, '');
  const prefix = lang === 'en' ? '/en' : '';
  return `${BASE}${prefix}/${clean ? clean + '/' : ''}`;
}

/** URL of a file under public/images/. */
export function img(path: string): string {
  return `${BASE}/images/${path.replace(/^\//, '')}`;
}

/** URL of any file under public/. */
export function asset(path: string): string {
  return `${BASE}/${path.replace(/^\//, '')}`;
}

/** The same page in the other language. */
export function switchLang(pathname: string, to: Lang): string {
  let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  p = p.replace(/^\/en(\/|$)/, '/');
  return href(to, p);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-09-07' | '2026-09' | '2026' → '2026.09.07' (ko) / 'Sep 7, 2026' (en). */
export function formatDate(date: string, lang: Lang): string {
  const [y, m, d] = date.split('-');
  if (lang === 'ko') return [y, m, d].filter(Boolean).join('.');
  if (!m) return y;
  const mon = MONTHS[Number(m) - 1];
  return d ? `${mon} ${Number(d)}, ${y}` : `${mon} ${y}`;
}

export const ui = {
  ko: {
    'nav.home': '홈',
    'nav.research': '연구',
    'nav.publications': '논문',
    'nav.people': '구성원',
    'nav.news': '소식',
    'nav.join': '모집',
    'nav.teaching': '강의',
    'nav.contact': '연락처',
    'lang.switch': 'English',
    'menu': '메뉴',
    'home.research': '연구 분야',
    'home.news': '최근 소식',
    'home.allNews': '전체 소식',
    'home.selected': '대표 논문',
    'home.allPubs': '전체 논문',
    'home.partners': '연구 지원 기관',
    'home.explore': '연구 둘러보기',
    'home.joinTitle': '함께 연구할 학생을 찾습니다',
    'home.joinBody': '로봇을 직접 설계하고, 만들고, 실험해보고 싶은 학생이라면 언제든 연락 주세요.',
    'home.joinCta': '모집 안내 보기',
    'more': '자세히',
    'research.title': '연구',
    'research.lead': '자기장, 소프트 소재, 기계설계, 기계학습을 결합해 최소침습 의료를 위한 무선 로봇을 연구합니다.',
    'research.related': '관련 논문',
    'research.morePubs': '관련 논문 모두 보기',
    'research.projects': '연구과제',
    'research.active': '진행 중',
    'research.past': '종료',
    'research.confidential': '산학협력 과제',
    'pubs.title': '논문 · 특허',
    'pubs.lead': '전체 목록은 Google Scholar에서도 확인할 수 있습니다.',
    'pubs.scholar': 'Google Scholar',
    'pubs.all': '전체',
    'pubs.journal': '저널',
    'pubs.conference': '학회',
    'pubs.patent': '특허',
    'pubs.other': '기타',
    'pubs.preprint': '프리프린트',
    'pubs.thesis': '학위논문',
    'pubs.paper': '논문',
    'pubs.view': '원문',
    'pubs.video': '영상',
    'pubs.count': '편',
    'people.title': '구성원',
    'people.pi': '지도교수',
    'people.members': '대학원생',
    'people.undergrads': '학부연구생',
    'people.alumni': '졸업생',
    'people.career': '약력',
    'people.awards': '수상',
    'people.interests': '연구 관심사',
    'people.topics': '연구 주제',
    'people.cv': 'CV',
    'people.now': '현재',
    'news.title': '소식',
    'news.lead': '연구실의 논문, 수상, 학회, 그리고 연구실 생활 이야기입니다.',
    'news.talks': '초청강연',
    'news.media': '언론 보도',
    'join.title': '학생 모집',
    'join.open': '모집 중',
    'join.closed': '상시 문의 가능',
    'join.closedBody': '현재 정기 모집은 없지만, 관심 있는 학생은 언제든 이메일로 연락 주세요.',
    'join.deadline': '지원 마감',
    'join.positions': '모집 대상',
    'join.topics': '연구 주제',
    'join.lookingFor': '이런 학생을 찾습니다',
    'join.youGet': '합류하면 이런 경험을 합니다',
    'join.apply': '지원 방법',
    'join.email': '이메일로 지원하기',
    'join.alumni': '졸업생 진로',
    'teaching.title': '강의',
    'teaching.undergraduate': '학부',
    'teaching.graduate': '대학원',
    'contact.title': '연락처',
    'contact.email': '이메일',
    'contact.office': '연구실',
    'contact.address': '주소',
    'contact.map': '지도에서 보기',
    'footer.updated': '최종 업데이트',
    'video.play': '영상 재생',
    'close': '닫기',
    'tag.paper': '논문',
    'tag.award': '수상',
    'tag.grant': '과제',
    'tag.collab': '공동연구',
    'tag.conference': '학회',
    'tag.talk': '강연',
    'tag.people': '구성원',
    'tag.media': '대외',
    'tag.lab': '연구실',
    'role.phd': '박사과정',
    'role.ms': '석사과정',
    'role.integrated': '석박통합과정',
    'role.grad': '대학원생',
    'role.undergrad': '학부연구생',
    'role.staff': '연구원',
    'degree.phd': '박사',
    'degree.ms': '석사',
    'degree.undergrad': '학부연구생',
  },
  en: {
    'nav.home': 'Home',
    'nav.research': 'Research',
    'nav.publications': 'Publications',
    'nav.people': 'People',
    'nav.news': 'News',
    'nav.join': 'Join Us',
    'nav.teaching': 'Teaching',
    'nav.contact': 'Contact',
    'lang.switch': '한국어',
    'menu': 'Menu',
    'home.research': 'Research',
    'home.news': 'Latest news',
    'home.allNews': 'All news',
    'home.selected': 'Selected publications',
    'home.allPubs': 'All publications',
    'home.partners': 'Supported by',
    'home.explore': 'Explore our research',
    'home.joinTitle': "We're looking for students",
    'home.joinBody': 'If you want to design, build and test robots yourself, get in touch.',
    'home.joinCta': 'How to join',
    'more': 'More',
    'research.title': 'Research',
    'research.lead': 'We combine magnetics, soft materials, mechanical design and machine learning to build wireless robots for minimally invasive medicine.',
    'research.related': 'Related publications',
    'research.morePubs': 'See all publications',
    'research.projects': 'Research projects',
    'research.active': 'Active',
    'research.past': 'Completed',
    'research.confidential': 'Industry-sponsored project',
    'pubs.title': 'Publications',
    'pubs.lead': 'The full list is also available on Google Scholar.',
    'pubs.scholar': 'Google Scholar',
    'pubs.all': 'All',
    'pubs.journal': 'Journal',
    'pubs.conference': 'Conference',
    'pubs.patent': 'Patent',
    'pubs.other': 'Other',
    'pubs.preprint': 'Preprint',
    'pubs.thesis': 'Thesis',
    'pubs.paper': 'Paper',
    'pubs.view': 'View',
    'pubs.video': 'Video',
    'pubs.count': '',
    'people.title': 'People',
    'people.pi': 'Principal Investigator',
    'people.members': 'Graduate Students',
    'people.undergrads': 'Undergraduate Researchers',
    'people.alumni': 'Alumni',
    'people.career': 'Career',
    'people.awards': 'Awards',
    'people.interests': 'Research interests',
    'people.topics': 'Research topics',
    'people.cv': 'CV',
    'people.now': 'Now',
    'news.title': 'News',
    'news.lead': 'Papers, awards, conferences — and life in the lab.',
    'news.talks': 'Invited talks',
    'news.media': 'Media coverage',
    'join.title': 'Join Us',
    'join.open': 'Now recruiting',
    'join.closed': 'Inquiries welcome',
    'join.closedBody': "We don't have an open call right now, but interested students are always welcome to email us.",
    'join.deadline': 'Deadline',
    'join.positions': 'Positions',
    'join.topics': 'Research topics',
    'join.lookingFor': "Who we're looking for",
    'join.youGet': "What you'll get",
    'join.apply': 'How to apply',
    'join.email': 'Apply by email',
    'join.alumni': 'Where our alumni went',
    'teaching.title': 'Teaching',
    'teaching.undergraduate': 'Undergraduate',
    'teaching.graduate': 'Graduate',
    'contact.title': 'Contact',
    'contact.email': 'Email',
    'contact.office': 'Office',
    'contact.address': 'Address',
    'contact.map': 'Open in map',
    'footer.updated': 'Last updated',
    'video.play': 'Play video',
    'close': 'Close',
    'tag.paper': 'Paper',
    'tag.award': 'Award',
    'tag.grant': 'Grant',
    'tag.collab': 'Collaboration',
    'tag.conference': 'Conference',
    'tag.talk': 'Talk',
    'tag.people': 'People',
    'tag.media': 'Outreach',
    'tag.lab': 'Lab life',
    'role.phd': 'Ph.D. Student',
    'role.ms': 'M.S. Student',
    'role.integrated': 'Integrated M.S./Ph.D. Student',
    'role.grad': 'Graduate Student',
    'role.undergrad': 'Undergraduate Researcher',
    'role.staff': 'Researcher',
    'degree.phd': 'Ph.D.',
    'degree.ms': 'M.S.',
    'degree.undergrad': 'Undergrad. Researcher',
  },
} as const;

export type UIKey = keyof (typeof ui)['ko'];

export function t(lang: Lang, key: UIKey): string {
  return ui[lang][key] ?? ui.ko[key];
}
