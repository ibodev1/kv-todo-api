import { Hono } from "https://deno.land/x/hono@v3.1.8/mod.ts"
import { Bindings, Variables } from '../utils/types.ts';

const indexRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()

indexRouter.get("/", (c) => {
    return c.text("hi")
});

export default indexRouter;