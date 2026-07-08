"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";

export function AddLinkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError("링크 제목과 URL을 모두 입력해주세요.");
      return;
    }

    // 간단한 URL 검증
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL은 http:// 또는 https:// 로 시작해야 합니다.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const linksRef = collection(db, "users/anonymous/links");
      await addDoc(linksRef, {
        title: title.trim(),
        url: url.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // 폼 초기화
      setTitle("");
      setUrl("");
    } catch (err: any) {
      console.error("Error adding link: ", err);
      setError("링크를 추가하는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="링크 제목 (예: 내 GitHub)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={loading}
            />
            <input
              type="url"
              placeholder="URL (예: https://github.com/)"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={loading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Spinner data-icon="inline-start" />}
            {loading ? "저장 중..." : "링크 추가"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
