"use client";

import { useState } from "react";
import { useLinks } from "@/hooks/use-links";
import { LinkList } from "./link-list";
import { AddLinkForm } from "./add-link-form";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function LinksManager({ userId }: { userId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const { data: links = [], isLoading } = useLinks(userId);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">내 링크</h2>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            링크 추가
          </Button>
        )}
      </div>

      {isAdding && (
        <AddLinkForm 
          userId={userId} 
          onCancel={() => setIsAdding(false)} 
        />
      )}
      
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
          <Spinner className="h-8 w-8 mb-4 text-primary" />
          <p className="text-sm font-medium">링크를 불러오는 중...</p>
        </div>
      ) : links.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          아직 등록된 링크가 없습니다.
        </div>
      ) : (
        <LinkList links={links} userId={userId} />
      )}
    </div>
  );
}
