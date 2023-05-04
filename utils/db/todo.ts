/*
 *
 * KV Database Todo App API
 * 
 */
import { nanoid } from "nanoid";
import { Todo } from '../types.ts';

const kv = await Deno.openKv();

const insertTodo = async (subjectId: string, title: string, isDone = false) => {
    try {
        const todo: Todo = {
            id: nanoid(),
            title,
            isDone,
            subjectId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        await kv.set(["todos", subjectId, todo.id], todo);
        return todo.id;
    } catch (error) {
        throw error;
    }
}

const getAllTodos = async (subjectId: string) => {
    try {
        const todos: Todo[] = [];
        for await (const iter of await kv.list<Todo>({ prefix: ["todos", subjectId] })) {
            todos.push(iter.value)
        }
        return todos;
    } catch (error) {
        throw error;
    }
}

const getTodo = async (subjectId: string, id: string) => {
    try {
        const res = await kv.get<Todo>(["todos", subjectId, id]);
        return res.value;
    } catch (error) {
        throw error;
    }
}

const updateTodo = async (subjectId: string, id: string, { title, isDone }: { title: string, isDone: boolean }) => {
    try {
        const key = ["todos", subjectId, id];
        const todoRes = await kv.get<Todo>(key)
        if (!todoRes.value) throw new Error("Todo is not found!");
        const todo: Todo = {
            ...todoRes.value,
            title,
            isDone,
            updatedAt: Date.now()
        }
        const updateRes = await kv.atomic()
            .check(todoRes)
            .set(key, todo)
            .commit();
        return updateRes !== null;
    } catch (error) {
        throw error;
    }
}


const deleteTodo = async (subjectId: string, id: string) => {
    try {
        const key = ["todos", subjectId, id];
        const todoRes = await kv.get<Todo>(key)
        if (!todoRes.value) throw new Error("Todo is not found!");
        const deleteRes = await kv.atomic()
            .check(todoRes)
            .delete(key)
            .commit()
        return deleteRes !== null;
    } catch (error) {
        throw error;
    }
}

export {
    getAllTodos,
    getTodo,
    insertTodo,
    updateTodo,
    deleteTodo
}