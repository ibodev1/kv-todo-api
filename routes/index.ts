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

type sortBy = "createdAt" | "updatedAt"

const sortKeys: sortBy[] = ["createdAt","updatedAt"]

indexRouter.get("/", async (c) => {
    let sortBy = sortKeys[0];
    const sortQuery = await c.req.query("sort") as sortBy ?? sortKeys[0];
    if(sortKeys.includes(sortQuery)) sortBy = sortQuery;
    const data = await getLastTodosWithSubject();
    data.sort((a, b) => new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime())
    return c.json(data.reverse())
});

export default indexRouter;