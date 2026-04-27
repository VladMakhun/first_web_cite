const BASE_URL = 'http://localhost:3000/items';

export async function getItems() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Помилка завантаження');
  return await res.json();
}

// Функції для наступних завдань CRUD
export async function createItem(data) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function updateItem(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Помилка видалення');
  return true;
}