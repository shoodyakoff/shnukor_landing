export const INTRO_STEPS = [
  {
    id: "01",
    title: "Что ищешь",
    text: "Размер, цвет, бюджет и задачу соберем за пару коротких экранов.",
  },
  {
    id: "02",
    title: "Какой стиль",
    text: "Свайпом покажешь, какие силуэты реально нравятся визуально.",
  },
  {
    id: "03",
    title: "Твоя подборка",
    text: "На выходе получишь товарную выдачу с сильными совпадениями по характеру и фильтрам.",
  },
];

export type ProductItem = {
  brand: string;
  name: string;
  price: string;
  why: string;
  img: string;
  fit: string;
};

export const RESULT_GROUPS: Array<{
  title: string;
  sub: string;
  items: ProductItem[];
}> = [
  {
    title: "Точное попадание",
    sub: "Самые близкие по характеру, палитре и сценарию носки.",
    items: [
      {
        brand: "Nike",
        name: "Zoom Vomero 5",
        price: "14 990 ₽",
        why: "Техничный силуэт, спокойная палитра и сильное совпадение на каждый день.",
        img: "/result-nike-vomero-5.png",
        fit: "98% подходит",
      },
      {
        brand: "ASICS",
        name: "GEL-1130",
        price: "12 490 ₽",
        why: "Легкий беговой характер, носибельность каждый день, хороший баланс цены.",
        img: "/result-asics-gel-1130.png",
        fit: "95% подходит",
      },
      {
        brand: "New Balance",
        name: "990v6",
        price: "18 990 ₽",
        why: "Премиальные материалы и массивный, но универсальный силуэт.",
        img: "/result-new-balance-990v6.png",
        fit: "94% подходит",
      },
      {
        brand: "New Balance",
        name: "740",
        price: "13 490 ₽",
        why: "Ретро-беговой характер и мягкий повседневный контур без лишней тяжести.",
        img: "/result-new-balance-740.png",
        fit: "92% подходит",
      },
    ],
  },
  {
    title: "Чуть дороже, но стоит",
    sub: "Больше технологий, материалов и визуального характера.",
    items: [
      {
        brand: "Mizuno",
        name: "Wave Prophecy Moc",
        price: "26 490 ₽",
        why: "Футуристичная подошва и очень выразительная технологичная подача.",
        img: "/result-mizuno-wave-prophecy-moc.png",
        fit: "90% подходит",
      },
      {
        brand: "Nike",
        name: "Kobe 6 Protro",
        price: "29 990 ₽",
        why: "Агрессивный баскетбольный силуэт и заметный премиальный акцент.",
        img: "/result-nike-kobe-6-protro.png",
        fit: "88% подходит",
      },
      {
        brand: "New Balance",
        name: "204L",
        price: "22 990 ₽",
        why: "Более модная и тонкая альтернатива с дорогим технологичным ощущением.",
        img: "/result-new-balance-204l.png",
        fit: "86% подходит",
      },
    ],
  },
  {
    title: "Альтернатива",
    sub: "Чуть другой характер, но все еще в правильном настроении.",
    items: [
      {
        brand: "adidas",
        name: "Samba OG",
        price: "11 990 ₽",
        why: "Низкий ретро-силуэт и чистый городской образ без перегруза.",
        img: "/result-adidas-samba-og.png",
        fit: "82% подходит",
      },
      {
        brand: "Nike",
        name: "Total 90 III",
        price: "15 490 ₽",
        why: "Футбольный характер двухтысячных, если хочется более резкий и необычный силуэт.",
        img: "/result-nike-total-90-iii.png",
        fit: "80% подходит",
      },
    ],
  },
];
