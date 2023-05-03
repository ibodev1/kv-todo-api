import { serve } from "https://deno.land/std@0.185.0/http/server.ts"
import { Hono } from "https://deno.land/x/hono@v3.1.8/mod.ts"
import indexRouter from './routes/index.ts';

const PORT = Number(Deno.env.get("PORT") ?? 5500);

const app = new Hono()

app.route("/", indexRouter);

serve(app.fetch, {
  port: PORT,
  onListen: ({ hostname, port }) => {
    console.info("Listening on http://localhost:" + port);
  }
})
