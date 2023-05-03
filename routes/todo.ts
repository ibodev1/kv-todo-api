import { Hono } from "https://deno.land/x/hono@v3.1.8/mod.ts"
import { getAllTodos, deleteTodo, getTodo, insertTodo, updateTodo } from "../utils/db/todo.ts";
import { Respond, Bindings, Variables } from '../utils/types.ts';

const todoRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()


//! Get all todo route
todoRouter.get("/:subjectId", async (c) => {
    try {
        const subjectId = await c.req.param("subjectId") ?? "";
        const todos = await getAllTodos(subjectId);
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
todoRouter.post("/:subjectId", async (c) => {
    try {
        const subjectId = await c.req.param("subjectId") ?? "";
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

        const todoId = await insertTodo(subjectId, body.title, body.isDone ?? false);
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
todoRouter.get("/:subjectId/:id", async (c) => {
    try {
        const subjectId = await c.req.param("subjectId") ?? "";
        const id = await c.req.param("id") ?? ""
        const todo = await getTodo(subjectId, id)
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
todoRouter.put("/:subjectId/:id", async (c) => {
    try {
        const subjectId = await c.req.param("subjectId") ?? "";
        const id = await c.req.param("id") ?? ""
        const body = await c.req.json()
        if (!body.title) throw new Error("Title is requires")

        const isUpdated = await updateTodo(subjectId, id, {
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

//! Delete todo route
todoRouter.delete("/:subjectId", async (c) => {
    try {
        const subjectId = await c.req.param("subjectId") ?? "";
        const { id } = await c.req.json()
        if (!id) throw new Error("id is required!");
        const isDeleted = await deleteTodo(subjectId, id);
        if (isDeleted) {
            return c.json<Respond>({
                status: "success",
                message: "todo is deleted!",
                responseTime: Date.now()
            })
        } else {
            c.status(400)
            return c.json<Respond>({
                status: "error",
                message: "todo is not deleted!",
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
export default todoRouter;