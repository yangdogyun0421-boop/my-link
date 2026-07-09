import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Link as LinkType } from "@/data/links";

// 링크 조회 훅
export function useLinks(userId: string | undefined) {
  return useQuery({
    queryKey: ["links", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const q = query(
        collection(db, "users", userId, "links"),
        orderBy("createdAt", "asc")
      );
      
      const querySnapshot = await getDocs(q);
      const links: LinkType[] = [];
      querySnapshot.forEach((doc) => {
        links.push({ id: doc.id, ...doc.data() } as LinkType);
      });
      
      return links;
    },
    enabled: !!userId,
  });
}

// 링크 추가 훅
export function useAddLink(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, url }: { title: string; url: string }) => {
      if (!userId) throw new Error("사용자 인증이 필요합니다.");
      
      const linksRef = collection(db, "users", userId, "links");
      const docRef = await addDoc(linksRef, {
        title,
        url,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", userId] });
    },
  });
}

// 링크 수정 훅
export function useUpdateLink(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, url }: { id: string; title: string; url: string }) => {
      if (!userId) throw new Error("사용자 인증이 필요합니다.");
      
      const linkRef = doc(db, "users", userId, "links", id);
      await updateDoc(linkRef, {
        title,
        url,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", userId] });
    },
  });
}

// 링크 삭제 훅
export function useDeleteLink(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("사용자 인증이 필요합니다.");
      
      const linkRef = doc(db, "users", userId, "links", id);
      await deleteDoc(linkRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", userId] });
    },
  });
}
