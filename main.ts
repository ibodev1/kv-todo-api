import { serve } from "$std/http/server.ts"
import { Hono, Context } from "hono"
import { cors, prettyJSON } from "hono/middleware.ts"
import { HTTPException } from "hono/http-exception.ts"
import { Respond, Bindings, Variables } from './utils/types.ts'
import indexRouter from './routes/index.ts'
import todoRouter from './routes/todo.ts'
import subjectRouter from './routes/subject.ts'

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

//! Middleware
app.use("*", cors())
app.use("*", prettyJSON())
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set('X-Response-Time', `${start - end}`)
});

//! PORT
app.use("*", async (c, next) => {
  const port = Number(c.env.PORT ?? 5500)
  c.set("port", port)
  return await next()
})

//! Error Handle
app.onError((err: Error, c: Context) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
  c.status(500);
  return c.json<Respond>({
    status: "error",
    message: "Internal Server Error",
    responseTime: Date.now()
  })
})

//! Routes
app.route("/", indexRouter)
app.route("/todo", todoRouter)
app.route("/subject", subjectRouter)

//! Serve Func
serve(app.fetch, {
  port: Number(Deno.env.get("PORT") ?? 5500),
  onListen: ({ hostname, port }) => {
    const host = "0.0.0.0" !== hostname ? hostname : "localhost";
    console.info(`Listening on http://${host}:${port}`);
  }
})
