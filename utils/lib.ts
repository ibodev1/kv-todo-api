import { getAllSubjects } from './db/subject.ts';
import { getAllTodos } from './db/todo.ts';
import { Todo } from './types.ts';

export const getLastTodos = async () => {
    let data: Todo[] = [];

    // Get subjects
    const subjects = await getAllSubjects();

    for await (const sub of subjects) {
        const todos = await getAllTodos(sub.id);
        data = [...data, ...todos];
    }
    return data;
}