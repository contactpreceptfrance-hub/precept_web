'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Video,
  FileText,
  BookOpen,
  Share2,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Sparkles,
  MessageCircle,
  Download,
  Copy,
  Check,
} from 'lucide-react'
import type { PublicAtelier } from '@/lib/ateliers'
import { SharePopover } from '@/app/components/shop/share-popover'
import { SITE_URL } from '@/lib/site'

function toCalendarTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function buildGoogleCalendarUrl(atelier: PublicAtelier): string | null {
  if (!atelier.nextDate) return null
  const start = new Date(atelier.nextDate)
  if (Number.isNaN(start.getTime())) return null
  const end = new Date(start.getTime() + (atelier.durationMin || 90) * 60 * 1000)

  const details = [
    atelier.description,
    '',
    `Lien de connexion : ${atelier.zoomUrl}`,
    atelier.zoomInfo ? `Infos : ${atelier.zoomInfo}` : '',
    `Page des ateliers : ${SITE_URL}/ateliers`,
  ]
    .filter(Boolean)
    .join('\n')

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Atelier Precept : ${atelier.title}`,
    dates: `${toCalendarTimestamp(start)}/${toCalendarTimestamp(end)}`,
    details,
    location: atelier.zoomUrl,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function downloadIcsFile(atelier: PublicAtelier) {
  if (!atelier.nextDate) return
  const start = new Date(atelier.nextDate)
  if (Number.isNaN(start.getTime())) return
  const end = new Date(start.getTime() + (atelier.durationMin || 90) * 60 * 1000)

  const escapeIcs = (str: string) =>
    str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')

  const description = [
    atelier.description,
    `Lien de connexion : ${atelier.zoomUrl}`,
    atelier.zoomInfo ? `Infos : ${atelier.zoomInfo}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Precept France//Ateliers Zoom//FR',
    'BEGIN:VEVENT',
    `UID:atelier-${atelier.id}@preceptfrance.fr`,
    `DTSTAMP:${toCalendarTimestamp(new Date())}`,
    `DTSTART:${toCalendarTimestamp(start)}`,
    `DTEND:${toCalendarTimestamp(end)}`,
    `SUMMARY:${escapeIcs(`Atelier Precept : ${atelier.title}`)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(atelier.zoomUrl)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `atelier-precept-${atelier.id}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function formatNextSessionDate(isoDate: string | null): string | null {
  if (!isoDate) return null
  try {
    const d = new Date(isoDate)
    if (Number.isNaN(d.getTime())) return null
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris',
    }).format(d)
  } catch {
    return null
  }
}

