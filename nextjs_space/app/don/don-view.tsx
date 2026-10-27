'use client'

import { useState } from 'react'
import { Heart, Copy, Check, CreditCard, Landmark } from 'lucide-react'

const PRESETS = [10, 25, 50, 100]

type Bank = { titulaire: string; iban: string; bic: string }

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the value stays selectable on screen.
    }
  }
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
      <div className="min-w-0">
        <p className="text-xs text-darkblue/50">{label}</p>
        <p className="font-mono text-sm text-darkblue break-all select-all">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 p-2 rounded-lg text-teal hover:bg-teal/10"
        aria-label={`Copier ${label}`}
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </div>
  )
}

export function DonView({ bank }: { bank: Bank | null }) {
  const [preset, setPreset] = useState<number | null>(25)
  const [custom, setCustom] = useState('')
  const [recurring, setRecurring] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const amount = custom.trim() !== '' ? custom.trim() : preset ? String(preset) : ''

  const donate = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/don', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount, recurring }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      setError(data.error || 'Une erreur est survenue. Réessayez.')
    } catch {
      setError('Connexion impossible. Réessayez.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 pt-32 pb-20">
      <div className="text-center mb-10">
        <Heart size={44} className="text-teal mx-auto mb-4" />
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-darkblue mb-3">
          Faire un don
        </h1>
        <p className="text-darkblue/70 leading-relaxed">
          Votre générosité finance nos ateliers gratuits et la diffusion de l’étude biblique
          inductive. Merci de soutenir cette mission.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
        <h2 className="flex items-center gap-2 font-playfair text-xl font-bold text-darkblue mb-5">
          <CreditCard size={22} className="text-teal" /> Par carte bancaire
        </h2>

        <div className="grid grid-cols-2 gap-2 mb-5" role="group" aria-label="Fréquence">
          {[
            { label: 'Ponctuel', value: false },
            { label: 'Chaque mois', value: true },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setRecurring(opt.value)}
              aria-pressed={recurring === opt.value}
              className={`py-3 rounded-xl font-semibold border-2 transition-colors ${
                recurring === opt.value
                  ? 'bg-teal text-white border-teal'
                  : 'border-gray-200 text-darkblue hover:border-teal'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-3" role="group" aria-label="Montant">
          {PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setPreset(value)
                setCustom('')
              }}
              aria-pressed={custom === '' && preset === value}
              className={`py-3 rounded-xl font-bold border-2 transition-colors ${
                custom === '' && preset === value
                  ? 'bg-darkblue text-white border-darkblue'
                  : 'border-gray-200 text-darkblue hover:border-darkblue'
              }`}
            >
              {value} €
            </button>
          ))}
        </div>

        <label className="block mb-5">
          <span className="text-sm text-darkblue/60">Ou un autre montant (€)</span>
          <input
            type="text"
            inputMode="decimal"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Ex. 35"
            className="mt-1 w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-teal focus:outline-none"
          />
        </label>

        {error && <p className="text-red-600 text-sm mb-3" role="alert">{error}</p>}

        <button
          type="button"
          onClick={donate}
          disabled={loading || !amount}
          className="w-full bg-teal text-white font-bold py-4 rounded-xl hover:bg-teal-600 disabled:opacity-50 transition-colors"
        >
          {loading
            ? 'Redirection…'
            : `Donner ${amount ? `${amount.replace('.', ',')} €` : ''}${recurring ? ' par mois' : ''}`}
        </button>
        <p className="text-xs text-darkblue/50 mt-3 text-center">
          Paiement sécurisé par Stripe.
          {recurring && ' Vous pouvez arrêter votre don mensuel à tout moment en nous écrivant.'}
        </p>
      </section>

      {bank && (
        <section className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <h2 className="flex items-center gap-2 font-playfair text-xl font-bold text-darkblue mb-2">
            <Landmark size={22} className="text-teal" /> Par virement bancaire
          </h2>
          <p className="text-sm text-darkblue/60 mb-4">
            Aucun frais de notre côté. Indiquez « Don » en libellé.
          </p>
          <CopyRow label="Titulaire du compte" value={bank.titulaire} />
          <CopyRow label="IBAN" value={bank.iban} />
          {bank.bic && <CopyRow label="BIC" value={bank.bic} />}
        </section>
      )}
    </div>
  )
}
