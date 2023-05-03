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
        return await kv.get<Todo>(["todos", id])
    } catch (error) {
        throw error;
    }
}

export {
    getAllTodos,
    getTodo,
    insertTodo
}