export function AtelierCard({
  atelier,
  spotlight = false,
}: {
  atelier: PublicAtelier
  spotlight?: boolean
}) {
  const [showShare, setShowShare] = useState(false)
  const [copiedInvite, setCopiedInvite] = useState(false)

  const origin =
    typeof window !== 'undefined' && window.location.origin ? window.location.origin : SITE_URL
  const atelierSharePath = `/ateliers/${atelier.id}`
  const atelierShareUrl = `${origin}${atelierSharePath}`
  const fullPdfUrl =
    atelier.pdfUrl && !atelier.pdfUrl.startsWith('http')
      ? `${origin}${atelier.pdfUrl}`
      : atelier.pdfUrl

  // Note: WhatsApp always generates its link preview card from the VERY FIRST URL
  // in a message. Placing `atelierShareUrl` first ensures WhatsApp displays the
  // book cover (`og:image` from `/ateliers/[id]`) instead of the Zoom/Google Meet screen.
  const whatsappText = [
    `*Atelier d'étude biblique Precept : ${atelier.title}*`,
    `Horaire : ${atelier.scheduleText}`,
    `Infos et livre : ${atelierShareUrl}`,
    `Lien de connexion : ${atelier.zoomUrl}`,
    atelier.zoomInfo ? `Infos : ${atelier.zoomInfo}` : null,
    fullPdfUrl ? `Extrait gratuit (PDF) : ${fullPdfUrl}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  function handleCopyInvite() {
    navigator.clipboard.writeText(whatsappText).then(() => {
      setCopiedInvite(true)
      setTimeout(() => setCopiedInvite(false), 2500)
    })
  }

  const googleCalUrl = buildGoogleCalendarUrl(atelier)
  const formattedNextDate = formatNextSessionDate(atelier.nextDate)

  return (
    <article
      id={`atelier-${atelier.id}`}
      className={`scroll-mt-28 rounded-3xl border transition-all duration-300 relative ${
        spotlight
          ? 'bg-gradient-to-br from-[#0c1f3f] via-[#0f2942] to-[#0d3b4c] text-white border-teal/40 shadow-2xl p-6 sm:p-10'
          : 'bg-white text-darkblue border-gray-200/90 hover:border-teal/50 hover:shadow-xl p-6 sm:p-8'
      }`}
    >
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
        {/* Cover or Visual */}
        <div className="w-32 sm:w-40 shrink-0 mx-auto md:mx-0">
          <div
            className={`relative w-full aspect-[2/3] rounded-2xl overflow-hidden border shadow-md ${
              spotlight ? 'border-white/20 bg-white/10' : 'border-gray-200 bg-gray-100'
            }`}
          >
            {atelier.imageUrl ? (
              <Image
                src={atelier.imageUrl}
                alt={atelier.title}
                fill
                className="object-contain"
                sizes="160px"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#0d3560] to-[#14b8a6]">
                <Video size={32} className="text-white/90 mb-2" />
                <span className="text-white text-xs font-bold leading-snug line-clamp-4">
                  {atelier.title}
                </span>
              </div>
            )}
            <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide bg-teal text-white shadow-sm">
              En direct
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 w-full">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {spotlight && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal text-white shadow-sm">
                <Sparkles size={13} /> Atelier à la une
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                spotlight
                  ? 'bg-white/10 text-teal-200 border border-white/15'
                  : 'bg-teal/10 text-teal'
              }`}
            >
              <Clock size={13} /> {atelier.scheduleText}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                spotlight ? 'bg-white/10 text-white/80' : 'bg-gray-100 text-darkblue/70'
              }`}
            >
              Participation gratuite · Livre facultatif
            </span>
          </div>

          <h2
            className={`font-playfair text-2xl sm:text-3xl font-bold mb-2 ${
              spotlight ? 'text-white' : 'text-darkblue'
            }`}
          >
            {atelier.title}
          </h2>

          {(formattedNextDate || atelier.leaderName) && (
            <div
              className={`flex flex-wrap items-center gap-x-5 gap-y-1 text-xs sm:text-sm mb-4 ${
                spotlight ? 'text-white/80' : 'text-darkblue/60'
              }`}
            >
              {formattedNextDate && (
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Calendar size={14} className="text-teal shrink-0" />
                  Prochaine séance : <strong className="capitalize">{formattedNextDate}</strong>
                </span>
              )}
              {atelier.leaderName && (
                <span className="inline-flex items-center gap-1.5">
                  <User size={14} className="text-teal shrink-0" />
                  Animé par {atelier.leaderName}
                </span>
              )}
            </div>
          )}

          <p
            className={`text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6 ${
              spotlight ? 'text-white/85' : 'text-darkblue/75'
            }`}
          >
            {atelier.description}
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Direct Meeting Link */}
            <a
              href={atelier.zoomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal hover:bg-teal-600 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
            >
              <Video size={17} />
              <span>Rejoindre la rencontre</span>
              <ExternalLink size={14} className="opacity-80" />
            </a>

            {/* 2. Free Sample PDF if available */}
            {atelier.pdfUrl && (
              <a
                href={atelier.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  spotlight
                    ? 'border-teal/50 bg-white/10 hover:bg-white/20 text-white'
                    : 'border-teal/30 hover:border-teal bg-teal/5 hover:bg-teal/10 text-darkblue'
                }`}
              >
                <FileText size={16} className="text-teal shrink-0" />
                <span>Extrait gratuit (PDF)</span>
              </a>
            )}

            {/* 3. Optional Book Link */}
            {atelier.book && (
              <Link
                href={`/boutique/${atelier.book.id}`}
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${
                  spotlight
                    ? 'border-white/25 hover:bg-white/10 text-white/90'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 text-darkblue'
                }`}
              >
                <BookOpen size={16} className="text-teal shrink-0" />
                <span>
                  Acheter le livre{' '}
                  <span className="font-normal opacity-75">
                    (facultatif — {atelier.book.price.toFixed(2).replace('.', ',')} €)
                  </span>
                </span>
              </Link>
            )}

            {/* 4. WhatsApp Share */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25d366] hover:opacity-95 text-white font-bold text-sm transition-all shadow-sm"
              title="Partager l'invitation sur WhatsApp"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>

            {/* 5. Copy Invitation (1-click fallback for desktop / WhatsApp groups) */}
            <button
              type="button"
              onClick={handleCopyInvite}
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                copiedInvite
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : spotlight
                    ? 'border-white/25 bg-white/5 hover:bg-white/15 text-white'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-darkblue/70 hover:text-darkblue'
              }`}
              title="Copier le message complet (lien + horaire + PDF) pour le coller dans WhatsApp"
            >
              {copiedInvite ? <Check size={15} /> : <Copy size={15} />}
              <span>{copiedInvite ? 'Invitation copiée ✓' : 'Copier l’invitation'}</span>
            </button>

            {/* 6. Share Popover Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowShare(!showShare)}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                  spotlight
                    ? 'border-white/25 bg-white/5 hover:bg-white/15 text-white'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-darkblue/70 hover:text-darkblue'
                }`}
                aria-label="Partager cet atelier"
                title="Autres options de partage"
              >
                <Share2 size={16} />
              </button>

              {showShare && (
                <SharePopover
                  urlPath={atelierSharePath}
                  title={`Atelier Precept : ${atelier.title}`}
                  description={whatsappText}
                  whatsappText={whatsappText}
                  inviteMessage={whatsappText}
                  emailSubject={`Atelier d'étude biblique Precept : ${atelier.title}`}
                  onClose={() => setShowShare(false)}
                />
              )}
            </div>
          </div>

          {/* Zoom Info & Calendar Row */}
          {(atelier.zoomInfo || googleCalUrl) && (
            <div
              className={`mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
                spotlight
                  ? 'border-white/15 text-white/75'
                  : 'border-gray-100 text-darkblue/60'
              }`}
            >
              {atelier.zoomInfo ? (
                <p className="font-mono bg-black/5 px-3 py-1.5 rounded-lg">
                  {atelier.zoomInfo}
                </p>
              ) : (
                <span />
              )}

              {googleCalUrl && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="opacity-75">Ajouter à l’agenda :</span>
                  <a
                    href={googleCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-current/20 hover:bg-teal hover:text-white hover:border-teal transition-colors font-semibold"
                  >
                    <Calendar size={12} /> Google Agenda
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadIcsFile(atelier)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-current/20 hover:bg-teal hover:text-white hover:border-teal transition-colors font-semibold"
                  >
                    <Download size={12} /> Apple / Outlook (.ics)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
