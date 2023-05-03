import { Hono } from "https://deno.land/x/hono@v3.1.8/mod.ts"
import { Bindings, Variables } from '../utils/types.ts'
import { Todo } from '../utils/types.ts'
import { getAllSubjects } from "../utils/db/subject.ts"
import { getAllTodos } from "../utils/db/todo.ts"

const indexRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()

const getLastTodosWithSubject = async () => {
    let data: Todo[] = [];

    // Get subjects
    const subjects = await getAllSubjects();

    for await (const sub of subjects) {
        const todos = await getAllTodos(sub.id);
        data = [...data, ...todos];
    }
    return data;
}

type sortBy = "createdAt" | "updatedAt";

indexRouter.get("/", async (c) => {
    const sortBy: sortBy = await c.req.query("sort") as sortBy ?? "createdAt";
    const data = await getLastTodosWithSubject();
    data.sort((a, b) => new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime())
    return c.json(data.reverse())
});

export default indexRouter;