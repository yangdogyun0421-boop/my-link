"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { getFaviconUrl, type Link } from "@/data/links"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface LinkCardProps {
  link: Link
}

export function LinkCard({ link }: LinkCardProps) {
  const [faviconError, setFaviconError] = useState(false)
  const faviconUrl = getFaviconUrl(link.url)

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      id={`link-card-${link.id}`}
      className="group block w-full outline-none"
    >
      <Card
        className={cn(
          "transition-all duration-300 ease-out",
          "hover:scale-[1.02] hover:shadow-lg hover:ring-primary/30",
          "active:scale-[0.98]",
          "focus-visible:ring-2 focus-visible:ring-primary"
        )}
      >
        <CardContent className="flex items-center gap-4">
          {/* 파비콘 아이콘 (PRD F-04) */}
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

          {/* 링크 제목 */}
          <span className="flex-1 truncate font-heading text-sm font-semibold tracking-tight">
            {link.title}
          </span>

          {/* 화살표 아이콘 (와이어프레임 참조) */}
          <span
            className={cn(
              "text-muted-foreground transition-transform duration-300",
              "group-hover:translate-x-1 group-hover:text-primary"
            )}
            aria-hidden="true"
          >
            →
          </span>
        </CardContent>
      </Card>
    </a>
  )
}
