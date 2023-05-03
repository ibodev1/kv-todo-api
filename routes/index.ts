import { Hono } from "https://deno.land/x/hono@v3.1.8/mod.ts"
import { getAllTodos, insertTodo } from "../utils/db.ts";
import { Respond, Bindings, Variables } from '../utils/types.ts';

const indexRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()

indexRouter.get("/", async (c) => {
    try {
        const todos = await getAllTodos();
        return c.json<Respond>({
            status: "success",
            data: todos,
            responseTime: Date.now()
        });
    } catch (error) {
        c.status(500)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
});

indexRouter.post("/", async (c) => {
    try {
        const body = await c.req.json();
        if (!body?.title) {
            c.status(400);
            return c.json<Respond>({
                status: "error",
                message: "title is required!",
                responseTime: Date.now()
            })
        }

        if (body?.isDone && typeof body.isDone !== "boolean") {
            c.status(400);
            return c.json<Respond>({
                status: "error",
                message: "isDone type of only boolean!",
                responseTime: Date.now()
            })
        }

        const todoId = await insertTodo(body.title, body.isDone ?? false);
        if (todoId) {
            return c.json<Respond>({
                status: "success",
                message: "Todo id : " + todoId,
                responseTime: Date.now()
            })
        }
    } catch (error) {
        c.status(500)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
})

export default indexRouter;