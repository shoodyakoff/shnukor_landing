import { RESULT_GROUPS, type ProductItem } from "./data";

export const RESULT_EXACT_MATCH_LIMIT = 3;

export function buildResultGroups(items: ProductItem[]) {
  if (!items.length) return RESULT_GROUPS;

  const exact = items.slice(0, RESULT_EXACT_MATCH_LIMIT);
  const other = items.slice(RESULT_EXACT_MATCH_LIMIT);

  return [
    {
      title: "Точное попадание",
      sub: `Первые ${RESULT_EXACT_MATCH_LIMIT} позиции из выдачи API: совпадают с выбранными фильтрами и идут выше в порядке ранжирования.`,
      items: exact,
    },
    ...(other.length
      ? [
          {
            title: "Еще варианты",
            sub: "Остальные подходящие товары из той же выдачи, сохранены для выбора и сравнения.",
            items: other,
          },
        ]
      : []),
  ];
}
