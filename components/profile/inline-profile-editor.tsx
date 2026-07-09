"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserData } from "@/components/auth/auth-provider";
import { useUpdateProfile } from "@/hooks/use-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Pencil, X, Check } from "lucide-react";

interface InlineProfileEditorProps {
  user: User;
  userData: UserData | null;
}

export function InlineProfileEditor({ user, userData }: InlineProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const updateProfile = useUpdateProfile(user?.uid);

  // userData가 로드되면 초기값 세팅 (편집 모드가 아닐 때만)
  useEffect(() => {
    if (!isEditing && userData) {
      setUsername(userData.username || "");
      setDisplayName(userData.displayName || "");
      setBio(userData.bio || "");
    }
  }, [userData, isEditing]);

  // 편집 모드 진입 시 최신 데이터로 리셋
  const handleEditClick = () => {
    setUsername(userData?.username || "");
    setDisplayName(userData?.displayName || "");
    setBio(userData?.bio || "");
    setIsAvailable(null);
    setErrorMessage("");
    setIsEditing(true);
  };

  // 편집 취소
  const handleCancel = () => {
    setIsEditing(false);
  };

  // displayName 중복 검사
  useEffect(() => {
    if (!isEditing) return;
    
    if (displayName === userData?.displayName) {
      setIsAvailable(true);
      setErrorMessage("");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(displayName)) {
      setIsAvailable(false);
      setErrorMessage("영문 소문자, 숫자, 하이픈(-)만 허용됩니다.");
      return;
    }

    if (displayName.length > 30) {
      setIsAvailable(false);
      setErrorMessage("최대 30자까지 입력 가능합니다.");
      return;
    }

    setIsChecking(true);
    const checkDuplicate = setTimeout(async () => {
      try {
        const nameRef = doc(db, "usernames", displayName);
        const nameSnap = await getDoc(nameRef);
        
        if (nameSnap.exists()) {
          setIsAvailable(false);
          setErrorMessage("❌ 이미 사용 중인 아이디입니다.");
        } else {
          setIsAvailable(true);
          setErrorMessage("✅ 사용 가능한 아이디입니다.");
        }
      } catch (error) {
        console.error("중복 확인 오류:", error);
        setIsAvailable(false);
        setErrorMessage("오류가 발생했습니다.");
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(checkDuplicate);
  }, [displayName, isEditing, userData?.displayName]);

  // 저장 처리
  const handleSave = () => {
    if (!user || !isAvailable) return;

    // 즉각적인 피드백을 위해 편집 모드를 먼저 닫습니다 (진정한 낙관적 업데이트)
    setIsEditing(false);

    updateProfile.mutate({
      username,
      displayName,
      bio,
      oldDisplayName: userData?.displayName,
    }, {
      onSuccess: () => {
        toast.success("프로필이 성공적으로 업데이트되었습니다.");
      },
      onError: (error) => {
        console.error("프로필 저장 오류:", error);
        toast.error("프로필 저장 중 오류가 발생했습니다.");
        setIsEditing(true); // 에러 시 다시 폼을 열어줌
      }
    });
  };

  return (
    <section className="bg-card text-card-foreground rounded-xl border shadow-sm p-6 mb-8 relative">
      {/* 뷰 모드 */}
      {!isEditing ? (
        <>
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="sm" onClick={handleEditClick} className="text-muted-foreground hover:text-foreground">
              <Pencil className="h-4 w-4 mr-2" />
              수정
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative h-24 w-24 shrink-0">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData?.photoURL || user.photoURL || undefined} alt="프로필" />
                <AvatarFallback className="text-2xl">{userData?.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col space-y-2 flex-1 pr-12">
              <h1 className="font-heading text-xl font-bold tracking-tight">
                {userData?.username || user.displayName || "이름 없는 사용자"}
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                @{userData?.displayName || "user"}
              </p>
              <p className="text-sm whitespace-pre-wrap">
                {userData?.bio || "아직 소개글이 없습니다. 프로필 설정에서 추가해보세요!"}
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between bg-muted/50 rounded-lg p-3">
            <div className="text-sm text-muted-foreground truncate mr-4">
              🔗 내 공개 페이지:{" "}
              <Link href={`/${userData?.displayName}`} target="_blank" className="text-primary hover:underline font-medium ml-1">
                mylink.com/{userData?.displayName}
              </Link>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/${userData?.displayName}`);
              toast.success("URL이 복사되었습니다!");
            }}>
              복사
            </Button>
          </div>
        </>
      ) : (
        /* 편집 모드 */
        <div className="flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold">프로필 수정</h2>
            <Button variant="ghost" size="icon" onClick={handleCancel} disabled={updateProfile.isPending}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="inline-username">이름 (닉네임)</Label>
              <Input
                id="inline-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="예: 양도균"
                maxLength={30}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="inline-displayName">고유 아이디 (URL)</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm whitespace-nowrap">mylink.com/</span>
                <Input
                  id="inline-displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="아이디 입력"
                  maxLength={30}
                />
              </div>
              <div className="h-4 text-xs">
                {isChecking ? (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Spinner className="h-3 w-3" /> 확인 중...
                  </span>
                ) : (
                  <span className={isAvailable === false ? "text-destructive" : "text-emerald-500"}>
                    {errorMessage}
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="inline-bio">소개글</Label>
              <Textarea
                id="inline-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="자신을 짧게 소개해 주세요."
                maxLength={150}
                className="resize-none h-20"
              />
              <div className="text-xs text-muted-foreground text-right">
                {bio.length} / 150
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2 border-t mt-2">
            <Button variant="outline" onClick={handleCancel} disabled={updateProfile.isPending}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={!isAvailable || isChecking || !username || !displayName || updateProfile.isPending}>
              {updateProfile.isPending && <Spinner className="mr-2 h-4 w-4" />}
              저장
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
