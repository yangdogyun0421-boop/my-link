"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Moon, Sun, Monitor } from "lucide-react";

export function Header() {
  const { user, userData, loading } = useAuth();
  const { setTheme, theme } = useTheme();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <span className="text-xl" role="img" aria-label="로고">🔗</span>
          <span className="font-heading font-bold tracking-tight">MyLink</span>
        </Link>

        <div className="flex items-center gap-4">
          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-10 w-10 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring hover:bg-muted transition-colors flex items-center justify-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userData?.photoURL || user.photoURL || undefined} alt="프로필" />
                    <AvatarFallback>{userData?.username?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2 py-1">
                        <p className="text-sm font-medium leading-none">{userData?.username || user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          @{userData?.displayName || "user"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground opacity-70">
                          {userData?.email || user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.open(`/${userData?.displayName}`, "_blank")} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>내 공개 프로필 보기</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
                    {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    <span>{theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" onClick={handleLogin}>
                Google로 시작하기
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
