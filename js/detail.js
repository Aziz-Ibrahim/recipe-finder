// Get Recipe ID from URL
const params = new URLSearchParams(window.location.search);
const recipeId = params.get('id');

async function loadRecipe() {
    const res = await fetch('data/recipes.json');
    const recipes = await res.json();

    const recipe = recipes.find(r => r.id == recipeId);

    if (recipe) {
        document.getElementById('recipe-name').textContent = recipe.name;
        document.getElementById('recipe-img').src = recipe.image;
        document.getElementById('recipe-desc').textContent = recipe.description;

        // Render Ingredients
        const ingredientList = document.getElementById('ingredients');
        recipe.ingredients.forEach(ing => {
            const li = document.createElement('li');
            li.textContent = ing;
            ingredientList.appendChild(li);
        });

        // Render Steps
        const steps = document.getElementById('steps');
        recipe.steps.forEach(step => {
            const p = document.createElement('p');
            p.textContent = step;
            steps.appendChild(p);
        });
    }
}

window.onload = loadRecipe;

// Print Recipe Logic
document.querySelector('.print-recipe-btn').addEventListener('click', () => {
    const recipeSection = document.querySelector('.recipe-detail');

    // Clone the recipe section for printing
    const clone = recipeSection.cloneNode(true);

    // Create a temporary print area
    const printWindow = window.open('', '_blank');
    printWindow.document.body.appendChild(clone);

    // Add basic styles for print
    printWindow.document.head.innerHTML += `
        <style>
            body { font-family: 'Georgia', serif; padding: 2rem; }
            h1, h3 { color: #333; }
            img { max-width: 100%; }
        </style>
    `;

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
});

// PDF Generation for Recipe
document.querySelector('.download-pdf-btn').addEventListener('click', () => {
    const element = document.querySelector('.recipe-detail');
    const options = {
        margin: 10,
        filename: 'recipe.pdf',
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