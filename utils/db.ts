/*
 *
 * KV Database Todo App API
 * 
 */
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/nanoid.ts";
import { Todo } from './types.ts';


const kv = await Deno.openKv();

const insertTodo = async (title: string, isDone = false) => {
    try {
        const todo: Todo = {
            id: nanoid(),
            title,
            isDone,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        await kv.set(["todos", todo.id], todo);
        return todo.id;
    } catch (error) {
        throw error;
    }
}

const getAllTodos = async () => {
    try {
        const todos: Todo[] = [];
        for await (const iter of await kv.list<Todo>({ prefix: ["todos"] })) {
            todos.push(iter.value)
        }
        return todos;
    } catch (error) {
        throw error;
    }
}

const getTodo = async (id: string) => {
    try {
        const res = await kv.get<Todo>(["todos", id]);
        return res.value;
    } catch (error) {
        throw error;
    }
}

const updateTodo = async (id: string, { title, isDone }: { title: string, isDone: boolean }) => {
    try {
        const todoRes = await kv.get<Todo>(["todos", id])
        if (!todoRes.value) throw new Error("Todo is not found!");
        const todo: Todo = {
            ...todoRes.value,
            title,
            isDone,
            updatedAt: Date.now()
        }
        const updateRes = await kv.atomic()
            .check(todoRes)
            .set(["todos", id], todo)
            .commit();
        return updateRes !== null;
    } catch (error) {
        throw error;
    }
}

export {
    getAllTodos,
    getTodo,
    insertTodo,
    updateTodo
}