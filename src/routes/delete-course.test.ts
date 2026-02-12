import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { faker } from '@faker-js/faker'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'
import { makeCourse } from '../tests/factories/make-course.ts'

test('delete a course', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser('manager')
  const course = await makeCourse()

  const response = await request(server.server)
    .delete(`/courses/${course.id}`)
    .set('Authorization', token)

  expect(response.status).toEqual(204)
})

test('delete a course without authentication returns 401', async () => {
  await server.ready()

  const course = await makeCourse()

  const response = await request(server.server)
    .delete(`/courses/${course.id}`)

  expect(response.status).toEqual(401)
})

test('delete a course as student returns 401', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser('student')
  const course = await makeCourse()

  const response = await request(server.server)
    .delete(`/courses/${course.id}`)
    .set('Authorization', token)

  expect(response.status).toEqual(401)
})

test('delete a non-existent course returns 404', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser('manager')
  const fakeId = faker.string.uuid()

  const response = await request(server.server)
    .delete(`/courses/${fakeId}`)
    .set('Authorization', token)

  expect(response.status).toEqual(404)
})
