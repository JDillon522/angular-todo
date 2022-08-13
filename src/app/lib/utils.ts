export function clone<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}

export function sortTodos(a, b): number {
  if (a.id > b.id) {
    return -1;
  }
  if (a.id < b.id) {
    return 1;
  }
  return 0;
}
