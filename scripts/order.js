let dishes = [];

const selectedDishes = {
    soup: null,
    'main-course': null,
    salad: null,
    drink: null,
    dessert: null
};

const activeFilters = {
    soup: null,
    'main-course': null,
    salad: null,
    drink: null,
    dessert: null
};

const categories = ['soup', 'main-course', 'salad', 'drink', 'dessert'];

async function loadDishes() {
    try {
        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
        if (!response.ok) {
            throw new Error('API error');
        }
        dishes = await response.json();
    } catch (error) {
        try {
            const fallbackResponse = await fetch('dishes.json');
            if (!fallbackResponse.ok) {
                throw new Error('Fallback error');
            }
            dishes = await fallbackResponse.json();
        } catch (fallbackError) {
            dishes = [];
        }
    }
    renderDishes();
    updateOrderSummary();
}

function renderCategoryDishes(category) {
    const container = document.querySelector(`[data-category="${category}"] .dishes-grid`);
    if (!container) return;

    let categoryDishes = dishes.filter(dish => dish.category === category);

    const currentFilter = activeFilters[category];
    if (currentFilter) {
        categoryDishes = categoryDishes.filter(dish => dish.kind === currentFilter);
    }

    categoryDishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    container.innerHTML = '';

    categoryDishes.forEach(dish => {
        const card = document.createElement('div');
        card.className = 'dish-card';
        card.dataset.dish = dish.keyword;

        if (selectedDishes[category] && selectedDishes[category].keyword === dish.keyword) {
            card.classList.add('selected');
        }

        card.innerHTML = `
            <img src="${dish.image}" alt="${dish.name}">
            <p class="dish-price">${dish.price} &#8381;</p>
            <p class="dish-name">${dish.name}</p>
            <p class="dish-count">${dish.count}</p>
            <button type="button">Добавить</button>
        `;

        card.addEventListener('click', () => {
            selectDish(dish);
        });

        container.appendChild(card);
    });
}

function renderDishes() {
    categories.forEach(category => {
        renderCategoryDishes(category);
    });
}

function setupFilters() {
    categories.forEach(category => {
        const section = document.querySelector(`[data-category="${category}"]`);
        if (!section) return;

        const filterButtons = section.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const kind = btn.dataset.kind;

                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    activeFilters[category] = null;
                } else {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    activeFilters[category] = kind;
                }

                renderCategoryDishes(category);
            });
        });
    });
}

