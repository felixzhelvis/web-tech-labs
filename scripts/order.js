const selectedDishes = {
    soup: null,
    'main-course': null,
    drink: null
};

function renderDishes() {
    const categories = ['soup', 'main-course', 'drink'];

    categories.forEach(category => {
        const container = document.querySelector(`[data-category="${category}"] .dishes-grid`);
        if (!container) return;

        const categoryDishes = dishes
            .filter(dish => dish.category === category)
            .sort((a, b) => a.name.localeCompare(b.name, 'ru'));

        container.innerHTML = '';

        categoryDishes.forEach(dish => {
            const card = document.createElement('div');
            card.className = 'dish-card';
            card.dataset.dish = dish.keyword;

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
    const drink = selectedDishes.drink;

    const hasAnySelected = Boolean(soup || mainCourse || drink);

    const emptyMessage = document.getElementById('order-empty');
    const orderDetails = document.getElementById('order-details');

    const soupText = document.getElementById('order-soup-text');
    const mainCourseText = document.getElementById('order-main-course-text');
    const drinkText = document.getElementById('order-drink-text');
    const totalPriceEl = document.getElementById('order-total-price');

    const hiddenSoup = document.getElementById('hidden-soup');
    const hiddenMainCourse = document.getElementById('hidden-main-course');
    const hiddenDrink = document.getElementById('hidden-drink');

    if (hiddenSoup) hiddenSoup.value = soup ? soup.keyword : '';
    if (hiddenMainCourse) hiddenMainCourse.value = mainCourse ? mainCourse.keyword : '';
    if (hiddenDrink) hiddenDrink.value = drink ? drink.keyword : '';

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

    if (drink) {
        drinkText.textContent = `${drink.name} ${drink.price} ₽`;
        drinkText.classList.remove('not-selected');
    } else {
        drinkText.textContent = 'Напиток не выбран';
        drinkText.classList.add('not-selected');
    }

    let total = 0;
    if (soup) total += soup.price;
    if (mainCourse) total += mainCourse.price;
    if (drink) total += drink.price;

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
        selectedDishes.drink = null;

        document.querySelectorAll('.dish-card.selected').forEach(card => {
            card.classList.remove('selected');
        });

        setTimeout(updateOrderSummary, 0);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderDishes();
    updateOrderSummary();
    setupFormReset();
});
