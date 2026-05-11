import { createGurbaniContent, createPlaylistLink } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { Card, CardHeader, EmptyState, Field, inputClass, PageHeader, SubmitButton } from "@/components/ui/primitives";

export default async function LibraryPage() {
  await requireUser();
  const [content, playlists] = await Promise.all([
    prisma.gurbaniContent.findMany({ orderBy: [{ category: "asc" }, { title: "asc" }] }),
    prisma.playlistLink.findMany({ orderBy: { createdAt: "desc" }, take: 20 })
  ]);

  return (
    <div>
      <PageHeader
        title="Gurbani / Path Library"
        description="Placeholder library only. Add verified Gurmukhi, transliteration, English meaning, and source URLs later."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card className="overflow-hidden">
          <CardHeader title="Library content" description="Do not paste unverified Gurbani text. Leave fields blank until verified." />
          <div className="space-y-3 p-4 sm:p-5">
            {content.length ? (
              content.map((item) => (
                <article key={item.id} className="rounded-[16px] bg-card p-3">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-sm font-semibold text-navy-950">{item.title}</h2>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-saffron-600">{item.category}</span>
                  </div>
                  <div className="mt-2 grid gap-2 text-xs text-steel-700 sm:grid-cols-3">
                    <span>{item.gurmukhiText ? "Gurmukhi added" : "Gurmukhi empty"}</span>
                    <span>{item.transliteration ? "Transliteration added" : "Transliteration empty"}</span>
                    <span>{item.englishMeaning ? "Meaning added" : "Meaning empty"}</span>
                  </div>
                  {item.verifiedSourceUrl ? (
                    <a className="mt-2 block break-all text-xs font-medium text-navy-950 underline" href={item.verifiedSourceUrl} target="_blank" rel="noreferrer">
                      {item.verifiedSourceUrl}
                    </a>
                  ) : null}
                  {item.notes ? <p className="mt-2 text-sm leading-5 text-steel-700">{item.notes}</p> : null}
                </article>
              ))
            ) : (
              <EmptyState>No library content yet. Run the seed script to create placeholders.</EmptyState>
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="overflow-hidden">
            <CardHeader title="Add verified content" description="All text fields are optional so placeholders remain safe." />
            <form action={createGurbaniContent} className="grid gap-4 p-4 sm:p-5">
              <Field label="Title">
                <input className={inputClass} name="title" required />
              </Field>
              <Field label="Category">
                <input className={inputClass} name="category" placeholder="Nitnem, Healing, Character" required />
              </Field>
              <Field label="Gurmukhi text">
                <textarea className={inputClass} name="gurmukhiText" rows={3} />
              </Field>
              <Field label="Transliteration">
                <textarea className={inputClass} name="transliteration" rows={3} />
              </Field>
              <Field label="English meaning">
                <textarea className={inputClass} name="englishMeaning" rows={3} />
              </Field>
              <Field label="Verified source URL">
                <input className={inputClass} name="verifiedSourceUrl" type="url" />
              </Field>
              <Field label="Notes">
                <textarea className={inputClass} name="notes" rows={3} />
              </Field>
              <SubmitButton>Add content</SubmitButton>
            </form>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title="Kirtan playlist links" description="Store verified playlists and source notes." />
            <form action={createPlaylistLink} className="grid gap-4 p-4 sm:p-5">
              <Field label="Related content">
                <select className={inputClass} name="gurbaniContentId" defaultValue="">
                  <option value="">No related content</option>
                  {content.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Title">
                <input className={inputClass} name="title" required />
              </Field>
              <Field label="URL">
                <input className={inputClass} name="url" type="url" required />
              </Field>
              <Field label="Category">
                <input className={inputClass} name="category" placeholder="Anxiety, courage, gratitude" />
              </Field>
              <Field label="Notes">
                <textarea className={inputClass} name="notes" rows={2} />
              </Field>
              <SubmitButton>Add playlist</SubmitButton>
            </form>
            <div className="space-y-2 border-t border-navy-950/10 p-4 sm:p-5">
              {playlists.length ? (
                playlists.map((playlist) => (
                  <a
                    key={playlist.id}
                    className="focus-ring block rounded-[16px] bg-card px-3 py-2 text-sm font-bold text-navy-950 underline"
                    href={playlist.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {playlist.title}
                  </a>
                ))
              ) : (
                <EmptyState>No playlist links yet.</EmptyState>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
