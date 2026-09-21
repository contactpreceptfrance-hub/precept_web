import Image from 'next/image'
import type { Product } from '@prisma/client'
import { SERIES_CONFIG } from '@/lib/types'

const input =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20'
const label = 'block text-sm font-semibold mb-1.5'
const hint = 'text-xs text-darkblue/50 mt-1.5'

/** The current cover, so the team can see what they are about to replace. */
function CoverPreview({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-24 aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 mb-3">
      <Image src={src} alt={alt} fill className="object-contain" sizes="96px" />
    </div>
  )
}

/**
 * One form for adding and editing a book.
 *
 * A Server Component posting straight to a Server Action, like the rest of the
 * admin: no client JavaScript. The HTML attributes (required, pattern, accept)
 * catch the common slips in the browser, and the action re-validates everything
 * on the server regardless.
 */
export function BookForm({
  action,
  book,
}: {
  action: (formData: FormData) => Promise<void>
  book?: Product
}) {
  const editing = Boolean(book)

  return (
    <form action={action} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6">
      {book && <input type="hidden" name="bookId" value={book.id} />}

      <div>
        <label htmlFor="name" className={label}>Titre</label>
        <input id="name" name="name" required maxLength={200} defaultValue={book?.name} className={input} />
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div>
          <label htmlFor="price" className={label}>Prix (€)</label>
          <input
            id="price"
            name="price"
            required
            inputMode="decimal"
            pattern="\d{1,4}([.,]\d{1,2})?"
            placeholder="12,50"
            defaultValue={book ? book.price.toFixed(2).replace('.', ',') : undefined}
            className={input}
          />
        </div>
        <div>
          <label htmlFor="type" className={label}>Type</label>
          <select id="type" name="type" defaultValue={book?.type ?? 'LIVRE'} className={input}>
            <option value="LIVRE">Livre</option>
            <option value="FORMATION">Formation</option>
          </select>
        </div>
        <div>
          <label htmlFor="series" className={label}>Série</label>
          <select id="series" name="series" defaultValue={book?.series ?? ''} className={input}>
            <option value="">Aucune</option>
            {SERIES_CONFIG.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={label}>Description</label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          maxLength={5000}
          defaultValue={book?.description}
          className={input}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className={label}>Couverture (recto)</p>
          {book && <CoverPreview src={book.imageUrl} alt={book.name} />}
          <input
            type="file"
            name="cover"
            accept="image/jpeg,image/png,image/webp"
            required={!editing}
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-teal file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-600"
          />
          <p className={hint}>
            JPEG, PNG ou WebP, 2 Mo maximum.
            {editing && ' Laissez vide pour garder la couverture actuelle.'}
          </p>
        </div>

        <div>
          <p className={label}>Quatrième de couverture (verso, facultatif)</p>
          {book?.backImageUrl && <CoverPreview src={book.backImageUrl} alt={`${book.name} — verso`} />}
          <input
            type="file"
            name="backCover"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-darkblue hover:file:bg-gray-200"
          />
          {book?.backImageUrl && (
            <label className="flex items-center gap-2 text-sm mt-3">
              <input type="checkbox" name="removeBack" className="rounded" />
              Supprimer le verso actuel
            </label>
          )}
        </div>
      </div>

      <fieldset className="space-y-3 pt-2">
        <legend className={label}>Visibilité</legend>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={book ? book.published : true}
            className="mt-0.5 rounded"
          />
          <span>
            <strong>Visible dans la boutique</strong>
            <span className="block text-darkblue/50">Décochez pour masquer le livre sans le supprimer.</span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="soldOut" defaultChecked={book?.soldOut} className="mt-0.5 rounded" />
          <span>
            <strong>Épuisé</strong>
            <span className="block text-darkblue/50">Le livre reste affiché mais ne peut plus être commandé.</span>
          </span>
        </label>
      </fieldset>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-teal text-white text-sm font-bold hover:bg-teal-600 transition-colors"
        >
          {editing ? 'Enregistrer' : 'Ajouter le livre'}
        </button>
        <a href="/admin/livres" className="text-sm font-semibold text-darkblue/60 hover:text-darkblue">
          Annuler
        </a>
      </div>
    </form>
  )
}
