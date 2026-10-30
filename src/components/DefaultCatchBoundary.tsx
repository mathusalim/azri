import { ErrorComponent, Link } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  console.error(error)
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center p-4">
      <h1 className="text-2xl font-bold">შეცდომა</h1>
      <p className="text-muted-foreground">
        რაღაც არასწორად მოხდა. გთხოვთ სცადოთ თავიდან.
      </p>
      <ErrorComponent error={error} />
      <Link to="/" className="text-sm font-medium underline hover:no-underline">
        მთავარ გვერდზე დაბრუნება
      </Link>
    </div>
  )
}