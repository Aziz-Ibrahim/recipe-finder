// Load Recipes from JSON
async function loadRecipes() {
    const res = await fetch('data/recipes.json');
    const recipes = await res.json();

    const grid = document.querySelector('.recipe-grid');
    grid.innerHTML = ''; // Clear grid before loading

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <div class="card-body">
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
                <a href="recipe.html?id=${recipe.id}">View Recipe</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Search Function
document.getElementById('search-btn').addEventListener('click', () => {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    filterRecipes(searchTerm);
});

function filterRecipes(term) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(term) ? 'block' : 'none';
    });
}

// On Page Load
window.onload = loadRecipes;