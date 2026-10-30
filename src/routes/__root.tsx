/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { NotFound } from '~/components/NotFound'
import { NavAuth } from '~/components/NavAuth'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'ერთი თემა — ტრენდული კითხვები' },
      {
        name: 'description',
        content: 'ხმის მიეცი ტრენდულ კითხვებს, ნახე შედეგები და ჩაერთე დისკუსიაში.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@300;400;500;600;700;800&display=swap',
      },
    ],
  }),
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight"
              activeProps={{ className: 'font-bold' }}
              activeOptions={{ exact: true }}
            >
              ერთი თემა
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/archive"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: 'text-foreground font-semibold' }}
              >
                არქივი
              </Link>
              <Link
                to="/search"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: 'text-foreground font-semibold' }}
              >
                ძიება
              </Link>
              <NavAuth />
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-3xl px-4 py-6">
          {children}
        </main>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}