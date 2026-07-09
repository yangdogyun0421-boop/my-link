"use client"

import Image from "next/image"
import { useState } from "react"
import { Pencil, Trash2, X, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getFaviconUrl, type Link } from "@/data/links"
import { cn } from "@/lib/utils"
import { useUpdateLink, useDeleteLink } from "@/hooks/use-links"
import { toast } from "sonner"
import { DeleteModal } from "./delete-modal"

interface LinkCardProps {
  link: Link
  userId: string
}

export function LinkCard({ link, userId }: LinkCardProps) {
  const [faviconError, setFaviconError] = useState(false)
  const faviconUrl = getFaviconUrl(link.url)

  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(link.title)
  const [url, setUrl] = useState(link.url)

  const updateLink = useUpdateLink(userId)
  const deleteLink = useDeleteLink(userId)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !url.trim()) {
      toast.error("제목과 URL을 모두 입력해주세요.");
      return;
    }

    try {
      const finalUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(finalUrl);

      // 즉시 닫기
      setIsEditing(false);

      updateLink.mutate({
        id: link.id,
        title: title.trim(),
        url: finalUrl,
      }, {
        onSuccess: () => {
          toast.success("링크가 수정되었습니다.");
        },
        onError: (error) => {
          console.error("Error updating link:", error);
          toast.error("링크 수정 중 오류가 발생했습니다.");
          setIsEditing(true); // 에러 시 복구
        }
      });
    } catch (error) {
      toast.error("올바른 URL 형식이 아닙니다.");
    }
  }

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteLink.mutateAsync(link.id);
      toast.success("링크가 삭제되었습니다.");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("링크 삭제 중 오류가 발생했습니다.");
    }
  }

  const handleCancelEdit = () => {
    setTitle(link.title)
    setUrl(link.url)
    setIsEditing(false)
  }

  return (
    <>
      <Card
        className={cn(
          "w-full transition-all duration-300 ease-out",
          !isEditing && "hover:shadow-lg hover:ring-primary/30",
          !isEditing && "focus-within:ring-2 focus-within:ring-primary"
        )}
      >
      <CardContent className="flex items-center gap-4 p-4">
        {isEditing ? (
          <div className="flex w-full flex-col gap-3">
            <input
              type="text"
              placeholder="링크 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={updateLink.isPending}
            />
            <input
              type="url"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={updateLink.isPending}
            />
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={updateLink.isPending} className="flex-1 sm:flex-none">
                <X className="mr-2 h-4 w-4" />
                취소
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!title.trim() || !url.trim() || updateLink.isPending} className="flex-1 sm:flex-none">
                {updateLink.isPending ? <Spinner className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                저장
              </Button>
            </div>
          </div>
        ) : (
          <>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-1 items-center gap-4 outline-none overflow-hidden"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                {faviconUrl && !faviconError ? (
                  <Image
                    src={faviconUrl}
                    alt={`${link.title} 파비콘`}
                    width={24}
                    height={24}
                    className="size-6 rounded-sm"
                    onError={() => setFaviconError(true)}
                    unoptimized
                  />
                ) : (
                  <span className="text-lg" role="img" aria-label="링크 아이콘">
                    🔗
                  </span>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-heading text-sm font-semibold tracking-tight group-hover:text-primary transition-colors">
                  {link.title}
                </span>
                {link.updatedAt && (
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    수정됨: {link.updatedAt.toLocaleString('ko-KR')}
                  </span>
                )}
              </div>
            </a>

            <div className="flex shrink-0 items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(true)}
                disabled={deleteLink.isPending}
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDeleteClick}
                disabled={deleteLink.isPending}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        linkTitle={link.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDeleting={deleteLink.isPending}
      />
    </>
  )
}
