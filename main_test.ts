import { assertEquals } from "https://deno.land/std@0.184.0/testing/asserts.ts"
import { Hono } from "hono"

Deno.test('Server Test', async () => {
  const app = new Hono()
  app.get('/', (c) => c.text('Please test me'))
  const res = await app.request('http://localhost/')
  assertEquals(res.status, 200)
})