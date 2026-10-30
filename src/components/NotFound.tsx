import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground text-lg">გვერდი ვერ მოიძებნა</p>
      <Link to="/" className="text-sm font-medium underline hover:no-underline">
        მთავარ გვერდზე დაბრუნება
      </Link>
    </div>
  )
}