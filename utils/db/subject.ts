/*
 *
 * KV Database Todo App API
 * 
 */
import { nanoid } from "nanoid"
import { Subject } from '../types.ts'
import { deleteTodo, getAllTodos } from "./todo.ts"
import { del, get, insert, list, update } from "./generic.ts"

const insertSubject = async (title: string) => {
    try {
        const subject: Subject = {
            id: nanoid(),
            title,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        await insert(["subjects", subject.id], subject)
        return subject.id
    } catch (error) {
        throw error;
    }
}

const getAllSubjects = async () => {
    try {
        const subjects: Subject[] = await list<Subject>(["subjects"])
        return subjects;
    } catch (error) {
        throw error;
    }
}

const getSubject = async (id: string) => {
    try {
        return await get<Subject>(["subjects", id])
    } catch (error) {
        throw error;
    }
}

const updateSubject = async (id: string, { title }: { title: string }) => {
    try {
        const isUpdated = await update(["subjects", id], { title, updatedAt: Date.now() })
        return isUpdated
    } catch (error) {
        throw error
    }
}


const deleteSubject = async (id: string) => {
    try {
        const isDeleted = await del(["subjects", id])

        // Delete subject todos
        const subjectTodos = await getAllTodos(id)
        if (subjectTodos && subjectTodos.length > 0) {
            subjectTodos.forEach(async todo => {
                await deleteTodo(id, todo.id)
            });
        }
        return isDeleted
    } catch (error) {
        throw error
    }
}

export {
    getAllSubjects,
    getSubject,
    insertSubject,
    updateSubject,
    deleteSubject
}