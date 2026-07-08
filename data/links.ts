// 링크 타입 정의 (PRD 5.1 기준)
export interface Link {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Google Favicon API를 사용하여 파비콘 URL을 생성합니다.
 * PRD F-04: 별도로 파비콘 URL을 DB에 저장하지 않고, 클라이언트에서 도메인 기반으로 동적 생성
 * @see https://www.google.com/s2/favicons?domain={도메인}&sz=64
 */
export function getFaviconUrl(url: string, size: number = 64): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    return "";
  }
}

// 더미 데이터 (개발용)
export const dummyLinks: Link[] = [
  {
    id: "link-1",
    title: "인스타그램",
    url: "https://www.instagram.com/mylink_official",
    createdAt: new Date("2026-06-01T09:00:00"),
  },
  {
    id: "link-2",
    title: "유튜브",
    url: "https://www.youtube.com/@mylink_channel",
    createdAt: new Date("2026-06-05T14:30:00"),
  },
  {
    id: "link-3",
    title: "블로그",
    url: "https://blog.naver.com/mylink_blog",
    createdAt: new Date("2026-06-10T11:00:00"),
  },
  {
    id: "link-4",
    title: "GitHub",
    url: "https://github.com/mylink-dev",
    createdAt: new Date("2026-06-15T16:45:00"),
  },
  {
    id: "link-5",
    title: "포트폴리오",
    url: "https://mylink-portfolio.vercel.app",
    createdAt: new Date("2026-06-20T10:15:00"),
  },
];
