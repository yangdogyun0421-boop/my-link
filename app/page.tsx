import { LinksManager } from "@/components/profile/links-manager"

export default function Page() {
  return (
    <div className="flex min-h-svh items-start justify-center bg-background px-4 py-12 sm:py-16">
      <main className="w-full max-w-md">
        {/* 프로필 영역 (목업) */}
        <section
          id="profile-section"
          className="mb-8 flex flex-col items-center gap-2 text-center"
        >
          {/* 프로필 이미지 (목업 아바타) */}
          <div className="flex size-20 items-center justify-center rounded-full bg-muted text-3xl ring-2 ring-border">
            🧑
          </div>
          <h1 className="font-heading text-xl font-bold tracking-tight">
            양도균
          </h1>
          <p className="max-w-xs text-sm text-muted-foreground">
            안녕하세요! 다양한 링크를 한 곳에 모아두었습니다.
          </p>
        </section>

        {/* 링크 목록 (Firestore 연동) */}
        <section id="links-section" className="w-full">
          <LinksManager />
        </section>

        {/* 푸터 (와이어프레임 Section 4) */}
        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Powered by MyLink
        </footer>
      </main>
    </div>
  )
}
