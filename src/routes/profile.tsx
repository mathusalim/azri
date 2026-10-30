import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  // TODO: Load user profile from session
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">პროფილი</h1>
        <p className="text-sm text-muted-foreground">
          შენი ანგარიშის ინფორმაცია
        </p>
      </div>

      <div className="rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
            ?
          </div>
          <div>
            <h2 className="text-lg font-semibold">მომხმარებელი</h2>
            <p className="text-sm text-muted-foreground">user@example.com</p>
          </div>
        </div>
      </div>

      {/* Voting history placeholder */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">ხმის მიცემის ისტორია</h3>
        <div className="rounded-lg border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">
            ჯერ ხმები არ გაქვს მიცემული.
          </p>
        </div>
      </div>
    </div>
  )
}