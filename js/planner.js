document.addEventListener('DOMContentLoaded', () => {
    loadRecipes();
    loadSavedPlan();
});

// Load recipes into the pool
async function loadRecipes() {
    const res = await fetch('../data/recipes.json');
    const recipes = await res.json();

    const pool = document.querySelector('.recipe-pool');
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.dataset.id = recipe.id;
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
        `;
        pool.appendChild(card);

        card.addEventListener('dragstart', dragStart);
    });
}

// Drag & Drop Functions
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

document.querySelectorAll('.day').forEach(day => {
    day.addEventListener('dragover', dragOver);
    day.addEventListener('drop', drop);
});

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const recipeId = e.dataTransfer.getData('text/plain');
    const card = document.querySelector(`[data-id="${recipeId}"]`).cloneNode(true);
    e.target.appendChild(card);
    savePlan();
}

// Save to Local Storage
function savePlan() {
    const plan = {};
    document.querySelectorAll('.day').forEach(day => {
        const recipes = [];
        day.querySelectorAll('.card').forEach(card => {
            recipes.push(card.dataset.id);
        });
        plan[day.dataset.day] = recipes;
    });
    localStorage.setItem('mealPlan', JSON.stringify(plan));
}

// Load Saved Plan from Local Storage
function loadSavedPlan() {
    const savedPlan = JSON.parse(localStorage.getItem('mealPlan')) || {};
    Object.keys(savedPlan).forEach(day => {
        const container = document.querySelector(`.day[data-day="${day}"]`);
        savedPlan[day].forEach(recipeId => {
            const card = document.querySelector(`[data-id="${recipeId}"]`).cloneNode(true);
            container.appendChild(card);
        });
    });
}

// Print Button Event
document.querySelector('.print-btn').addEventListener('click', () => {
    window.print();
});

// PDF Generation for Meal Planner
document.querySelector('.print-btn').addEventListener('click', () => {
    const element = document.querySelector('.planner-grid'); // Element to capture
    const options = {
        margin: 10,
        filename: 'weekly-meal-plan.pdf',
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 2
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    html2pdf().from(element).set(options).save();
});