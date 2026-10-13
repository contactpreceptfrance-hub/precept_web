import Image from 'next/image'
import { ExternalLink, FileText } from 'lucide-react'
import type { Product } from '@prisma/client'
import { SERIES_CONFIG } from '@/lib/types'
import { AVAILABLE_PDF_GROUPS, getPdfDisplayName } from '@/lib/book-pdfs'

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

      <div className="grid sm:grid-cols-4 gap-6">
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
          <label htmlFor="stock" className={label}>Stock</label>
          <input
            id="stock"
            name="stock"
            inputMode="numeric"
            pattern="\d{1,5}"
            placeholder="Non suivi"
            defaultValue={book?.stock ?? undefined}
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

      {/* Extrait PDF / Document d'accompagnement */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-darkblue text-base flex items-center gap-2">
              <FileText size={18} className="text-teal" />
              Extrait PDF / Document d’accompagnement
            </h3>
            <p className={hint}>
              Permet aux visiteurs de feuilleter gratuitement un extrait (Semaine 1, leçon exemple) sur la page du livre.
            </p>
          </div>
          {book?.samplePdfUrl && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal/10 text-teal">
              ✓ PDF associé
            </span>
          )}
        </div>

        {book?.samplePdfUrl ? (
          <div className="bg-white rounded-xl border border-teal/20 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-teal" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-darkblue truncate">
                    {getPdfDisplayName(book.samplePdfUrl)}
                  </p>
                  <p className="text-xs text-darkblue/50 truncate font-mono">
                    {book.samplePdfUrl}
                  </p>
                </div>
              </div>
              <a
                href={book.samplePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-teal/30 bg-teal/5 text-xs font-semibold text-teal hover:bg-teal/10 transition-colors"
              >
                <ExternalLink size={14} /> Voir le PDF
              </a>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 text-sm text-red-600 font-medium cursor-pointer">
                <input type="checkbox" name="removeSamplePdf" className="rounded text-red-600 focus:ring-red-500" />
                <span>Supprimer / Retirer ce document PDF de ce livre</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 rounded-xl border border-gray-200 p-3.5 text-xs text-darkblue/60">
            Aucun document PDF n’est actuellement associé à ce livre. Vous pouvez en sélectionner un ci-dessous ou en téléverser un nouveau.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label htmlFor="existingPdf" className={label}>
              {book?.samplePdfUrl ? 'Remplacer par un PDF du catalogue :' : 'Choisir parmi les 45 PDF existants :'}
            </label>
            <select
              id="existingPdf"
              name="existingPdf"
              defaultValue=""
              className={input}
            >
              <option value="">-- Ne pas changer / Conserver l’état actuel --</option>
              {book?.samplePdfUrl && (
                <option value="__NONE__">-- Aucun document PDF (dissocier) --</option>
              )}
              {AVAILABLE_PDF_GROUPS.map((group) => (
                <optgroup key={group.category} label={group.label}>
                  {group.files.map((file) => (
                    <option key={file.url} value={file.url}>
                      {file.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className={hint}>
              Sélectionnez un extrait ou guide déjà hébergé dans le projet.
            </p>
          </div>

          <div>
            <label htmlFor="samplePdfFile" className={label}>
              {book?.samplePdfUrl ? 'Ou téléverser un nouveau PDF :' : 'Ou téléverser un fichier PDF :'}
            </label>
            <input
              id="samplePdfFile"
              type="file"
              name="samplePdfFile"
              accept="application/pdf,.pdf"
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-darkblue hover:file:bg-gray-200"
            />
            <p className={hint}>
              Format PDF, 8 Mo maximum. Remplace le document s’il est fourni.
            </p>
          </div>
        </div>

        <div className="pt-1">
          <label htmlFor="customPdfUrl" className="block text-xs font-semibold text-darkblue/70 mb-1">
            Ou indiquer une URL directe / externe (facultatif) :
          </label>
          <input
            id="customPdfUrl"
            type="url"
            name="customPdfUrl"
            placeholder="https://..."
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
          />
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
