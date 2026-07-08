"use client"

import Image from "next/image"
import { useState } from "react"
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getFaviconUrl, type Link } from "@/data/links"
import { cn } from "@/lib/utils"
import { DeleteModal } from "./delete-modal"

interface LinkCardProps {
  link: Link
}

export function LinkCard({ link }: LinkCardProps) {
  const [faviconError, setFaviconError] = useState(false)
  const faviconUrl = getFaviconUrl(link.url)

  // Edit states
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(link.title)
  const [editUrl, setEditUrl] = useState(link.url)
  const [isSaving, setIsSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  // Delete states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEditSave = async () => {
    if (!editTitle.trim() || !editUrl.trim()) {
      setEditError("링크 제목과 URL을 모두 입력해주세요.");
      return;
    }
    if (!editUrl.startsWith("http://") && !editUrl.startsWith("https://")) {
      setEditError("URL은 http:// 또는 https:// 로 시작해야 합니다.")
      return
    }

    setIsSaving(true)
    setEditError(null)
    try {
      const linkRef = doc(db, "users/anonymous/links", link.id)
      await updateDoc(linkRef, {
        title: editTitle.trim(),
        url: editUrl.trim(),
        updatedAt: serverTimestamp()
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating link:", error)
      setEditError("수정에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const linkRef = doc(db, "users/anonymous/links", link.id)
      await deleteDoc(linkRef)
      setIsDeleteModalOpen(false)
    } catch (error) {
      console.error("Error deleting link:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(link.title)
    setEditUrl(link.url)
    setEditError(null)
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
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSaving}
              />
              <input
                type="url"
                placeholder="URL"
                value={editUrl}
                onChange={(e) => {
                  setEditUrl(e.target.value)
                  setEditError(null)
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSaving}
              />
              {editError && <p className="text-xs text-red-500">{editError}</p>}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isSaving}>
                  취소
                </Button>
                <Button size="sm" onClick={handleEditSave} disabled={isSaving}>
                  {isSaving && <Spinner data-icon="inline-start" />}
                  {isSaving ? "저장 중" : "저장"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* 링크를 클릭할 수 있는 영역 */}
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

              {/* 액션 버튼 영역 */}
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditTitle(link.title);
                  setEditUrl(link.url);
                  setEditError(null);
                  setIsEditing(true);
                }}>
                  수정
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsDeleteModalOpen(true)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  삭제
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
        isDeleting={isDeleting}
      />
    </>
  )
}
