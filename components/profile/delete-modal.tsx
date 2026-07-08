import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface DeleteModalProps {
  isOpen: boolean;
  linkTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteModal({ isOpen, linkTitle, onConfirm, onCancel, isDeleting }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-bold">정말 삭제하시겠습니까?</h2>
        <p className="mb-2 text-sm">
          선택한 링크: <span className="font-semibold">{linkTitle}</span>
        </p>
        <p className="mb-6 text-sm text-red-500 font-medium">
          이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            취소
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting && <Spinner data-icon="inline-start" />}
            {isDeleting ? "삭제 중..." : "삭제하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
