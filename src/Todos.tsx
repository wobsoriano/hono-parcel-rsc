"use server-entry";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export async function Todos() {
  const resp = await fetch('https://jsonplaceholder.typicode.com/todos')
  const todos = await resp.json() as Todo[];
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}