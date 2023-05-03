/*
 *
 * KV Database Todo App API
 * 
 */
import { Todo } from './types.ts';

const kv = await Deno.openKv();

const getTodos = async () => {
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

export {
    getTodos
}