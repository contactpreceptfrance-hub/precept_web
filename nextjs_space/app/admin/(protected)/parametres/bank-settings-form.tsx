'use client'

import { useState, useTransition } from 'react'
import { Landmark, CheckCircle2, AlertCircle } from 'lucide-react'
import { saveBankDetailsAction, type BankResult } from './bank-actions'
import type { BankDetails } from '@/lib/bank-config'

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all font-mono'
const labelClass = 'block text-sm font-semibold mb-1 text-darkblue'

export function BankSettingsForm({ initial }: { initial: BankDetails }) {
  const [isSaving, startSaving] = useTransition()
  const [status, setStatus] = useState<BankResult | null>(null)

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="flex items-center gap-2 font-playfair text-lg font-bold text-darkblue mb-1">
        <Landmark size={20} className="text-teal" /> Coordonnées bancaires (dons par virement)
      </h2>
      <p className="text-sm text-darkblue/60 mb-5">
        Affichées publiquement sur la page « Faire un don ». Videz l’IBAN pour masquer le bloc.
      </p>

      <form
        action={(formData) => startSaving(async () => setStatus(await saveBankDetailsAction(formData)))}
        className="space-y-4"
      >
        <div>
          <label className={labelClass} htmlFor="titulaire">Titulaire du compte</label>
          <input id="titulaire" name="titulaire" defaultValue={initial.titulaire} maxLength={100} className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="iban">IBAN</label>
          <input id="iban" name="iban" defaultValue={initial.iban} placeholder="FR76 …" autoComplete="off" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="bic">BIC</label>
          <input id="bic" name="bic" defaultValue={initial.bic} placeholder="BNPAFRPP" autoComplete="off" className={inputClass} />
        </div>

        {status && (
          <p
            role="status"
            className={`flex items-center gap-2 text-sm ${status.ok ? 'text-teal' : 'text-red-600'}`}
          >
            {status.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {status.ok ? status.message : status.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="bg-teal text-white font-bold px-6 py-2.5 rounded-xl hover:bg-teal-600 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </form>
    </section>
  )
}
