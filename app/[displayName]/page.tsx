"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { usePublicProfile } from "@/hooks/use-profile";
import { useLinks } from "@/hooks/use-links";

interface UserProfile {
  username: string;
  bio: string;
  photoURL: string;
}

interface UserLink {
  id: string;
  title: string;
  url: string;
}

export default function PublicProfilePage() {
  const params = useParams();
  const displayName = params.displayName as string;

  const { data: publicData, isLoading: isProfileLoading, isError } = usePublicProfile(displayName);
  const userId = publicData?.userId;
  const profile = publicData?.profile;

  const { data: links = [], isLoading: isLinksLoading } = useLinks(userId);

  const loading = isProfileLoading || (userId && isLinksLoading);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col h-screen items-center justify-center text-center p-4">
        <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground mb-8">요청하신 프로필 페이지가 존재하지 않습니다.</p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="mx-auto max-w-2xl flex flex-col items-center">
        
        {/* 프로필 정보 */}
        <div className="flex flex-col items-center text-center mb-10 w-full">
          <Avatar className="h-28 w-28 mb-4 shadow-sm border-2 border-background">
            <AvatarImage src={profile.photoURL || undefined} alt={profile.username || "User"} />
            <AvatarFallback className="text-3xl">{profile.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold font-heading mb-2">{profile.username || "이름 없는 사용자"}</h1>
          {profile.bio && (
            <p className="text-muted-foreground text-sm max-w-md whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}
        </div>

        {/* 링크 목록 */}
        <div className="w-full flex flex-col gap-4">
          {links.length > 0 ? (
            links.map((link) => {
              // URL에서 도메인 추출하여 파비콘 가져오기
              let domain = "";
              try {
                const url = new URL(link.url);
                domain = url.hostname;
              } catch (e) {
                // 잘못된 URL 무시
              }
              const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : "";

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center w-full p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:bg-muted/50 transition-colors duration-200"
                >
                  {faviconUrl && (
                    <img 
                      src={faviconUrl} 
                      alt="" 
                      className="absolute left-4 w-6 h-6 rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <span className="font-medium">{link.title}</span>
                </a>
              );
            })
          ) : (
            <div className="text-center py-10 border rounded-xl bg-muted/20 border-dashed text-muted-foreground">
              아직 등록된 링크가 없습니다.
            </div>
          )}
        </div>

        {/* 푸터 워터마크 */}
        <div className="mt-16 text-center">
          <Link href="/" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Powered by MyLink
          </Link>
        </div>
      </div>
    </div>
  );
}
