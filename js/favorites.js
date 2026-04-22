document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('favorites-catalog');
  const emptyMsg = document.getElementById('empty-favorites');
  
  // Отримуємо ID з localStorage
  const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]');
  
  if (favoritesIds.length === 0) {
    emptyMsg.classList.remove('hidden');
    return;
  }

  // Завантажуємо всі дані, щоб знайти об'єкти за ID
  const response = await fetch('../data/items.json');
  const allItems = await response.json();
  
  // Фільтруємо ті, що є в обраному
  const favItems = allItems.filter(item => favoritesIds.includes(item.id));

  container.innerHTML = favItems.map(item => `
    <div class="card">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <button onclick="removeFromFavorites(${item.id})">Видалити</button>
    </div>
  `).join('');
});

function removeFromFavorites(id) {
  let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
  favs = favs.filter(favId => favId !== id);
  localStorage.setItem('favorites', JSON.stringify(favs));
  location.reload(); // Оновлюємо сторінку, щоб картка зникла
}