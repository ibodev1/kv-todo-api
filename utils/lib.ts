import { getAllSubjects } from './db/subject.ts';
import { getAllTodos } from './db/todo.ts';
import { Todo, Subject } from './types.ts';

interface Value extends Todo {
    subject: Subject | undefined
}

export const getLastTodos = async () => {
    const data: Value[] = []
    let todos: Todo[] = []
    // Get subjects
    const subjects = await getAllSubjects();

    for await (const sub of subjects) {
        const allTodos = await getAllTodos(sub.id);
        todos = [...data, ...allTodos];
    }

    todos.forEach((todo) => {
        const value: Value = {
            ...todo,
            subject: subjects.find(sub => sub.id === todo.subjectId)
        }
        data.push(value)
    })

    return data;
}