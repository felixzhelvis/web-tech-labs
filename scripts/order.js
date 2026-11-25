const catalogUrl = 'https://cdn.jsdelivr.net/gh/felixzhelvis/web-tech-labs@main/dishes.json';
const cartKey = 'moslunch-cart';
const categories = ['soup', 'main-course', 'salad', 'drink', 'dessert'];
const emptyLabels = {
    soup: 'Не выбран',
    'main-course': 'Не выбрано',
    salad: 'Не выбран',
    drink: 'Не выбран',
    dessert: 'Не выбран'
};

let dishes = [];
const selectedDishes = {};
const activeFilters = {};

async function loadCatalog(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Каталог недоступен');

    const catalog = await response.json();
    if (!Array.isArray(catalog) || !catalog.length) throw new Error('Каталог пуст');
    return catalog;
}

async function loadDishes() {
    try {
        dishes = await loadCatalog(catalogUrl);
    } catch {
        dishes = await loadCatalog('dishes.json');
    }
}

function readCartIds() {
    try {
        const ids = JSON.parse(localStorage.getItem(cartKey));
        return Array.isArray(ids) ? ids : [];
    } catch {
        return [];
    }
}

function restoreCart() {
    const ids = readCartIds();
    categories.forEach(category => {
        selectedDishes[category] = dishes.find(dish =>
            dish.category === category && ids.includes(dish.id)
        );
    });
}

function getSelectedDishes() {
    return categories.map(category => selectedDishes[category]).filter(Boolean);
}

function saveCart() {
    const ids = getSelectedDishes().map(dish => dish.id);
    if (ids.length) {
        localStorage.setItem(cartKey, JSON.stringify(ids));
    } else {
        localStorage.removeItem(cartKey);
    }
}

function createDishCard(dish, buttonText) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.dataset.dish = dish.keyword;
    card.innerHTML = `
        <img alt="">
        <p class="dish-price"></p>
        <p class="dish-name"></p>
        <p class="dish-count"></p>
        <button type="button"></button>
    `;

    const image = card.querySelector('img');
    image.src = dish.image;
    image.alt = dish.name;
    card.querySelector('.dish-price').textContent = `${dish.price} ₽`;
    card.querySelector('.dish-name').textContent = dish.name;
    card.querySelector('.dish-count').textContent = dish.count;
    const button = card.querySelector('button');
    button.textContent = buttonText;
    button.setAttribute('aria-label', `${buttonText}: ${dish.name}`);
    return card;
}

function renderCategoryDishes(category) {
    const container = document.querySelector(`[data-category="${category}"] .dishes-grid`);
    const kind = activeFilters[category];
    const categoryDishes = dishes.filter(dish =>
        dish.category === category && (!kind || dish.kind === kind)
    );
    categoryDishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    container.replaceChildren();
    categoryDishes.forEach(dish => {
        const card = createDishCard(dish, 'Добавить');
        card.addEventListener('click', () => {
            selectedDishes[category] = dish;
            saveCart();
            updateSelection(category);
            updateCheckoutPanel();
        });
        container.appendChild(card);
    });
    updateSelection(category);
}

function updateSelection(category) {
    const cards = document.querySelectorAll(`[data-category="${category}"] .dish-card`);
    cards.forEach(card => {
        const selected = card.dataset.dish === selectedDishes[category]?.keyword;
        card.classList.toggle('selected', selected);
        card.querySelector('button').setAttribute('aria-pressed', selected);
    });
}

function setupFilters() {
    categories.forEach(category => {
        const section = document.querySelector(`[data-category="${category}"]`);
        const buttons = section.querySelectorAll('.filter-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const kind = button.dataset.kind;
                activeFilters[category] = activeFilters[category] === kind ? null : kind;
                buttons.forEach(filter => {
                    const active = filter.dataset.kind === activeFilters[category];
                    filter.classList.toggle('active', active);
                    filter.setAttribute('aria-pressed', active);
                });
                renderCategoryDishes(category);
            });
            button.setAttribute('aria-pressed', 'false');
        });
    });
}

function getTotal(dishes) {
    return dishes.reduce((total, dish) => total + dish.price, 0);
}

function updateCheckoutPanel() {
    const selected = getSelectedDishes();
    const panel = document.getElementById('checkout-panel');
    const link = document.getElementById('checkout-link');
    document.getElementById('checkout-total').textContent = `${getTotal(selected)} ₽`;
    panel.classList.toggle('hidden', selected.length === 0);

    const disabled = Boolean(getOrderValidationMessage());
    link.setAttribute('aria-disabled', disabled);
    if (disabled) {
        link.removeAttribute('href');
    } else {
        link.href = 'order.html';
    }
}

