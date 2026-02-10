export async function setup() {
  // Força o load de todos os arquivos para coverage
  await import('../routes/create-course.ts')
  await import('../routes/get-courses.ts')
  await import('../routes/get-course-by-id.ts')
  await import('../routes/update-course.ts')
  await import('../routes/delete-course.ts')
  await import('../database/client.ts')
  await import('../database/schema.ts')
}