import { deleteSubject, getAllSubjects, insertSubject } from './utils/db/subject.ts';
import { deleteTodo, insertTodo } from './utils/db/todo.ts';
import { getLastTodos } from './utils/lib.ts';

Deno.bench(async function lastTodos() {
  await getLastTodos();
})

Deno.bench(async function Subjects() {
  await getAllSubjects();
})


// IAD = InsertAndDelete

Deno.bench(async function IADSubject() {
  // Insert
  const newSubjectId = await insertSubject("for delete");

  // Delete
  await deleteSubject(newSubjectId);
})

Deno.bench(async function IADTodoWithSubject() {
  // Insert Subject
  const newSubjectId = await insertSubject("for todo");

  // Insert Todos
  const newTodo1 = await insertTodo(newSubjectId, "for delete #1")
  const newTodo2 = await insertTodo(newSubjectId, "for delete #2")
  const newTodo3 = await insertTodo(newSubjectId, "for delete #3")

  // Delete todos
  await deleteTodo(newSubjectId, newTodo1);
  await deleteTodo(newSubjectId, newTodo2);
  await deleteTodo(newSubjectId, newTodo3);

  // Delete
  await deleteSubject(newSubjectId);
})
