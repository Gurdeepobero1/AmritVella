import { Trash2 } from "lucide-react";
import { deleteUserRecord } from "@/lib/actions";

export function DeleteButton({ model, id, path }: { model: string; id: string; path: string }) {
  return (
    <form action={deleteUserRecord.bind(null, model, id, path)}>
      <button
        type="submit"
        className="focus-ring inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50"
      >
        <Trash2 className="h-3 w-3" />
        Delete
      </button>
    </form>
  );
}
