import { type Link } from "@/data/links"
import { LinkCard } from "./link-card"

interface LinkListProps {
  links: Link[]
}

export function LinkList({ links }: LinkListProps) {
  if (links.length === 0) {
    return (
      <div
        id="link-list-empty"
        className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center"
      >
        <span className="text-4xl" role="img" aria-label="링크 없음">
          🔗
        </span>
        <p className="text-sm text-muted-foreground">
          아직 등록된 링크가 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div id="link-list" className="flex flex-col gap-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  )
}
