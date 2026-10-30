import { db } from './db'
import {
  questions,
  votes,
  categories,
  comments,
  user,
} from './schema'
import { eq, desc, sql, and, inArray, like, count } from 'drizzle-orm'

// ─── Questions ──────────────────────────────────────────────────────

export async function getTrendingQuestions(limit = 20) {
  const result = await db
    .select({
      id: questions.id,
      titleKa: questions.titleKa,
      descriptionKa: questions.descriptionKa,
      options: questions.options,
      status: questions.status,
      trendingScore: questions.trendingScore,
      categoryName: categories.nameKa,
      categorySlug: categories.slug,
      categoryColor: categories.color,
      totalVotes: sql<number>`coalesce(count(${votes.id}), 0)::int`,
      publishedAt: questions.publishedAt,
    })
    .from(questions)
    .leftJoin(categories, eq(questions.categoryId, categories.id))
    .leftJoin(votes, eq(votes.questionId, questions.id))
    .where(inArray(questions.status, ['active', 'trending'] as const))
    .groupBy(questions.id, categories.nameKa, categories.slug, categories.color)
    .orderBy(desc(questions.trendingScore), desc(questions.publishedAt))
    .limit(limit)

  return result.map((q) => ({
    ...q,
    publishedAt: q.publishedAt?.toISOString() ?? null,
  }))
}

export async function getArchivedQuestions(opts: {
  categoryId?: string
  page?: number
  limit?: number
}) {
  const { categoryId, page = 1, limit = 20 } = opts
  const offset = (page - 1) * limit

  const conditions = [eq(questions.status, 'archived' as const)]
  if (categoryId) conditions.push(eq(questions.categoryId, categoryId))

  const result = await db
    .select({
      id: questions.id,
      titleKa: questions.titleKa,
      descriptionKa: questions.descriptionKa,
      options: questions.options,
      status: questions.status,
      trendingScore: questions.trendingScore,
      categoryName: categories.nameKa,
      categorySlug: categories.slug,
      categoryColor: categories.color,
      totalVotes: sql<number>`coalesce(count(${votes.id}), 0)::int`,
      publishedAt: questions.publishedAt,
    })
    .from(questions)
    .leftJoin(categories, eq(questions.categoryId, categories.id))
    .leftJoin(votes, eq(votes.questionId, questions.id))
    .where(and(...conditions))
    .groupBy(questions.id, categories.nameKa, categories.slug, categories.color)
    .orderBy(desc(questions.publishedAt))
    .limit(limit)
    .offset(offset)

  return result.map((q) => ({
    ...q,
    publishedAt: q.publishedAt?.toISOString() ?? null,
  }))
}

export async function searchQuestions(query: string, limit = 20) {
  const result = await db
    .select({
      id: questions.id,
      titleKa: questions.titleKa,
      descriptionKa: questions.descriptionKa,
      options: questions.options,
      status: questions.status,
      trendingScore: questions.trendingScore,
      categoryName: categories.nameKa,
      categorySlug: categories.slug,
      categoryColor: categories.color,
      totalVotes: sql<number>`coalesce(count(${votes.id}), 0)::int`,
      publishedAt: questions.publishedAt,
    })
    .from(questions)
    .leftJoin(categories, eq(questions.categoryId, categories.id))
    .leftJoin(votes, eq(votes.questionId, questions.id))
    .where(like(questions.titleKa, `%${query}%`))
    .groupBy(questions.id, categories.nameKa, categories.slug, categories.color)
    .orderBy(desc(questions.trendingScore))
    .limit(limit)

  return result.map((q) => ({
    ...q,
    publishedAt: q.publishedAt?.toISOString() ?? null,
  }))
}
export async function getQuestionById(id: string) {
  const result = await db
    .select({
      id: questions.id,
      titleKa: questions.titleKa,
      descriptionKa: questions.descriptionKa,
      options: questions.options,
      status: questions.status,
      trendingScore: questions.trendingScore,
      categoryId: questions.categoryId,
      categoryName: categories.nameKa,
      categorySlug: categories.slug,
      categoryColor: categories.color,
      totalVotes: sql<number>`coalesce(count(${votes.id}), 0)::int`,
      publishedAt: questions.publishedAt,
      createdAt: questions.createdAt,
    })
    .from(questions)
    .leftJoin(categories, eq(questions.categoryId, categories.id))
    .leftJoin(votes, eq(votes.questionId, questions.id))
    .where(eq(questions.id, id))
    .groupBy(questions.id, categories.nameKa, categories.slug, categories.color)
    .limit(1)

  if (result.length === 0) return null
  const q = result[0]
  return {
    ...q,
    publishedAt: q.publishedAt?.toISOString() ?? null,
    createdAt: q.createdAt.toISOString(),
  }
}

// ─── Votes ──────────────────────────────────────────────────────────

export async function getVoteResults(questionId: string) {
  return db
    .select({ optionIndex: votes.optionIndex, count: count(votes.id) })
    .from(votes)
    .where(eq(votes.questionId, questionId))
    .groupBy(votes.optionIndex)
}

export async function getUserVote(questionId: string, userId: string) {
  const result = await db
    .select({ optionIndex: votes.optionIndex })
    .from(votes)
    .where(and(eq(votes.questionId, questionId), eq(votes.userId, userId)))
    .limit(1)
  return result[0] ?? null
}

export async function castVote(
  userId: string,
  questionId: string,
  optionIndex: number
) {
  await db
    .insert(votes)
    .values({ userId, questionId, optionIndex })
    .onConflictDoNothing()
}

// ─── Categories ─────────────────────────────────────────────────────

export async function getCategories() {
  return db.select().from(categories).orderBy(categories.nameKa)
}

// ─── Comments ───────────────────────────────────────────────────────

export async function getComments(questionId: string) {
  const result = await db
    .select({
      id: comments.id,
      content: comments.content,
      parentId: comments.parentId,
      createdAt: comments.createdAt,
      userId: comments.userId,
      userName: user.name,
      userImage: user.image,
    })
    .from(comments)
    .leftJoin(user, eq(comments.userId, user.id))
    .where(eq(comments.questionId, questionId))
    .orderBy(comments.createdAt)

  return result.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }))
}

export async function addComment(
  userId: string,
  questionId: string,
  content: string,
  parentId?: string
) {
  const result = await db
    .insert(comments)
    .values({ userId, questionId, content, parentId: parentId ?? null })
    .returning()
  return result[0]
}