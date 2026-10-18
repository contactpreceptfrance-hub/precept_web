import Image from 'next/image'
import { ExternalLink, FileText, Video, BookOpen, Calendar } from 'lucide-react'
import type { Atelier } from '@prisma/client'
import { AVAILABLE_PDF_GROUPS, getPdfDisplayName } from '@/lib/book-pdfs'
import { getSamplePdfUrl } from '@/lib/sample-pdfs'

const input =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20'
const label = 'block text-sm font-semibold mb-1.5'
const hint = 'text-xs text-darkblue/50 mt-1.5'

export type SelectableBook = {
  id: string
  name: string
  price: number
  imageUrl: string
  samplePdfUrl: string | null
  published: boolean
}

/** Formats a Date for an <input type="datetime-local"> in local ISO format (YYYY-MM-DDTHH:mm) */
function toDatetimeLocalValue(date: Date | null | undefined): string {
  if (!date) return ''
  try {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  } catch {
    return ''
  }
}

export function AtelierForm({
  action,
  atelier,
  books,
}: {
  action: (formData: FormData) => Promise<void>
  atelier?: Atelier
  books: SelectableBook[]
}) {
  const editing = Boolean(atelier)
  const linkedBook = atelier?.productId
    ? books.find((b) => b.id === atelier.productId)
    : undefined
  const inheritedPdf =
    linkedBook?.samplePdfUrl || (linkedBook ? getSamplePdfUrl(linkedBook.name) : null)

  return (
    <form
      action={action}
      className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6"
    >
      {atelier && <input type="hidden" name="atelierId" value={atelier.id} />}

      <div>
        <label htmlFor="title" className={label}>
          Titre / Thème de l’atelier
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={200}
          placeholder="Ex. : Seigneur, enseigne-moi à prier — Étude hebdomadaire"
          defaultValue={atelier?.title}
          className={input}
        />
        <p className={hint}>
          Le sujet varie selon le livre étudié (ex. : titre du livre ou thème de la série).
        </p>
      </div>

      {/* horaires & animateur */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5 space-y-4">
        <h3 className="font-semibold text-darkblue text-base flex items-center gap-2">
          <Calendar size={18} className="text-teal" />
          Horaires & Prochaine rencontre
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="scheduleText" className={label}>
              Rythme & Horaire affiché
            </label>
            <input
              id="scheduleText"
              name="scheduleText"
              required
              maxLength={300}
              placeholder="Ex. : Tous les mardis de 20h00 à 21h30 (Heure de Paris)"
              defaultValue={atelier?.scheduleText}
              className={input}
            />
          </div>

          <div>
            <label htmlFor="nextDate" className={label}>
              Date et heure de la prochaine séance (facultatif)
            </label>
            <input
              id="nextDate"
              type="datetime-local"
              name="nextDate"
              defaultValue={toDatetimeLocalValue(atelier?.nextDate)}
              className={input}
            />
            <p className={hint}>
              Active le bouton « Ajouter à mon agenda » (Google Agenda / .ics) sur la carte.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="durationMin" className={label}>
                Durée (min)
              </label>
              <input
                id="durationMin"
                name="durationMin"
                inputMode="numeric"
                pattern="\d{1,3}"
                defaultValue={atelier?.durationMin ?? 90}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="leaderName" className={label}>
                Animateur (facultatif)
              </label>
              <input
                id="leaderName"
                name="leaderName"
                maxLength={150}
                placeholder="Ex. : Équipe Precept"
                defaultValue={atelier?.leaderName ?? ''}
                className={input}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lien Zoom */}
      <div className="rounded-2xl border border-teal/20 bg-teal/5 p-5 space-y-4">
        <h3 className="font-semibold text-darkblue text-base flex items-center gap-2">
          <Video size={18} className="text-teal" />
          Connexion Zoom
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zoomUrl" className={label}>
              Lien de la réunion Zoom
            </label>
            <input
              id="zoomUrl"
              type="url"
              name="zoomUrl"
              required
              maxLength={500}
              placeholder="https://us02web.zoom.us/j/..."
              defaultValue={atelier?.zoomUrl}
              className={input}
            />
            <p className={hint}>
              Ce lien sera ouvert par le bouton « Rejoindre sur Zoom » et inclus dans le partage WhatsApp.
            </p>
          </div>

          <div>
            <label htmlFor="zoomInfo" className={label}>
              ID de réunion / Code secret (facultatif)
            </label>
            <input
              id="zoomInfo"
              name="zoomInfo"
              maxLength={250}
              placeholder="Ex. : ID : 812 3456 7890 · Code : 123456"
              defaultValue={atelier?.zoomInfo ?? ''}
              className={input}
            />
            <p className={hint}>
              Affiché sous le bouton Zoom pour ceux qui se connectent manuellement.
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={label}>
          Présentation de l’atelier
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={5000}
          placeholder="Présentez le thème étudié, à qui s’adresse l’atelier et comment se déroule la rencontre..."
          defaultValue={atelier?.description}
          className={input}
        />
      </div>

      {/* Livre associé (facultatif) */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-darkblue text-base flex items-center gap-2">
            <BookOpen size={18} className="text-teal" />
            Livre d’étude associé (achat facultatif pour les participants)
          </h3>
          <p className={hint}>
            En associant un livre de la boutique, l’atelier récupère automatiquement sa couverture,
            son lien d’achat (indiqué comme facultatif) et son extrait PDF gratuit s’il existe.
          </p>
        </div>

        <div>
          <label htmlFor="productId" className={label}>
            Choisir un livre du catalogue (facultatif)
          </label>
          <select
            id="productId"
            name="productId"
            defaultValue={atelier?.productId ?? ''}
            className={input}
          >
            <option value="">-- Aucun livre associé (atelier libre) --</option>
            {books.map((b) => {
              const hasPdf = Boolean(b.samplePdfUrl || getSamplePdfUrl(b.name))
              return (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.price.toFixed(2).replace('.', ',')} €)
                  {hasPdf ? ' — [Extrait PDF dispo]' : ''}
                  {!b.published ? ' [Masqué]' : ''}
                </option>
              )
            })}
          </select>
        </div>

        {linkedBook && (
          <div className="bg-white rounded-xl border border-gray-200 p-3.5 flex items-center gap-4 text-xs">
            <div className="relative w-10 aspect-[2/3] shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src={linkedBook.imageUrl}
                alt={linkedBook.name}
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-darkblue truncate">
                Livre lié : {linkedBook.name} ({linkedBook.price.toFixed(2).replace('.', ',')} €)
              </p>
              <p className="text-darkblue/60 mt-0.5">
                {inheritedPdf
                  ? `Extrait PDF hérité du livre : ${getPdfDisplayName(inheritedPdf)}`
                  : 'Aucun extrait PDF sur ce livre (vous pouvez en associer un ci-dessous).'}
              </p>
            </div>
          </div>
        )}

        {/* Image personnalisée facultative */}
        <div className="pt-2 border-t border-gray-200/70">
          <label htmlFor="customImage" className={label}>
            Image personnalisée (facultatif — remplace la couverture du livre si fournie)
          </label>
          {atelier?.customImageUrl && (
            <div className="relative w-24 aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 mb-3">
              <Image
                src={atelier.customImageUrl}
                alt={atelier.title}
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
          )}
          <input
            id="customImage"
            type="file"
            name="customImage"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-darkblue hover:file:bg-gray-200"
          />
          {atelier?.customImageUrl && (
            <label className="flex items-center gap-2 text-sm mt-2 text-red-600 cursor-pointer">
              <input type="checkbox" name="removeCustomImage" className="rounded" />
              Supprimer l’image personnalisée (revenir à la couverture du livre)
            </label>
          )}
        </div>
      </div>

      {/* Extrait PDF / Support de l'atelier */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-darkblue text-base flex items-center gap-2">
              <FileText size={18} className="text-teal" />
              Extrait PDF gratuit / Support de l’atelier (facultatif)
            </h3>
            <p className={hint}>
              Si le livre choisi possède déjà un extrait PDF, il sera affiché automatiquement.
              Vous pouvez aussi sélectionner ou téléverser ici un PDF spécifique pour cet atelier.
            </p>
          </div>
          {(atelier?.customPdfUrl || inheritedPdf) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal/10 text-teal">
              ✓ PDF disponible
            </span>
          )}
        </div>

        {atelier?.customPdfUrl && (
          <div className="bg-white rounded-xl border border-teal/20 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-teal" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-darkblue truncate">
                    {getPdfDisplayName(atelier.customPdfUrl)}
                  </p>
                  <p className="text-xs text-darkblue/50 truncate font-mono">
                    {atelier.customPdfUrl}
                  </p>
                </div>
              </div>
              <a
                href={atelier.customPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-teal/30 bg-teal/5 text-xs font-semibold text-teal hover:bg-teal/10 transition-colors"
              >
                <ExternalLink size={14} /> Voir le PDF
              </a>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 text-sm text-red-600 font-medium cursor-pointer">
                <input type="checkbox" name="removeCustomPdf" className="rounded text-red-600" />
                <span>Retirer ce PDF spécifique (revenir au PDF du livre s’il existe)</span>
              </label>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label htmlFor="existingPdf" className={label}>
              Choisir un PDF du catalogue :
            </label>
            <select id="existingPdf" name="existingPdf" defaultValue="" className={input}>
              <option value="">-- Automatique (selon le livre) / Ne pas changer --</option>
              {atelier?.customPdfUrl && (
                <option value="__NONE__">-- Retirer le PDF spécifique --</option>
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
          </div>

          <div>
            <label htmlFor="customPdfFile" className={label}>
              Ou téléverser un fichier PDF (8 Mo max) :
            </label>
            <input
              id="customPdfFile"
              type="file"
              name="customPdfFile"
              accept="application/pdf,.pdf"
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-darkblue hover:file:bg-gray-200"
            />
          </div>
        </div>

        <div className="pt-1">
          <label htmlFor="customPdfUrl" className="block text-xs font-semibold text-darkblue/70 mb-1">
            Ou indiquer une URL PDF directe (facultatif) :
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

      {/* Visibilité & Mise en avant */}
      <fieldset className="space-y-3 pt-2">
        <legend className={label}>Publication & Mise en avant</legend>
        <label className="flex items-start gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="published"
            defaultChecked={atelier ? atelier.published : true}
            className="mt-0.5 rounded"
          />
          <span>
            <strong>Visible sur la page Ateliers</strong>
            <span className="block text-darkblue/50">
              Décochez pour masquer temporairement cet atelier sans le supprimer.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={atelier?.featured ?? false}
            className="mt-0.5 rounded"
          />
          <span>
            <strong>Mettre à la une (« Prochain atelier »)</strong>
            <span className="block text-darkblue/50">
              Affiche cet atelier en grand en haut de la page /ateliers.
            </span>
          </span>
        </label>
      </fieldset>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-teal text-white text-sm font-bold hover:bg-teal-600 transition-colors"
        >
          {editing ? 'Enregistrer' : 'Ajouter l’atelier'}
        </button>
        <a
          href="/admin/ateliers"
          className="text-sm font-semibold text-darkblue/60 hover:text-darkblue"
        >
          Annuler
        </a>
      </div>
    </form>
  )
}
