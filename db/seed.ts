import { db } from '../src/lib/db'
import { categories, questions } from '../src/lib/schema'

const SEED_CATEGORIES = [
  { nameKa: 'პოლიტიკა', slug: 'politics', icon: '🏛', color: '#dc2626' },
  { nameKa: 'სპორტი', slug: 'sports', icon: '⚽', color: '#16a34a' },
  { nameKa: 'ტექნოლოგია', slug: 'tech', icon: '💻', color: '#2563eb' },
  { nameKa: 'კულტურა', slug: 'culture', icon: '🎭', color: '#9333ea' },
  { nameKa: 'საზოგადოება', slug: 'society', icon: '👥', color: '#ea580c' },
  { nameKa: 'ეკონომიკა', slug: 'economy', icon: '📈', color: '#0891b2' },
  { nameKa: 'განათლება', slug: 'education', icon: '📚', color: '#4f46e5' },
  { nameKa: 'გართობა', slug: 'entertainment', icon: '🎬', color: '#e11d48' },
]

const SEED_QUESTIONS = [
  {
    titleKa: 'რომელი სოციალური ქსელია შენთვის ყველაზე გამოსადეგი?',
    descriptionKa: 'აირჩიე ის პლატფორმა, რომელსაც ყველაზე ხშირად და ეფექტურად იყენებ.',
    options: [
      { index: 0, labelKa: 'Instagram' },
      { index: 1, labelKa: 'TikTok' },
      { index: 2, labelKa: 'Facebook' },
      { index: 3, labelKa: 'X (Twitter)' },
      { index: 4, labelKa: 'YouTube' },
    ],
    categorySlug: 'entertainment',
    status: 'trending' as const,
    trendingScore: 95,
  },
  {
    titleKa: 'უნდა თუ არა საქართველოს ევროკავშირში გაწევრიანება?',
    descriptionKa: 'ეს კითხვა აქტუალურია ქართული საზოგადოებისთვის. რას ფიქრობ?',
    options: [
      { index: 0, labelKa: 'დიახ, აუცილებლად' },
      { index: 1, labelKa: 'კი, მაგრამ ეტაპობრივად' },
      { index: 2, labelKa: 'არა, სხვა გზა სჯობს' },
      { index: 3, labelKa: 'ვერ ვიტყვი' },
    ],
    categorySlug: 'politics',
    status: 'trending' as const,
    trendingScore: 88,
  },
  {
    titleKa: 'რომელი პროგრამირების ენა უნდა ისწავლო პირველად?',
    descriptionKa: 'თუ ახალბედა დეველოპერი ხარ, რომელი ენიდან დაიწყებდი?',
    options: [
      { index: 0, labelKa: 'JavaScript / TypeScript' },
      { index: 1, labelKa: 'Python' },
      { index: 2, labelKa: 'Rust' },
      { index: 3, labelKa: 'Go' },
      { index: 4, labelKa: 'Java / Kotlin' },
    ],
    categorySlug: 'tech',
    status: 'active' as const,
    trendingScore: 72,
  },
  {
    titleKa: 'ქართული ფეხბურთი — სად ვართ ახლა?',
    descriptionKa: 'შეაფასე საქართველოს ეროვნული ნაკრების მიმდინარე ფორმა.',
    options: [
      { index: 0, labelKa: 'კარგი მიმართულებით მივდივართ 🚀' },
      { index: 1, labelKa: 'საშუალო, მაგრამ იმედის მომცემი' },
      { index: 2, labelKa: 'სუსტი, ბევრი რამ უნდა შეიცვალოს' },
    ],
    categorySlug: 'sports',
    status: 'active' as const,
    trendingScore: 65,
  },
  {
    titleKa: 'ქართული კინო — რომელი ფილმია შენი ფავორიტი?',
    descriptionKa: 'ყველა დროის საუკეთესო ქართული ფილმი შენი აზრით.',
    options: [
      { index: 0, labelKa: 'მიმინო' },
      { index: 1, labelKa: 'ფიროსმანი' },
      { index: 2, labelKa: 'მონანიება' },
      { index: 3, labelKa: 'სხვა' },
    ],
    categorySlug: 'culture',
    status: 'active' as const,
    trendingScore: 50,
  },
  {
    titleKa: 'დისტანციური მუშაობა თუ ოფისიდან?',
    descriptionKa: 'რომელი სამუშაო ფორმატი გირჩევნია?',
    options: [
      { index: 0, labelKa: 'მხოლოდ დისტანციური' },
      { index: 1, labelKa: 'ჰიბრიდული (ორივე)' },
      { index: 2, labelKa: 'მხოლოდ ოფისიდან' },
    ],
    categorySlug: 'society',
    status: 'active' as const,
    trendingScore: 45,
  },
]

async function seed() {
  console.log('🌱 Seeding categories...')

  const insertedCategories = await db
    .insert(categories)
    .values(SEED_CATEGORIES)
    .onConflictDoNothing()
    .returning()

  console.log(`✅ Inserted ${insertedCategories.length} categories`)

  // Get all categories to map slugs to IDs
  const allCategories = await db.select().from(categories)
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]))

  console.log('🌱 Seeding questions...')

  const questionsToInsert = SEED_QUESTIONS.map((q) => ({
    titleKa: q.titleKa,
    descriptionKa: q.descriptionKa,
    options: q.options,
    categoryId: categoryMap.get(q.categorySlug) ?? null,
    status: q.status,
    trendingScore: q.trendingScore,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  const insertedQuestions = await db
    .insert(questions)
    .values(questionsToInsert)
    .onConflictDoNothing()
    .returning()

  console.log(`✅ Inserted ${insertedQuestions.length} questions`)
  console.log('🎉 Seed complete!')

  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})