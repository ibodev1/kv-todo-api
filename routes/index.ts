import { Hono } from "hono"
import { Bindings, Variables } from '../utils/types.ts'
import { getLastTodos } from '../utils/lib.ts';

const indexRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()

indexRouter.get("/", async (c) => {
    const data = await getLastTodos();
    data.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
    return c.json(data.reverse())
});

export default indexRouter;