import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { UserData } from "@/components/auth/auth-provider";

// 내 프로필 조회 (auth-provider용)
export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data() as UserData;
      }
      return null;
    },
    enabled: !!userId,
  });
}

// 공개 프로필 조회 (방문자용)
export function usePublicProfile(displayName: string | undefined) {
  return useQuery({
    queryKey: ["publicProfile", displayName],
    queryFn: async () => {
      if (!displayName) return null;
      
      // 1. usernames 컬렉션에서 UID 찾기
      const nameRef = doc(db, "usernames", displayName);
      const nameSnap = await getDoc(nameRef);

      if (!nameSnap.exists()) {
        throw new Error("User not found");
      }

      const userId = nameSnap.data().userId;

      // 2. 해당 UID의 프로필 정보 가져오기
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error("User data not found");
      }

      return {
        userId,
        profile: userSnap.data() as UserData,
      };
    },
    enabled: !!displayName,
    retry: false, // 404 에러의 경우 재시도 불필요
  });
}

// 내 프로필 수정 (대시보드 인라인 폼용 - 낙관적 업데이트 포함)
export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      username,
      displayName,
      bio,
      oldDisplayName,
    }: {
      username: string;
      displayName: string;
      bio: string;
      oldDisplayName?: string;
    }) => {
      if (!userId) throw new Error("사용자 인증이 필요합니다.");

      const batch = writeBatch(db);
      const userRef = doc(db, "users", userId);

      batch.update(userRef, {
        username,
        displayName,
        bio,
      });

      if (displayName !== oldDisplayName) {
        if (oldDisplayName) {
          batch.delete(doc(db, "usernames", oldDisplayName));
        }
        batch.set(doc(db, "usernames", displayName), {
          userId,
        });
      }

      await batch.commit();
      return { username, displayName, bio };
    },
    // 낙관적 업데이트 로직
    onMutate: async (newProfile) => {
      // 진행 중인 쿼리를 취소하여 덮어쓰기 방지
      await queryClient.cancelQueries({ queryKey: ["userProfile", userId] });

      // 이전 상태 스냅샷 저장
      const previousProfile = queryClient.getQueryData<UserData>(["userProfile", userId]);

      // 낙관적으로 캐시 업데이트
      if (previousProfile) {
        queryClient.setQueryData<UserData>(["userProfile", userId], {
          ...previousProfile,
          username: newProfile.username,
          displayName: newProfile.displayName,
          bio: newProfile.bio,
        });
      }

      // 롤백을 위한 값 반환
      return { previousProfile };
    },
    onError: (err, newProfile, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(["userProfile", userId], context.previousProfile);
      }
    },
    onSettled: () => {
      // 성공/실패 여부와 상관없이 서버 데이터와 동기화
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });
}
