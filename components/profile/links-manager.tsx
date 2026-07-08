"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Link } from "@/data/links";
import { LinkList } from "./link-list";
import { AddLinkForm } from "./add-link-form";

export function LinksManager() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실시간 구독 쿼리 (가장 최신에 추가된 링크를 위에 표시하고 싶다면 'desc', 아래에 표시하고 싶다면 'asc')
    const q = query(
      collection(db, "users/anonymous/links"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks: Link[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          url: data.url,
          // Firestore Timestamp를 Date로 변환, 로컬 추가 직후에는 createdAt이 null일 수 있음 (서버 시간 계산 전)
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
      setLinks(fetchedLinks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <AddLinkForm />
      
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
          <svg className="animate-spin h-8 w-8 mb-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm font-medium">링크를 불러오는 중...</p>
        </div>
      ) : links.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          아직 등록된 링크가 없습니다.
        </div>
      ) : (
        <LinkList links={links} />
      )}
    </div>
  );
}
