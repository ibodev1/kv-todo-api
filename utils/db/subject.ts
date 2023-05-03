/*
 *
 * KV Database Todo App API
 * 
 */
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/nanoid.ts";
import { Subject } from '../types.ts';
import { deleteTodo, getAllTodos } from "./todo.ts";


const kv = await Deno.openKv();

const insertSubject = async (title: string) => {
    try {
        const subject: Subject = {
            id: nanoid(),
            title,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        await kv.set(["subjects", subject.id], subject);
        return subject.id;
    } catch (error) {
        throw error;
    }
}

const getAllSubjects = async () => {
    try {
        const subjects: Subject[] = [];
        for await (const iter of await kv.list<Subject>({ prefix: ["subjects"] })) {
            subjects.push(iter.value)
        }
        return subjects;
    } catch (error) {
        throw error;
    }
}

const getSubject = async (id: string) => {
    try {
        const res = await kv.get<Subject>(["subjects", id]);
        return res.value;
    } catch (error) {
        throw error;
    }
}

const updateSubject = async (id: string, { title }: { title: string }) => {
    try {
        const key = ["subjects", id];
        const subjectRes = await kv.get<Subject>(key)
        if (!subjectRes.value) throw new Error("Subject is not found!");
        const subject: Subject = {
            ...subjectRes.value,
            title,
            updatedAt: Date.now()
        }
        const updateRes = await kv.atomic()
            .check(subjectRes)
            .set(key, subject)
            .commit();
        return updateRes !== null;
    } catch (error) {
        throw error;
    }
}


const deleteSubject = async (id: string) => {
    try {
        const key = ["subjects", id];
        const subjectRes = await kv.get<Subject>(key)
        if (!subjectRes.value) throw new Error("Subject is not found!");
        const deleteRes = await kv.atomic()
            .check(subjectRes)
            .delete(key)
            .commit()

        // Delete subject todos
        const subjectTodos = await getAllTodos(id);
        if (subjectTodos && subjectTodos.length > 0) {
            subjectTodos.forEach(async todo => {
                await deleteTodo(id, todo.id);
            });
        }
        return deleteRes !== null;
    } catch (error) {
        throw error;
    }
}

export {
    getAllSubjects,
    getSubject,
    insertSubject,
    updateSubject,
    deleteSubject
}