"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useUserProfile } from "@/hooks/use-profile";

export interface UserData {
  displayName?: string;
  username?: string;
  email?: string;
  photoURL?: string;
  bio?: string;
  createdAt?: any;
  lastLoginAt?: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // useUserProfile 훅을 사용하여 데이터 가져오기 (React Query)
  const { data: userData, isLoading: loadingUserData } = useUserProfile(user?.uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            // 새 유저인 경우 초기 데이터 세팅
            let baseDisplayName = currentUser.email ? currentUser.email.split('@')[0] : "user";
            // PRD: 영문 소문자, 숫자, 하이픈만 허용
            baseDisplayName = baseDisplayName.toLowerCase().replace(/[^a-z0-9-]/g, '');
            if (!baseDisplayName) baseDisplayName = "user";
            
            // 중복 검사
            let isUnique = false;
            let counter = 0;
            let finalDisplayName = baseDisplayName;
            
            while (!isUnique) {
              const nameRef = doc(db, "usernames", finalDisplayName);
              const nameSnap = await getDoc(nameRef);
              if (!nameSnap.exists()) {
                isUnique = true;
              } else {
                counter++;
                finalDisplayName = `${baseDisplayName}${counter}`;
              }
            }

            const batch = writeBatch(db);
            
            batch.set(userRef, {
              displayName: finalDisplayName,
              username: currentUser.displayName || "이름 없는 사용자",
              email: currentUser.email,
              photoURL: currentUser.photoURL,
              bio: "",
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            });

            batch.set(doc(db, "usernames", finalDisplayName), {
              userId: currentUser.uid
            });

            await batch.commit();
          } else {
            // 기존 유저인 경우 마지막 로그인 시간 등만 업데이트
            await setDoc(userRef, {
              lastLoginAt: serverTimestamp(),
              photoURL: currentUser.photoURL, // 프로필 사진 변경 대응
              email: currentUser.email,
            }, { merge: true });
            
            // 기존 유저의 경우 usernames 매핑이 누락되었을 수 있으므로 자가 치유(Self-healing) 로직 추가
            const existingData = userSnap.data();
            if (existingData?.displayName) {
              const nameRef = doc(db, "usernames", existingData.displayName);
              const nameSnap = await getDoc(nameRef);
              if (!nameSnap.exists()) {
                await setDoc(nameRef, { userId: currentUser.uid });
              }
            }
          }
        } catch (error) {
          console.error("Error setting up user profile:", error);
        } finally {
          setLoadingAuth(false);
        }
      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loading = loadingAuth || (user !== null && loadingUserData);

  return (
    <AuthContext.Provider value={{ user, userData: userData || null, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
