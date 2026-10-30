import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { signIn } from '~/lib/auth-client'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn.email({ email, password, callbackURL: '/' })
    } catch (err: any) {
      setError(err.message || 'შესვლა ვერ მოხერხდა')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 py-8">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">შესვლა</h1>
        <p className="text-sm text-muted-foreground">
          შედი ანგარიშში ხმის მისაცემად
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">ელ. ფოსტა</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">პაროლი</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'იტვირთება...' : 'შესვლა'}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">ან</span>
        </div>
      </div>

      <button
        onClick={() => signIn.social({ provider: 'google' })}
        className="w-full rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-accent transition-colors"
      >
        Google-ით შესვლა
      </button>

      <p className="text-center text-sm text-muted-foreground">
        არ გაქვს ანგარიში?{' '}
        <Link to="/register" className="font-medium underline hover:no-underline">
          რეგისტრაცია
        </Link>
      </p>
    </div>
  )
}