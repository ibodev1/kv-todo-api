import { Hono } from "https://deno.land/x/hono@v3.1.8/mod.ts"
import { getTodos } from "../utils/db.ts";

const indexRouter = new Hono();

indexRouter.get("/", async (c) => {
    const todos = await getTodos();
    return c.json(todos);
});

export default indexRouter;