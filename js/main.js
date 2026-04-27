import { getItems, createItem, deleteItem } from './api.js';

document.addEventListener('DOMContentLoaded', init);

let allItems = [];
let filteredItems = [];
let visibleCount = 8; // Збільшено для зручності

async function init() {
    initThemeToggle();
    
    // Подія закриття модалки
    document.getElementById('closeModal')?.addEventListener('click', () => {
        document.getElementById('modal').classList.add('hidden');
    });

    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortOrder = document.getElementById('sortOrder');
    
    searchInput?.addEventListener('input', applyFilters);
    categoryFilter?.addEventListener('change', applyFilters);
    sortOrder?.addEventListener('change', applyFilters);

    document.getElementById('itemForm')?.addEventListener('submit', handleFormSubmit);

    await initCatalog();
}

async function initCatalog() {
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('error-message');
    const emptyMsg = document.getElementById('empty-message');

    try {
        loader.classList.remove('hidden');
        errorMsg.classList.add('hidden');
        
        allItems = await getItems(); 
        
        loader.classList.add('hidden');
        if (allItems.length === 0) emptyMsg.classList.remove('hidden');
        else emptyMsg.classList.add('hidden');
        
        applyFilters();
    } catch (err) {
        loader.classList.add('hidden');
        errorMsg.classList.remove('hidden');
    }
}

function applyFilters() {
    const searchTerm = document.getElementById('search')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const sort = document.getElementById('sortOrder')?.value || 'default';

    filteredItems = allItems.filter(item => {
        const matchesSearch = item.title?.toLowerCase().includes(searchTerm) || 
                              item.description?.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || item.category === category;
        return matchesSearch && matchesCategory;
    });

    if (sort === 'price') filteredItems.sort((a, b) => a.price - b.price);
    else if (sort === 'title') filteredItems.sort((a, b) => a.title.localeCompare(b.title));

    updateCatalog();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newItem = Object.fromEntries(formData.entries());
    newItem.price = Number(newItem.price);
    
    const error = validateForm(newItem);
    if (error) { alert(error); return; }

    try {
        await createItem(newItem);
        e.target.reset();
        await initCatalog(); 
    } catch (err) { alert("Помилка при створенні!"); }
}

window.handleDelete = async (id) => {
    if (confirm("Видалити цей запис?")) {
        try {
            await deleteItem(id);
            await initCatalog();
        } catch (err) { alert("Помилка видалення!"); }
    }
};

window.showDetails = (id) => {
    const item = allItems.find(i => i.id == id);
    if (!item) return;
    const modal = document.getElementById('modal');
    document.getElementById('modal-body').innerHTML = `
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <p><strong>Ціна:</strong> ${item.price} грн</p>
        <p><strong>Категорія:</strong> ${item.category}</p>
    `;
    modal.classList.remove('hidden');
};

function updateCatalog() {
    const container = document.getElementById('catalog');
    container.innerHTML = filteredItems.slice(0, visibleCount).map(item => `
        <div class="card" onclick="showDetails(${item.id})">
            <h3>${item.title}</h3>
            <p><strong>Ціна:</strong> ${item.price} грн</p>
            <button onclick="event.stopPropagation(); handleDelete(${item.id})">🗑️ Видалити</button>
        </div>
    `).join('');
}

function initThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (localStorage.getItem('siteTheme') === 'dark') document.body.classList.add('theme-dark');
    btn?.addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        localStorage.setItem('siteTheme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
    });
}

function validateForm(data) {
    if (!data.title || data.title.length < 3) return "Назва має містити мінімум 3 символи.";
    if (!data.price || data.price <= 0) return "Вкажіть коректну ціну.";
    return null;
}