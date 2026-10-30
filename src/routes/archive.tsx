import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getArchivedQuestions, getCategories } from '~/lib/queries'
import { QuestionCard } from '~/components/QuestionCard'

const searchSchema = z.object({
  category: z.string().optional(),
  page: z.coerce.number().optional().default(1),
})

const loadArchive = createServerFn({ method: 'GET' })
  .validator((d: unknown) => searchSchema.parse(d))
  .handler(async ({ data }) => {
    const [questions, categories] = await Promise.all([
      getArchivedQuestions({ categoryId: data.category, page: data.page }),
      getCategories(),
    ])
    return { questions, categories }
  })

export const Route = createFileRoute('/archive')({
  component: ArchivePage,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ category: search.category, page: search.page }),
  loader: async ({ deps }) => {
    return loadArchive({ data: { category: deps.category, page: deps.page || 1 } })
  },
})

function ArchivePage() {
  const { questions, categories } = Route.useLoaderData()
  const { category: activeCategory } = Route.useSearch()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">არქივი</h1>
        <p className="text-sm text-muted-foreground">
          წინა კითხვები და მათი შედეგები
        </p>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        <Link
          to="/archive"
          search={{ category: undefined, page: 1 }}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            !activeCategory
              ? 'border-foreground bg-foreground text-background'
              : 'border-border hover:border-foreground/50'
          }`}
        >
          ყველა
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to="/archive"
            search={{ category: cat.id, page: 1 }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === cat.id
                ? 'border-foreground bg-foreground text-background'
                : 'border-border hover:border-foreground/50'
            }`}
            style={{
              color: activeCategory === cat.id ? undefined : (cat.color || undefined),
            }}
          >
            {cat.icon} {cat.nameKa}
          </Link>
        ))}
      </div>

      {/* Questions list */}
      {questions.length === 0 ? (
        <div className="rounded-lg border border-border p-8 text-center">
          <p className="text-muted-foreground">არქივი ცარიელია.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  )
}