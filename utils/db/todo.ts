/*
 *
 * KV Database Todo App API
 * 
 */
import { nanoid } from "nanoid"
import { Todo } from '../types.ts'
import { del, get, insert, list, update } from "./generic.ts"

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
        await insert(["todos", subjectId, todo.id], todo)
        return todo.id
    } catch (error) {
        throw error
    }
}

const getAllTodos = async (subjectId: string) => {
    try {
        const todos: Todo[] = await list<Todo>(["todos", subjectId])
        return todos
    } catch (error) {
        throw error
    }
}

const getTodo = async (subjectId: string, id: string) => {
    try {
        return await get<Todo>(["todos", subjectId, id])
    } catch (error) {
        throw error
    }
}

const updateTodo = async (subjectId: string, id: string, { title, isDone }: { title: string, isDone: boolean }) => {
    try {
        const isUpdated = await update(["todos", subjectId, id], { title, isDone, updatedAt: Date.now() })
        return isUpdated
    } catch (error) {
        throw error
    }
}


const deleteTodo = async (subjectId: string, id: string) => {
    try {
        return await del<Todo>(["todos", subjectId, id])
    } catch (error) {
        throw error
    }
}

export {
    getAllTodos,
    getTodo,
    insertTodo,
    updateTodo,
    deleteTodo
}