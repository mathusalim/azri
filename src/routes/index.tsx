import { createFileRoute, Link } from '@tanstack/react-router'
import { getTrendingQuestions, getCategories } from '~/lib/queries'
import { QuestionCard } from '~/components/QuestionCard'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const [questions, categories] = await Promise.all([
      getTrendingQuestions(),
      getCategories(),
    ])
    return { questions, categories }
  },
})

function Home() {
  const { questions, categories } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">ტრენდული</h1>
        <p className="text-sm text-muted-foreground">
          აქტუალური კითხვები და დისკუსიები
        </p>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to="/category/$slug"
            params={{ slug: cat.slug }}
            className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:border-foreground/50 transition-colors"
            style={{ color: cat.color || undefined }}
          >
            {cat.icon} {cat.nameKa}
          </Link>
        ))}
      </div>

      {questions.length === 0 ? (
        <div className="rounded-lg border border-border p-8 text-center">
          <p className="text-muted-foreground">
            ჯერჯერობით აქტიური კითხვები არ არის.
          </p>
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