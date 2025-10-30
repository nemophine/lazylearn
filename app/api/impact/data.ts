export interface User {
  id: number;
  name: string;
  gems: number;
}

export let users: User[] = [
  { id: 1, name: "Alice", gems: 100 },
  { id: 2, name: "Bob", gems: 50 },
];

export let heartPoints = 850000;
