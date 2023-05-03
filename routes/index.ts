import { Hono } from "https://deno.land/x/hono@v3.1.8/mod.ts"
import { getAllTodos } from "../utils/db.ts";

const indexRouter = new Hono();

indexRouter.get("/", async (c) => {
    const todos = await getAllTodos();
    return c.json(todos);
});

export default indexRouter;