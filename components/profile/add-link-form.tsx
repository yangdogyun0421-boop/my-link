"use client";

import { useState } from "react";
import { useAddLink } from "@/hooks/use-links";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface AddLinkFormProps {
  userId: string;
  onCancel: () => void;
}

export function AddLinkForm({ userId, onCancel }: AddLinkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const addLink = useAddLink(userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      toast.error("제목과 URL을 모두 입력해주세요.");
      return;
    }

    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // 즉시 닫기
      onCancel();
      
      addLink.mutate({ title: title.trim(), url: finalUrl }, {
        onSuccess: () => {
          toast.success("링크가 추가되었습니다.");
        },
        onError: (error) => {
          console.error("링크 추가 오류:", error);
          toast.error("링크 추가 중 오류가 발생했습니다.");
        }
      });
    } catch (error) {
      toast.error("올바른 URL 형식이 아닙니다.");
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
              disabled={addLink.isPending}
            />
            <input
              type="url"
              placeholder="URL (예: https://github.com/)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={addLink.isPending}
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={addLink.isPending}>
              취소
            </Button>
            <Button type="submit" disabled={!title.trim() || !url.trim() || addLink.isPending}>
              {addLink.isPending ? <Spinner className="mr-2 h-4 w-4" /> : null}
              추가
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
