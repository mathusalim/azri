import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { searchQuestions } from '~/lib/queries'
import { QuestionCard } from '~/components/QuestionCard'

const searchSchema = z.object({
  q: z.string().optional().default(''),
})

const loadSearch = createServerFn({ method: 'GET' })
  .validator((d: unknown) => searchSchema.parse(d))
  .handler(async ({ data }) => {
    if (!data.q) return { questions: [], query: '' }
    const questions = await searchQuestions(data.q)
    return { questions, query: data.q }
  })

export const Route = createFileRoute('/search')({
  component: SearchPage,
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ q: search.q }),
  loader: async ({ deps }) => {
    return loadSearch({ data: { q: deps.q || '' } })
  },
})

function SearchPage() {
  const router = useRouter()
  const { q: queryParam } = Route.useSearch()
  const { questions } = Route.useLoaderData()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get('q') as string
    router.navigate({ to: '/search', search: { q } })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">ძიება</h1>
        <p className="text-sm text-muted-foreground">
          მოძებნე კითხვები სათაურით
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative flex gap-2">
        <input
          name="q"
          type="text"
          defaultValue={queryParam}
          placeholder="ჩაწერე საძიებო სიტყვა..."
          className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          ძიება
        </button>
      </form>

      {queryParam ? (
        questions.length === 0 ? (
          <div className="rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">
              შედეგები ვერ მოიძებნა &ldquo;{queryParam}&rdquo;-ისთვის
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              მოიძებნა {questions.length} შედეგი
            </p>
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-lg border border-border p-8 text-center">
          <p className="text-muted-foreground">ჩაწერე საძიებო სიტყვა</p>
        </div>
      )}
    </div>
  )
}