import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { getQuestionById, getVoteResults, getComments } from '~/lib/queries'
import { submitVote, submitComment } from '~/lib/actions'
import { useSession } from '~/lib/auth-client'

const loadQuestion = createServerFn({ method: 'GET' })
  .validator((d: { questionId: string }) => d)
  .handler(async ({ data }) => {
    const question = await getQuestionById(data.questionId)
    if (!question) throw new Error('Question not found')
    const voteResults = await getVoteResults(data.questionId)
    const comments = await getComments(data.questionId)
    return { question, voteResults, comments }
  })

export const Route = createFileRoute('/question/$questionId')({
  component: QuestionDetail,
  loader: async ({ params }) => {
    return loadQuestion({ data: { questionId: params.questionId } })
  },
})

function QuestionDetail() {
  const router = useRouter()
  const { question, voteResults, comments } = Route.useLoaderData()
  const { data: session } = useSession()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [voting, setVoting] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  const totalVotes = voteResults.reduce((sum: number, r: any) => sum + r.count, 0)

  const getPercentage = (optionIndex: number) => {
    if (totalVotes === 0) return 0
    const result = voteResults.find((r: any) => r.optionIndex === optionIndex)
    return result ? Math.round((result.count / totalVotes) * 100) : 0
  }

  const handleVote = async (optionIndex: number) => {
    if (hasVoted || voting) return
    if (!session?.user) {
      router.navigate({ to: '/login' })
      return
    }
    setVoting(true)
    setSelectedOption(optionIndex)
    const result = await submitVote({ data: { questionId: question.id, optionIndex } })
    if (result.success) {
      setHasVoted(true)
    }
    setVoting(false)
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || submittingComment) return
    if (!session?.user) {
      router.navigate({ to: '/login' })
      return
    }
    setSubmittingComment(true)
    await submitComment({ data: { questionId: question.id, content: commentText.trim() } })
    setCommentText('')
    router.invalidate()
    setSubmittingComment(false)
  }

  return (
    <div className="space-y-6">
      {question.categoryName && (
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: question.categoryColor ? `${question.categoryColor}20` : undefined,
            color: question.categoryColor || undefined,
          }}
        >
          {question.categoryName}
        </span>
      )}

      <div className="space-y-2">
        <h1 className="text-2xl font-bold leading-tight">{question.titleKa}</h1>
        {question.descriptionKa && (
          <p className="text-muted-foreground">{question.descriptionKa}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {totalVotes} ხმა •{' '}
          {question.publishedAt ? new Date(question.publishedAt).toLocaleDateString('ka-GE') : ''}
        </p>
      </div>

      <Tabs.Root defaultValue="vote">
        <Tabs.List className="flex border-b border-border gap-4 mb-4">
          <Tabs.Trigger value="vote" className="px-3 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground transition-colors">
            ხმის მიცემა
          </Tabs.Trigger>
          <Tabs.Trigger value="results" className="px-3 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground transition-colors">
            შედეგები
          </Tabs.Trigger>
          <Tabs.Trigger value="discussion" className="px-3 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground transition-colors">
            დისკუსია ({comments.length})
          </Tabs.Trigger>
        </Tabs.List>

        {/* Vote Tab */}
        <Tabs.Content value="vote" className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.index}
              onClick={() => handleVote(option.index)}
              disabled={hasVoted}
              className={`w-full rounded-lg border p-4 text-left transition-all ${
                selectedOption === option.index ? 'border-foreground bg-foreground/5 font-medium' : 'border-border hover:border-foreground/30'
              } ${hasVoted ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className="text-sm">{option.labelKa}</span>
              {hasVoted && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 rounded-full bg-muted flex-1 overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${getPercentage(option.index)}%` }} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-10 text-right">{getPercentage(option.index)}%</span>
                </div>
              )}
            </button>
          ))}
          {hasVoted && <p className="text-xs text-muted-foreground text-center pt-2">თქვენი ხმა დაფიქსირდა ✓</p>}
        </Tabs.Content>

        {/* Results Tab */}
        <Tabs.Content value="results" className="space-y-3">
          {question.options.map((option) => (
            <div key={option.index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{option.labelKa}</span>
                <span className="font-medium">{getPercentage(option.index)}%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${getPercentage(option.index)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">
                {voteResults.find((r) => r.optionIndex === option.index)?.count ?? 0} ხმა
              </p>
            </div>
          ))}
          <p className="text-sm text-muted-foreground pt-2">სულ {totalVotes} ხმა</p>
        </Tabs.Content>

        {/* Discussion Tab */}
        <Tabs.Content value="discussion" className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">ჯერ კომენტარები არ არის. იყავი პირველი!</p>
          ) : (
            <div className="space-y-3">
              {comments.filter((c) => !c.parentId).map((comment) => (
                <div key={comment.id} className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {comment.userName?.charAt(0) ?? '?'}
                    </div>
                    <span className="text-sm font-medium">{comment.userName ?? 'ანონიმური'}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString('ka-GE')}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  {comments.filter((c) => c.parentId === comment.id).map((reply) => (
                    <div key={reply.id} className="ml-6 rounded-lg border-l-2 border-border pl-3 py-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{reply.userName ?? 'ანონიმური'}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(reply.createdAt).toLocaleDateString('ka-GE')}
                        </span>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Comment form */}
          <form onSubmit={handleComment} className="mt-6 space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={session?.user ? 'დაწერე კომენტარი...' : 'შესვლა საჭიროა კომენტარის დასაწერად'}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              disabled={!session?.user}
            />
            <div className="flex justify-end">
              {session?.user ? (
                <button
                  type="submit"
                  disabled={!commentText.trim() || submittingComment}
                  className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submittingComment ? 'იგზავნება...' : 'გაგზავნა'}
                </button>
              ) : (
                <a
                  href="/login"
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  შესვლა კომენტარისთვის
                </a>
              )}
            </div>
          </form>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}