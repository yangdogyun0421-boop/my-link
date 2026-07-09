"use client"

import Image from "next/image"
import Link from "next/link"
import { LinksManager } from "@/components/profile/links-manager"
import { useAuth } from "@/components/auth/auth-provider"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { toast } from "sonner"
import { InlineProfileEditor } from "@/components/profile/inline-profile-editor"

export default function Home() {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-start justify-center bg-background px-4 py-12 sm:py-16">
      <main className="w-full max-w-md">
        {user ? (
          <>
            {/* 프로필 영역 */}
            <InlineProfileEditor user={user} userData={userData} />

            {/* 링크 목록 */}
            <section id="links-section" className="w-full">
              <LinksManager userId={user.uid} />
            </section>
          </>
        ) : (
          <section className="flex flex-col items-center gap-6 text-center py-12">
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              나만의 링크를<br />한 곳에 모아 공유하세요
            </h1>
            <p className="text-muted-foreground">
              SNS 바이오에 하나의 링크만 넣으세요.<br />
              로그인 후 링크를 관리할 수 있습니다.
            </p>
            <div className="mt-4">
              <Button size="lg" className="px-8 text-base h-12" onClick={() => signInWithPopup(auth, googleProvider)}>
                Google로 시작하기
              </Button>
            </div>
          </section>
        )}

        {/* 푸터 */}
        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Powered by MyLink
        </footer>
      </main>
    </div>
  )
}
