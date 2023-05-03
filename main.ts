import { serve } from "https://deno.land/std@0.185.0/http/server.ts"
import { Hono, Context } from "https://deno.land/x/hono@v3.1.8/mod.ts"
import { cors, prettyJSON } from "https://deno.land/x/hono@v3.1.8/middleware.ts"
import { HTTPException } from "https://deno.land/x/hono@v3.1.8/http-exception.ts"
import indexRouter from './routes/index.ts'
import { Respond ,Bindings,Variables} from './utils/types.ts';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

//! Middleware
app.use("*", cors());
app.use("*", prettyJSON());

//! PORT
app.use("*", async (c, next) => {
  const port = Number(c.env.PORT ?? 5500);
  c.set("port", port);
  return await next();
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

//! Serve Func
serve(app.fetch, {
  port: Number(Deno.env.get("PORT") ?? 5500),
  onListen: ({ hostname: _hostname, port }) => {
    console.info("Listening on http://localhost:" + port);
  }
})
