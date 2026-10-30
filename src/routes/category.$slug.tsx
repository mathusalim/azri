import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getCategories, searchQuestions } from '~/lib/queries'
import { QuestionCard } from '~/components/QuestionCard'
import { db } from '~/lib/db'
import { questions, votes, categories as catTable } from '~/lib/schema'
import { eq, desc, sql, and, inArray, count } from 'drizzle-orm'

const loadCategory = createServerFn({ method: 'GET' })
  .validator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const category = await db
      .select()
      .from(catTable)
      .where(eq(catTable.slug, data.slug))
      .limit(1)

    if (category.length === 0) throw new Error('Category not found')

    const allCategories = await getCategories()

    const result = await db
      .select({
        id: questions.id,
        titleKa: questions.titleKa,
        descriptionKa: questions.descriptionKa,
        options: questions.options,
        status: questions.status,
        trendingScore: questions.trendingScore,
        categoryName: catTable.nameKa,
        categorySlug: catTable.slug,
        categoryColor: catTable.color,
        totalVotes: sql<number>`coalesce(count(${votes.id}), 0)::int`,
        publishedAt: questions.publishedAt,
      })
      .from(questions)
      .leftJoin(catTable, eq(questions.categoryId, catTable.id))
      .leftJoin(votes, eq(votes.questionId, questions.id))
      .where(and(eq(questions.categoryId, category[0].id), inArray(questions.status, ['active', 'trending', 'archived'])))
      .groupBy(questions.id, catTable.nameKa, catTable.slug, catTable.color)
      .orderBy(desc(questions.trendingScore))

    return {
      category: category[0],
      allCategories,
      questions: result.map((q) => ({ ...q, publishedAt: q.publishedAt?.toISOString() ?? null })),
    }
  })

export const Route = createFileRoute('/category/$slug')({
  component: CategoryPage,
  loader: async ({ params }) => {
    return loadCategory({ data: { slug: params.slug } })
  },
})

function CategoryPage() {
  const { category, allCategories, questions } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {category.icon && <span className="text-2xl">{category.icon}</span>}
          <h1 className="text-2xl font-bold tracking-tight">{category.nameKa}</h1>
        </div>
        {category.descriptionKa && (
          <p className="text-sm text-muted-foreground">{category.descriptionKa}</p>
        )}
      </div>

      {/* Category navigation */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <a
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              cat.slug === category.slug
                ? 'border-foreground bg-foreground text-background'
                : 'border-border hover:border-foreground/50'
            }`}
          >
            {cat.icon} {cat.nameKa}
          </a>
        ))}
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="rounded-lg border border-border p-8 text-center">
          <p className="text-muted-foreground">ამ კატეგორიაში კითხვები ჯერ არ არის.</p>
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