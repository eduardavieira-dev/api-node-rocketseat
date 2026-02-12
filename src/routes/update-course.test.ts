import { test, expect } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { faker } from '@faker-js/faker'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'
import { makeCourse } from '../tests/factories/make-course.ts'

test('update a course', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser('manager')
  const course = await makeCourse()
  const newTitle = faker.lorem.words(4)

  const response = await request(server.server)
    .put(`/courses/${course.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ title: newTitle })

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    message: 'Course updated successfully',
  })
})

test('update a course without authentication returns 401', async () => {
  await server.ready()

  const course = await makeCourse()

  const response = await request(server.server)
    .put(`/courses/${course.id}`)
    .set('Content-Type', 'application/json')
    .send({ title: faker.lorem.words(4) })

  expect(response.status).toEqual(401)
})

test('update a course as student returns 401', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser('student')
  const course = await makeCourse()

  const response = await request(server.server)
    .put(`/courses/${course.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ title: faker.lorem.words(4) })

  expect(response.status).toEqual(401)
})

test('update a non-existent course returns 404', async () => {
  await server.ready()

  const { token } = await makeAuthenticatedUser('manager')
  const fakeId = faker.string.uuid()

  const response = await request(server.server)
    .put(`/courses/${fakeId}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({ title: faker.lorem.words(4) })

  expect(response.status).toEqual(404)
})
