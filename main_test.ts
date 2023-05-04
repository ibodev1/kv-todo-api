import { assertEquals } from "$std/testing/asserts.ts"
import { Hono } from "hono"
import { getLastTodos } from './utils/lib.ts'
import { getAllSubjects } from "./utils/db/subject.ts"

Deno.test('Server Test', async () => {
  const app = new Hono()
  app.get('/', (c) => c.text('Please test me'))
  const res = await app.request('http://localhost/')
  assertEquals(res.status, 200)
})

Deno.test('Todo Test', async () => {
  const todos = await getLastTodos()
  assertEquals(todos.length > 0, true)

  const firstTodo = todos[0];
  assertEquals(typeof firstTodo.isDone, "boolean")
})

Deno.test('Subject Test', async () => {
  const subjects = await getAllSubjects()
  assertEquals(subjects.length > 0, true)
  
  const firstSubjet = subjects[0];
  assertEquals(typeof firstSubjet !== "undefined", true)
})