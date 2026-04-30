import { createFileRoute } from "@tanstack/react-router";
import Flow from "@/components/shnurok/Flow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Шнурок — умный подбор кроссовок под твой стиль и задачу" },
      {
        name: "description",
        content:
          "Ответь на несколько вопросов, выбери визуальный стиль и получи персональную подборку кроссовок: по размеру, цвету, бюджету и задаче.",
      },
      { property: "og:title", content: "Шнурок — умный подбор кроссовок" },
      {
        property: "og:description",
        content:
          "Сервис умного подбора кроссовок: размер, цвет, цена, задача, визуальный стиль — и точная подборка моделей.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <Flow />;
}
