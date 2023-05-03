import { Hono } from "https://deno.land/x/hono@v3.1.8/mod.ts"
import { getAllTodos, getTodo, insertTodo, updateTodo } from "../utils/db.ts";
import { Respond, Bindings, Variables } from '../utils/types.ts';

const indexRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()


//! Get all todo route
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

//! Add new todo route
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

//! Get single todo route
indexRouter.get("/:id", async (c) => {
    try {
        const id = await c.req.param("id") ?? ""
        const todo = await getTodo(id)
        if (todo) {
            return c.json<Respond>({
                status: "success",
                data: todo,
                responseTime: Date.now()
            })
        } else {
            c.status(400)
            return c.json<Respond>({
                status: "error",
                message: "Todo not found!",
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

//! Update single todo route
indexRouter.put("/:id", async (c) => {
    try {
        const id = await c.req.param("id") ?? ""
        const body = await c.req.json()
        if (!body.title) throw new Error("Title is requires")

        const isUpdated = await updateTodo(id, {
            title: body.title,
            isDone: body?.isDone ?? false
        });
        if (isUpdated) {
            return c.json<Respond>({
                status: "success",
                message: id + " todo is updated!",
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