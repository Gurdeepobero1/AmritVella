import { DataTools } from "@/components/data-tools";
import { PageHeader } from "@/components/ui/primitives";

export default function DataPage() {
  return (
    <div>
      <PageHeader
        title="Export, Import, Backup"
        description="Backup complete user history, import JSON, generate monthly markdown reports, and reset local cache without deleting database records."
      />
      <DataTools />
    </div>
  );
}
