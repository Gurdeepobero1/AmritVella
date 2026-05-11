import { Trash2 } from "lucide-react";
import { deleteUserRecord } from "@/lib/actions";

export function DeleteButton({ model, id, path }: { model: string; id: string; path: string }) {
  return (
    <form action={deleteUserRecord.bind(null, model, id, path)}>
      <button
        type="submit"
        className="focus-ring inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-red-700 transition"
      >
        <Trash2 className="h-3 w-3" />
        Delete
      </button>
    </form>
  );
}