function renderCart() {
    const selected = getSelectedDishes();
    const container = document.getElementById('cart-dishes');
    const emptyMessage = document.getElementById('cart-empty');
    emptyMessage.classList.toggle('hidden', selected.length > 0);
    container.replaceChildren();

    selected.forEach(dish => {
        const card = createDishCard(dish, 'Удалить');
        card.querySelector('button').addEventListener('click', () => {
            delete selectedDishes[dish.category];
            saveCart();
            renderCart();
            const nextButton = container.querySelector('button');
            (nextButton || emptyMessage.querySelector('a')).focus();
        });
        container.appendChild(card);
    });

    categories.forEach(category => {
        const dish = selectedDishes[category];
        const label = document.getElementById(`order-${category}-text`);
        label.textContent = dish ? `${dish.name} — ${dish.price} ₽` : emptyLabels[category];
        label.classList.toggle('not-selected', !dish);
        document.getElementById(`hidden-${category}`).value = dish ? dish.id : '';
    });
    document.getElementById('order-total-price').textContent = `${getTotal(selected)} ₽`;
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

function showNotification(message, previousFocus = document.activeElement) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal-window';
    modal.setAttribute('role', 'alertdialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'notification-text');

    const text = document.createElement('p');
    text.className = 'modal-message';
    text.id = 'notification-text';
    text.textContent = message;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'modal-btn';
    btn.textContent = 'Окей';

    function closeNotification() {
        overlay.remove();
        previousFocus.focus();
    }

    btn.addEventListener('click', closeNotification);
    overlay.addEventListener('click', event => {
        if (event.target === overlay) closeNotification();
    });
    overlay.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeNotification();
        if (event.key === 'Tab') event.preventDefault();
    });

    modal.appendChild(text);
    modal.appendChild(btn);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);
    btn.focus();
}

function setupCheckoutForm(form) {
    const submitButton = form.querySelector('.btn-submit');
    const resetButton = form.querySelector('.btn-reset');
    const deliveryTime = form.elements.delivery_time;

    function updateDeliveryFields() {
        const byTime = form.elements.delivery_type.value === 'by_time';
        deliveryTime.required = byTime;
        deliveryTime.disabled = !byTime;
    }

    form.addEventListener('change', updateDeliveryFields);
    form.addEventListener('reset', () => setTimeout(updateDeliveryFields, 0));
    updateDeliveryFields();
    submitButton.disabled = false;

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (submitButton.disabled) return;

        const message = getOrderValidationMessage();
        if (message) {
            showNotification(message);
            return;
        }

        const order = new FormData(form);
        if (order.get('delivery_type') === 'by_time') {
            const moscowTime = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Europe/Moscow',
                hour: '2-digit',
                minute: '2-digit',
                hourCycle: 'h23'
            }).format(new Date());
            if (order.get('delivery_time') < moscowTime) {
                showNotification('Укажите время доставки, которое ещё не прошло.');
                return;
            }
        }
        order.set('subscribe', form.elements.subscribe.checked ? '1' : '0');

        const sentCart = JSON.stringify(getSelectedDishes().map(dish => dish.id));
        const removeButtons = document.querySelectorAll('#cart-dishes button');
        removeButtons.forEach(button => { button.disabled = true; });
        resetButton.disabled = true;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправляем…';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new URLSearchParams(order)
            });
            if (!response.ok) throw new Error('Заказ не принят.');
        } catch {
            if (JSON.stringify(readCartIds()) !== sentCart) {
                restoreCart();
                renderCart();
            }
            showNotification('Не удалось отправить заказ. Ваш выбор сохранён. Попробуйте ещё раз.', submitButton);
            return;
        } finally {
            removeButtons.forEach(button => { button.disabled = false; });
            resetButton.disabled = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить';
        }

        if (JSON.stringify(readCartIds()) === sentCart) {
            localStorage.removeItem(cartKey);
        }
        restoreCart();
        form.reset();
        renderCart();
        showNotification('Заказ отправлен.', submitButton);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('.order-form');
    const status = document.getElementById('catalog-status');

    try {
        await loadDishes();
    } catch {
        status.textContent = 'Не удалось загрузить меню. Обновите страницу, чтобы повторить попытку.';
        return;
    }

    status.classList.add('hidden');
    restoreCart();

    if (form) {
        renderCart();
        setupCheckoutForm(form);
    } else {
        setupFilters();
        categories.forEach(renderCategoryDishes);
        updateCheckoutPanel();
    }

    function refreshCart() {
        if (form && form.querySelector('.btn-submit').disabled) return;
        restoreCart();
        if (form) {
            renderCart();
        } else {
            categories.forEach(updateSelection);
            updateCheckoutPanel();
        }
    }

    window.addEventListener('pageshow', event => {
        if (event.persisted) refreshCart();
    });
    window.addEventListener('storage', event => {
        if (event.storageArea === localStorage && (event.key === cartKey || event.key === null)) {
            refreshCart();
        }
    });
});
