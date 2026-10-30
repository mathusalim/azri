import { Link } from '@tanstack/react-router'
import type { QuestionOption } from '~/lib/schema'

export type QuestionCardData = {
  id: string
  titleKa: string
  descriptionKa: string | null
  options: QuestionOption[]
  status: string
  trendingScore: number
  categoryName: string | null
  categorySlug: string | null
  categoryColor: string | null
  totalVotes: number
  publishedAt: string | null
}

type Props = {
  question: QuestionCardData
}

export function QuestionCard({ question }: Props) {
  return (
    <Link
      to="/question/$questionId"
      params={{ questionId: question.id }}
      className="block rounded-xl border border-border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          {question.categoryName && (
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: question.categoryColor
                  ? `${question.categoryColor}20`
                  : 'var(--color-muted)',
                color: question.categoryColor || 'var(--color-muted-foreground)',
              }}
            >
              {question.categoryName}
            </span>
          )}
          <h2 className="text-lg font-semibold leading-snug">
            {question.titleKa}
          </h2>
          {question.descriptionKa && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {question.descriptionKa}
            </p>
          )}
        </div>
        {question.status === 'trending' && (
          <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
            🔥 ტრენდული
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span>{question.options.length} ვარიანტი</span>
        <span>{question.totalVotes} ხმა</span>
        {question.publishedAt && (
          <span>
            {new Date(question.publishedAt).toLocaleDateString('ka-GE')}
          </span>
        )}
      </div>
    </Link>
  )
}