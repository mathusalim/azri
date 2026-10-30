import { Link, useRouter } from '@tanstack/react-router'
import { useSession, signOut } from '~/lib/auth-client'

export function NavAuth() {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  if (isPending) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    )
  }

  if (!session?.user) {
    return (
      <Link
        to="/login"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        activeProps={{ className: 'text-foreground font-semibold' }}
      >
        შესვლა
      </Link>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    router.invalidate()
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        to="/profile"
        className="flex items-center gap-2 text-sm font-medium hover:text-foreground transition-colors"
      >
        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
          {session.user.name?.charAt(0)?.toUpperCase() ?? '?'}
        </div>
        <span className="hidden sm:inline">{session.user.name}</span>
      </Link>
      <button
        onClick={handleSignOut}
        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
      >
        გამოსვლა
      </button>
    </div>
  )
}