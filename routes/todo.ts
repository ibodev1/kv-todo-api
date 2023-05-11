import { Hono } from "hono"
import { getAllTodos, deleteTodo, getTodo, insertTodo, updateTodo } from "../utils/db/todo.ts"
import { Respond, Bindings, Variables } from '../utils/types.ts'
import { BAD_REQUEST_STATUS_CODE, SERVER_ERROR_STATUS_CODE, DEFAULT_PARAM } from '../utils/constants.ts'

const todoRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()

//! Get all todo
todoRouter.get("/:subjectId", async (c) => {
    try {
        const subjectId = await c.req.param("subjectId") ?? DEFAULT_PARAM;
        const todos = await getAllTodos(subjectId);
        return c.json<Respond>({
            status: "success",
            data: todos,
            responseTime: Date.now()
        });
    } catch (error) {
        c.status(SERVER_ERROR_STATUS_CODE)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
});

//! Add new todo
todoRouter.post("/:subjectId", async (c) => {
    try {
        const subjectId = await c.req.param("subjectId") ?? DEFAULT_PARAM;
        const body = await c.req.json();
        if (!body?.title) {
            c.status(BAD_REQUEST_STATUS_CODE);
            return c.json<Respond>({
                status: "error",
                message: "title is required!",
                responseTime: Date.now()
            })
        }

        if (body?.isDone && typeof body.isDone !== "boolean") {
            c.status(BAD_REQUEST_STATUS_CODE);
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
                data: todoId,
                responseTime: Date.now()
            })
        }
    } catch (error) {
        c.status(SERVER_ERROR_STATUS_CODE)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
})

//! Get single todo
todoRouter.get("/:subjectId/:id", async (c) => {
    try {
        const subjectId = await c.req.param("subjectId") ?? DEFAULT_PARAM;
        const id = await c.req.param("id") ?? DEFAULT_PARAM
        const todo = await getTodo(subjectId, id)
        if (todo) {
            return c.json<Respond>({
                status: "success",
                data: todo,
                responseTime: Date.now()
            })
        } else {
            c.status(BAD_REQUEST_STATUS_CODE)
            return c.json<Respond>({
                status: "error",
                message: "Todo not found!",
                responseTime: Date.now()
            })
        }
    } catch (error) {
        c.status(SERVER_ERROR_STATUS_CODE)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
})

//! Update single todo
todoRouter.put("/:subjectId/:id", async (c) => {
    try {
        const subjectId = await c.req.param("subjectId") ?? DEFAULT_PARAM
        const id = await c.req.param("id") ?? DEFAULT_PARAM
        const body = await c.req.json()
        if (!body.title) throw new Error("Title is requires")

        const isUpdated = await updateTodo(subjectId, id, {
            title: body.title,
            isDone: body?.isDone ?? false
        });
        if (isUpdated) {
            return c.json<Respond>({
                status: "success",
                data: id,
                responseTime: Date.now()
            })
        }
    } catch (error) {
        c.status(SERVER_ERROR_STATUS_CODE)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
})

//! Delete todo
todoRouter.delete("/:subjectId", async (c) => {
    try {
        const subjectId = await c.req.param("subjectId") ?? DEFAULT_PARAM;
        const { id } = await c.req.json()
        if (!id) throw new Error("id is required!");
        const isDeleted = await deleteTodo(subjectId, id);
        if (isDeleted) {
            return c.json<Respond>({
                status: "success",
                data: id,
                responseTime: Date.now()
            })
        } else {
            c.status(BAD_REQUEST_STATUS_CODE)
            return c.json<Respond>({
                status: "error",
                message: "todo is not deleted!",
                responseTime: Date.now()
            })
        }
    } catch (error) {
        c.status(SERVER_ERROR_STATUS_CODE)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
})
export default todoRouter;