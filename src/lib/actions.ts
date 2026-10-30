import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { castVote, addComment } from '~/lib/queries'
import { getAuthSession } from '~/lib/session'

// ─── Vote ───────────────────────────────────────────────────────────

const voteSchema = z.object({
  questionId: z.string().uuid(),
  optionIndex: z.number().int().min(0),
})

export const submitVote = createServerFn({ method: 'POST' })
  .validator((d: unknown) => voteSchema.parse(d))
  .handler(async ({ data }) => {
    const session = await getAuthSession()
    if (!session?.user?.id) {
      return { success: false, error: 'გთხოვთ, შეხვიდეთ სისტემაში' }
    }

    await castVote(session.user.id, data.questionId, data.optionIndex)
    return { success: true }
  })

// ─── Comment ────────────────────────────────────────────────────────

const commentSchema = z.object({
  questionId: z.string().uuid(),
  content: z.string().min(1).max(2000),
  parentId: z.string().uuid().optional(),
})

export const submitComment = createServerFn({ method: 'POST' })
  .validator((d: unknown) => commentSchema.parse(d))
  .handler(async ({ data }) => {
    const session = await getAuthSession()
    if (!session?.user?.id) {
      return { success: false, error: 'გთხოვთ, შეხვიდეთ სისტემაში' }
    }

    const comment = await addComment(
      session.user.id,
      data.questionId,
      data.content,
      data.parentId
    )
    return { success: true, comment }
  })