function selectDish(dish) {
    selectedDishes[dish.category] = dish;

    const categoryContainer = document.querySelector(`[data-category="${dish.category}"] .dishes-grid`);
    if (categoryContainer) {
        const cards = categoryContainer.querySelectorAll('.dish-card');
        cards.forEach(card => {
            if (card.dataset.dish === dish.keyword) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }

    updateOrderSummary();
}

function updateOrderSummary() {
    const soup = selectedDishes.soup;
    const mainCourse = selectedDishes['main-course'];
    const salad = selectedDishes.salad;
    const drink = selectedDishes.drink;
    const dessert = selectedDishes.dessert;

    const hasAnySelected = Boolean(soup || mainCourse || salad || drink || dessert);

    const emptyMessage = document.getElementById('order-empty');
    const orderDetails = document.getElementById('order-details');

    const soupText = document.getElementById('order-soup-text');
    const mainCourseText = document.getElementById('order-main-course-text');
    const saladText = document.getElementById('order-salad-text');
    const drinkText = document.getElementById('order-drink-text');
    const dessertText = document.getElementById('order-dessert-text');
    const totalPriceEl = document.getElementById('order-total-price');

    const hiddenSoup = document.getElementById('hidden-soup');
    const hiddenMainCourse = document.getElementById('hidden-main-course');
    const hiddenSalad = document.getElementById('hidden-salad');
    const hiddenDrink = document.getElementById('hidden-drink');
    const hiddenDessert = document.getElementById('hidden-dessert');

    if (hiddenSoup) hiddenSoup.value = soup ? soup.keyword : '';
    if (hiddenMainCourse) hiddenMainCourse.value = mainCourse ? mainCourse.keyword : '';
    if (hiddenSalad) hiddenSalad.value = salad ? salad.keyword : '';
    if (hiddenDrink) hiddenDrink.value = drink ? drink.keyword : '';
    if (hiddenDessert) hiddenDessert.value = dessert ? dessert.keyword : '';

    if (!hasAnySelected) {
        if (emptyMessage) emptyMessage.classList.remove('hidden');
        if (orderDetails) orderDetails.classList.add('hidden');
        return;
    }

    if (emptyMessage) emptyMessage.classList.add('hidden');
    if (orderDetails) orderDetails.classList.remove('hidden');

    if (soup) {
        soupText.textContent = `${soup.name} ${soup.price} ₽`;
        soupText.classList.remove('not-selected');
    } else {
        soupText.textContent = 'Блюдо не выбрано';
        soupText.classList.add('not-selected');
    }

    if (mainCourse) {
        mainCourseText.textContent = `${mainCourse.name} ${mainCourse.price} ₽`;
        mainCourseText.classList.remove('not-selected');
    } else {
        mainCourseText.textContent = 'Блюдо не выбрано';
        mainCourseText.classList.add('not-selected');
    }

    if (salad) {
        saladText.textContent = `${salad.name} ${salad.price} ₽`;
        saladText.classList.remove('not-selected');
    } else {
        saladText.textContent = 'Блюдо не выбрано';
        saladText.classList.add('not-selected');
    }

    if (drink) {
        drinkText.textContent = `${drink.name} ${drink.price} ₽`;
        drinkText.classList.remove('not-selected');
    } else {
        drinkText.textContent = 'Напиток не выбран';
        drinkText.classList.add('not-selected');
    }

    if (dessert) {
        dessertText.textContent = `${dessert.name} ${dessert.price} ₽`;
        dessertText.classList.remove('not-selected');
    } else {
        dessertText.textContent = 'Десерт не выбран';
        dessertText.classList.add('not-selected');
    }

    let total = 0;
    if (soup) total += soup.price;
    if (mainCourse) total += mainCourse.price;
    if (salad) total += salad.price;
    if (drink) total += drink.price;
    if (dessert) total += dessert.price;

    if (totalPriceEl) {
        totalPriceEl.textContent = `${total} ₽`;
    }
}

function setupFormReset() {
    const orderForm = document.querySelector('.order-form');
    if (!orderForm) return;

    orderForm.addEventListener('reset', () => {
        selectedDishes.soup = null;
        selectedDishes['main-course'] = null;
        selectedDishes.salad = null;
        selectedDishes.drink = null;
        selectedDishes.dessert = null;

        document.querySelectorAll('.dish-card.selected').forEach(card => {
            card.classList.remove('selected');
        });

        setTimeout(updateOrderSummary, 0);
    });
}

function getOrderValidationMessage() {
    const soup = Boolean(selectedDishes.soup);
    const main = Boolean(selectedDishes['main-course']);
    const salad = Boolean(selectedDishes.salad);
    const drink = Boolean(selectedDishes.drink);
    const dessert = Boolean(selectedDishes.dessert);

    if (!soup && !main && !salad && !drink && !dessert) {
        return 'Ничего не выбрано. Выберите блюда для заказа';
    }

    const isValidFood = (soup && main && salad) ||
                        (soup && main && !salad) ||
                        (soup && !main && salad) ||
                        (!soup && main && salad) ||
                        (!soup && main && !salad);

    if (isValidFood && !drink) {
        return 'Выберите напиток';
    }

    if (soup && !main && !salad) {
        return 'Выберите главное блюдо/салат/стартер';
    }

    if (salad && !soup && !main) {
        return 'Выберите суп или главное блюдо';
    }

    if (!soup && !main && !salad && (drink || dessert)) {
        return 'Выберите главное блюдо';
    }

    return null;
}

function showNotification(message) {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal-window';

    const text = document.createElement('p');
    text.className = 'modal-message';
    text.textContent = message;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'modal-btn';
    btn.textContent = 'Окей';

    btn.addEventListener('click', () => {
        overlay.remove();
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.remove();
        }
    });

    modal.appendChild(text);
    modal.appendChild(btn);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);
}

function setupOrderValidation() {
    const orderForm = document.querySelector('.order-form');
    if (!orderForm) return;

    orderForm.addEventListener('submit', (event) => {
        const message = getOrderValidationMessage();
        if (message) {
            event.preventDefault();
            showNotification(message);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDishes();
    setupFilters();
    setupFormReset();
    setupOrderValidation();
});