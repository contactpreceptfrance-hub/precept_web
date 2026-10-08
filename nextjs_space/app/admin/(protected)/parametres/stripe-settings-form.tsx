'use client'

import { useState, useTransition } from 'react'
import {
  KeyRound,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Lock,
} from 'lucide-react'
import type { StripeAdminSettings, StripeMode } from '@/lib/stripe-config'
import {
  saveStripeSettingsAction,
  testStripeConnectionAction,
  clearStripeKeyAction,
  ActionResult,
} from './actions'

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all font-mono'
const labelClass = 'block text-sm font-semibold mb-1 text-darkblue'
const hintClass = 'text-xs text-darkblue/50 mt-1'

export function StripeSettingsForm({
  initialSettings,
  webhookUrl,
}: {
  initialSettings: StripeAdminSettings
  webhookUrl: string
}) {
  const [selectedMode, setSelectedMode] = useState<StripeMode>(initialSettings.mode)
  const [copied, setCopied] = useState(false)

  // Input states
  const [testSecretKey, setTestSecretKey] = useState('')
  const [testWebhookSecret, setTestWebhookSecret] = useState('')
  const [liveSecretKey, setLiveSecretKey] = useState('')
  const [liveWebhookSecret, setLiveWebhookSecret] = useState('')

  // Action status states
  const [isSaving, startSaving] = useTransition()
  const [saveStatus, setSaveStatus] = useState<ActionResult | null>(null)

  const [testModeTestStatus, setTestModeTestStatus] = useState<ActionResult<{ livemode: boolean }> | null>(null)
  const [isTestingTestMode, setIsTestingTestMode] = useState(false)

  const [liveModeTestStatus, setLiveModeTestStatus] = useState<ActionResult<{ livemode: boolean }> | null>(null)
  const [isTestingLiveMode, setIsTestingLiveMode] = useState(false)

  const [isClearing, setIsClearing] = useState<string | null>(null)

  function copyWebhook() {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  async function handleTestConnection(mode: StripeMode) {
    const candidate = mode === 'test' ? testSecretKey : liveSecretKey
    if (mode === 'test') {
      setIsTestingTestMode(true)
      setTestModeTestStatus(null)
    } else {
      setIsTestingLiveMode(true)
      setLiveModeTestStatus(null)
    }

    try {
      const res = await testStripeConnectionAction(mode, candidate || undefined)
      if (mode === 'test') {
        setTestModeTestStatus(res)
      } else {
        setLiveModeTestStatus(res)
      }
    } catch {
      const fallback: ActionResult<{ livemode: boolean }> = {
        ok: false,
        error: 'Erreur inattendue lors de la vérification Stripe.',
      }
      if (mode === 'test') setTestModeTestStatus(fallback)
      else setLiveModeTestStatus(fallback)
    } finally {
      if (mode === 'test') setIsTestingTestMode(false)
      else setIsTestingLiveMode(false)
    }
  }

  async function handleClearKey(settingKey: string) {
    if (!confirm('Voulez-vous supprimer cette clé enregistrée en base ? Le système reviendra au fallback .env.')) {
      return
    }

    setIsClearing(settingKey)
    try {
      const res = await clearStripeKeyAction(settingKey)
      setSaveStatus(res)
    } catch {
      setSaveStatus({ ok: false, error: 'Impossible de supprimer la clé.' })
    } finally {
      setIsClearing(null)
    }
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaveStatus(null)

    const formData = new FormData()
    formData.set('mode', selectedMode)
    if (testSecretKey.trim()) formData.set('testSecretKey', testSecretKey.trim())
    if (testWebhookSecret.trim()) formData.set('testWebhookSecret', testWebhookSecret.trim())
    if (liveSecretKey.trim()) formData.set('liveSecretKey', liveSecretKey.trim())
    if (liveWebhookSecret.trim()) formData.set('liveWebhookSecret', liveWebhookSecret.trim())

    startSaving(async () => {
      try {
        const res = await saveStripeSettingsAction(formData)
        setSaveStatus(res)
        if (res.ok) {
          // Reset inputs on success so placeholders take over
          setTestSecretKey('')
          setTestWebhookSecret('')
          setLiveSecretKey('')
          setLiveWebhookSecret('')
        }
      } catch {
        setSaveStatus({ ok: false, error: 'Erreur lors de l’enregistrement.' })
      }
    })
  }

  const renderBadge = (keyStatus: StripeAdminSettings['testSecretKey'], keyDbName: string) => {
    if (keyStatus.source === 'database') {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal/10 text-teal border border-teal/20">
            <ShieldCheck size={12} />
            En base (chiffrée)
          </span>
          <button
            type="button"
            onClick={() => handleClearKey(keyDbName)}
            disabled={isClearing === keyDbName}
            title="Effacer de la base et revenir à .env"
            className="text-darkblue/40 hover:text-red-600 transition-colors p-1"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )
    }
    if (keyStatus.source === 'env') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Fallback .env
        </span>
      )
    }
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
        Non configurée
      </span>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Save Notification */}
      {saveStatus && (
        <div
          role="status"
          className={`p-4 rounded-xl flex items-start gap-3 text-sm ${
            saveStatus.ok
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {saveStatus.ok ? (
            <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
          )}
          <div>
            <p className="font-semibold">{saveStatus.ok ? 'Succès' : 'Attention'}</p>
            <p>{saveStatus.ok ? saveStatus.message : saveStatus.error}</p>
          </div>
        </div>
      )}

      {/* Mode Selector Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-darkblue flex items-center gap-2">
              <Zap size={18} className="text-teal" />
              Environnement actif de paiement
            </h2>
            <p className="text-sm text-darkblue/60 mt-0.5">
              Sélectionnez si la boutique utilise les clés de test ou les clés de production.
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              selectedMode === 'live'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {selectedMode === 'live' ? 'Mode Production' : 'Mode Test'}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <label
            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMode === 'test'
                ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="mode_radio"
              value="test"
              checked={selectedMode === 'test'}
              onChange={() => setSelectedMode('test')}
              className="mt-1 text-teal focus:ring-teal"
            />
            <div>
              <p className="font-bold text-darkblue text-sm flex items-center gap-1.5">
                🟡 Mode Test (Staging / Tests)
              </p>
              <p className="text-xs text-darkblue/60 mt-1">
                Permet de tester les achats avec les cartes de crédit de test Stripe. Aucun compte réel n’est débité.
              </p>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMode === 'live'
                ? 'border-green-600 bg-green-50/40 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="mode_radio"
              value="live"
              checked={selectedMode === 'live'}
              onChange={() => setSelectedMode('live')}
              className="mt-1 text-teal focus:ring-teal"
            />
            <div>
              <p className="font-bold text-darkblue text-sm flex items-center gap-1.5">
                🟢 Mode Production (Transactions réelles)
              </p>
              <p className="text-xs text-darkblue/60 mt-1">
                Utilisé pour encaisser les paiements réels des clients de la boutique Precept France.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Webhook Configuration Guide Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-darkblue flex items-center gap-2 mb-1">
          <RefreshCw size={18} className="text-teal" />
          Point de terminaison Webhook Stripe
        </h2>
        <p className="text-sm text-darkblue/60 mb-4">
          Dans le tableau de bord Stripe (Développeurs &gt; Webhooks), ajoutez ce point de terminaison pour l’événement{' '}
          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono text-darkblue font-semibold">
            checkout.session.completed
          </code>
          .
        </p>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3">
          <code className="text-xs sm:text-sm font-mono text-darkblue flex-1 select-all break-all">
            {webhookUrl}
          </code>
          <button
            type="button"
            onClick={copyWebhook}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold hover:border-gray-300 text-darkblue transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check size={13} className="text-green-600" />
                Copié !
              </>
            ) : (
              <>
                <Copy size={13} />
                Copier
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Test Credentials */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-darkblue flex items-center gap-2">
              <KeyRound size={17} className="text-amber-600" />
              Clés Stripe — Mode Test
            </h2>
            <p className="text-xs text-darkblue/60 mt-0.5">
              Préfixes habituels : <code className="font-mono">sk_test_...</code> et{' '}
              <code className="font-mono">whsec_...</code>
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleTestConnection('test')}
            disabled={isTestingTestMode}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-300 bg-amber-50/50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isTestingTestMode ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <Zap size={13} />
            )}
            Tester la connexion (Test)
          </button>
        </div>

        {testModeTestStatus && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              testModeTestStatus.ok
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {testModeTestStatus.ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            <span>{testModeTestStatus.ok ? testModeTestStatus.message : testModeTestStatus.error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="testSecretKey" className={labelClass}>
                Clé secrète de test
              </label>
              {renderBadge(initialSettings.testSecretKey, 'stripe_test_secret_key')}
            </div>
            <input
              id="testSecretKey"
              name="testSecretKey"
              type="password"
              autoComplete="off"
              value={testSecretKey}
              onChange={(e) => setTestSecretKey(e.target.value)}
              placeholder={initialSettings.testSecretKey.masked || 'sk_test_...'}
              className={inputClass}
            />
            <p className={hintClass}>
              Laissez vide pour conserver la clé actuelle. Chiffrée en AES-256-GCM avant stockage.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="testWebhookSecret" className={labelClass}>
                Secret de signature Webhook test
              </label>
              {renderBadge(initialSettings.testWebhookSecret, 'stripe_test_webhook_secret')}
            </div>
            <input
              id="testWebhookSecret"
              name="testWebhookSecret"
              type="password"
              autoComplete="off"
              value={testWebhookSecret}
              onChange={(e) => setTestWebhookSecret(e.target.value)}
              placeholder={initialSettings.testWebhookSecret.masked || 'whsec_...'}
              className={inputClass}
            />
            <p className={hintClass}>
              Trouvé dans Développeurs &gt; Webhooks &gt; Point de terminaison &gt; Secret de signature.
            </p>
          </div>
        </div>
      </div>

      {/* Mode Production (Live) Credentials */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-darkblue flex items-center gap-2">
              <Lock size={17} className="text-green-600" />
              Clés Stripe — Mode Production (Live)
            </h2>
            <p className="text-xs text-darkblue/60 mt-0.5">
              Préfixes habituels : <code className="font-mono">sk_live_...</code> et{' '}
              <code className="font-mono">whsec_...</code>
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleTestConnection('live')}
            disabled={isTestingLiveMode}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-green-300 bg-green-50/50 hover:bg-green-100 text-green-900 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isTestingLiveMode ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <Zap size={13} />
            )}
            Tester la connexion (Live)
          </button>
        </div>

        {liveModeTestStatus && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              liveModeTestStatus.ok
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {liveModeTestStatus.ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            <span>{liveModeTestStatus.ok ? liveModeTestStatus.message : liveModeTestStatus.error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="liveSecretKey" className={labelClass}>
                Clé secrète de production
              </label>
              {renderBadge(initialSettings.liveSecretKey, 'stripe_live_secret_key')}
            </div>
            <input
              id="liveSecretKey"
              name="liveSecretKey"
              type="password"
              autoComplete="off"
              value={liveSecretKey}
              onChange={(e) => setLiveSecretKey(e.target.value)}
              placeholder={initialSettings.liveSecretKey.masked || 'sk_live_...'}
              className={inputClass}
            />
            <p className={hintClass}>
              Laissez vide pour conserver la clé actuelle. Chiffrée en AES-256-GCM avant stockage.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="liveWebhookSecret" className={labelClass}>
                Secret de signature Webhook production
              </label>
              {renderBadge(initialSettings.liveWebhookSecret, 'stripe_live_webhook_secret')}
            </div>
            <input
              id="liveWebhookSecret"
              name="liveWebhookSecret"
              type="password"
              autoComplete="off"
              value={liveWebhookSecret}
              onChange={(e) => setLiveWebhookSecret(e.target.value)}
              placeholder={initialSettings.liveWebhookSecret.masked || 'whsec_...'}
              className={inputClass}
            />
            <p className={hintClass}>
              Secret de signature de l’endpoint webhook de production.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 rounded-xl bg-teal text-white font-semibold text-sm hover:bg-teal/90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
          {isSaving ? 'Enregistrement en cours...' : 'Enregistrer la configuration Stripe'}
        </button>
      </div>
    </form>
  )
}
