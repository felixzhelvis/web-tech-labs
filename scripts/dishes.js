const dishes = [
    {
        keyword: 'gaspacho',
        name: 'Гаспачо',
        price: 195,
        category: 'soup',
        count: '350 г',
        image: 'images/gaspacho.jpg',
        kind: 'veg'
    },
    {
        keyword: 'mushroom_soup',
        name: 'Грибной суп-пюре',
        price: 185,
        category: 'soup',
        count: '330 г',
        image: 'images/mushroom_soup.jpg',
        kind: 'veg'
    },
    {
        keyword: 'norwegian_soup',
        name: 'Норвежский суп',
        price: 270,
        category: 'soup',
        count: '340 г',
        image: 'images/norwegian_soup.jpg',
        kind: 'fish'
    },
    {
        keyword: 'fish_soup',
        name: 'Уха по-царски',
        price: 260,
        category: 'soup',
        count: '350 г',
        image: 'images/fish_soup.jpg',
        kind: 'fish'
    },
    {
        keyword: 'borscht',
        name: 'Борщ с говядиной',
        price: 210,
        category: 'soup',
        count: '350 г',
        image: 'images/borscht.jpg',
        kind: 'meat'
    },
    {
        keyword: 'solyanka',
        name: 'Солянка мясная сборная',
        price: 240,
        category: 'soup',
        count: '350 г',
        image: 'images/solyanka.jpg',
        kind: 'meat'
    },
    {
        keyword: 'fried_potatoes',
        name: 'Жареный картофель с грибами',
        price: 150,
        category: 'main-course',
        count: '250 г',
        image: 'images/fried_potatoes.jpg',
        kind: 'veg'
    },
    {
        keyword: 'vegetable_stew',
        name: 'Рагу из овощей',
        price: 160,
        category: 'main-course',
        count: '260 г',
        image: 'images/vegetable_stew.jpg',
        kind: 'veg'
    },
    {
        keyword: 'lasagna',
        name: 'Лазанья',
        price: 385,
        category: 'main-course',
        count: '310 г',
        image: 'images/lasagna.jpg',
        kind: 'meat'
    },
    {
        keyword: 'chicken_cutlet',
        name: 'Котлета по-киевски',
        price: 320,
        category: 'main-course',
        count: '280 г',
        image: 'images/chicken_cutlet.jpg',
        kind: 'meat'
    },
    {
        keyword: 'salmon_steak',
        name: 'Стейк из лосося с рисом',
        price: 450,
        category: 'main-course',
        count: '270 г',
        image: 'images/salmon_steak.jpg',
        kind: 'fish'
    },
    {
        keyword: 'baked_cod',
        name: 'Треска, запеченная с травами',
        price: 360,
        category: 'main-course',
        count: '280 г',
        image: 'images/baked_cod.jpg',
        kind: 'fish'
    },
    {
        keyword: 'caesar_chicken',
        name: 'Цезарь с цыпленком',
        price: 270,
        category: 'salad',
        count: '220 г',
        image: 'images/caesar_chicken.jpg',
        kind: 'meat'
    },
    {
        keyword: 'tuna_salad',
        name: 'Салат с тунцом и яйцом',
        price: 290,
        category: 'salad',
        count: '230 г',
        image: 'images/tuna_salad.jpg',
        kind: 'fish'
    },
    {
        keyword: 'greek_salad',
        name: 'Греческий салат',
        price: 240,
        category: 'salad',
        count: '230 г',
        image: 'images/greek_salad.jpg',
        kind: 'veg'
    },
    {
        keyword: 'caprese',
        name: 'Салат Капрезе с песто',
        price: 260,
        category: 'salad',
        count: '200 г',
        image: 'images/caprese.jpg',
        kind: 'veg'
    },
    {
        keyword: 'vinaigrette',
        name: 'Традиционный винегрет',
        price: 140,
        category: 'salad',
        count: '200 г',
        image: 'images/vinaigrette.jpg',
        kind: 'veg'
    },
    {
        keyword: 'spring_salad',
        name: 'Весенний овощной салат',
        price: 130,
        category: 'salad',
        count: '200 г',
        image: 'images/spring_salad.jpg',
        kind: 'veg'
    },
    {
        keyword: 'orange_juice',
        name: 'Апельсиновый сок',
        price: 120,
        category: 'drink',
        count: '300 мл',
        image: 'images/orange_juice.jpg',
        kind: 'cold'
    },
    {
        keyword: 'apple_juice',
        name: 'Яблочный сок',
        price: 90,
        category: 'drink',
        count: '300 мл',
        image: 'images/apple_juice.jpg',
        kind: 'cold'
    },
    {
        keyword: 'berry_mors',
        name: 'Морс клюквенный',
        price: 100,
        category: 'drink',
        count: '300 мл',
        image: 'images/berry_mors.jpg',
        kind: 'cold'
    },
    {
        keyword: 'black_tea',
        name: 'Чай черный с бергамотом',
        price: 80,
        category: 'drink',
        count: '300 мл',
        image: 'images/black_tea.jpg',
        kind: 'hot'
    },
    {
        keyword: 'green_tea',
        name: 'Чай зеленый с жасмином',
        price: 80,
        category: 'drink',
        count: '300 мл',
        image: 'images/green_tea.jpg',
        kind: 'hot'
    },
    {
        keyword: 'cappuccino',
        name: 'Капучино с корицей',
        price: 150,
        category: 'drink',
        count: '250 мл',
        image: 'images/cappuccino.jpg',
        kind: 'hot'
    },
    {
        keyword: 'donuts',
        name: 'Пончики с сахарной пудрой',
        price: 120,
        category: 'dessert',
        count: '100 г',
        image: 'images/donuts.jpg',
        kind: 'small'
    },
    {
        keyword: 'cupcake',
        name: 'Кекс шоколадный',
        price: 95,
        category: 'dessert',
        count: '90 г',
        image: 'images/cupcake.jpg',
        kind: 'small'
    },
    {
        keyword: 'panna_cotta',
        name: 'Панна-котта ягодная',
        price: 140,
        category: 'dessert',
        count: '120 г',
        image: 'images/panna_cotta.jpg',
        kind: 'small'
    },
    {
        keyword: 'cheesecake',
        name: 'Чизкейк Нью-Йорк',
        price: 190,
        category: 'dessert',
        count: '160 г',
        image: 'images/cheesecake.jpg',
        kind: 'medium'
    },
    {
        keyword: 'apple_pie',
        name: 'Теплый яблочный пирог',
        price: 175,
        category: 'dessert',
        count: '180 г',
        image: 'images/apple_pie.jpg',
        kind: 'medium'
    },
    {
        keyword: 'chocolate_cake',
        name: 'Торт Шоколадный брауни',
        price: 260,
        category: 'dessert',
        count: '260 г',
        image: 'images/chocolate_cake.jpg',
        kind: 'large'
    }
];
