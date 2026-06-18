# Tinder sport image audit

## Scope

- App cards checked in `src/components/shnurok/sneakers-mapping.ts`: 5 daily cards and 32 sport cards.
- Source folder checked: `Shnurok MVP Visual`.
- Old ready-made combined cards were ignored for generation references. These are usually vertical `1.png`, `2.png`, `3-2.png`, `4-2.png`, `5.png`, etc. with multiple shoes and text.
- Single-product references were counted from files such as `IMG_*`, `photo_*`, `.jpg`, `.jpeg`, `.png`, `.webp` inside the matching category folders.
- Current app format for generated examples: square `1254 x 1254`, no text, clean studio product collage, light abstract background, podiums/risers in the daily-card style.
- For surface-specific cards, the sport surface belongs on the top of the podiums/risers under the shoes, not as a flat field/court covering the whole lower half of the frame.
- Product models must be matched to the single-product reference photos in the exact category folder. Do not invent unrelated sneaker/boot models and do not use old ready-made multi-shoe cards as model references.

## Generated examples

| Card id                 | Card title                      |                      Visual type | Source reference folder                           | Generated asset                                  |
| ----------------------- | ------------------------------- | -------------------------------: | ------------------------------------------------- | ------------------------------------------------ |
| `basketball-rubber`     | Резиновое покрытие              |        с покрытием: rubber court | `Для спорта/Баскетбол/Резиновое покрытие`         | `public/tinder-sport/basketball-rubber.png`      |
| `fitness-base`          | Базовые для фитнеса             |          с покрытием: gym rubber | `Для спорта/Фитнес/Базовые для фитнеса`           | `public/tinder-sport/fitness-base.webp`          |
| `fitness-weightlifting` | Тяжёлая атлетика                |         с покрытием: dark rubber | `Для спорта/Фитнес/Тяжелая атлетика`              | `public/tinder-sport/fitness-weightlifting.webp` |
| `fitness-functional`    | Функциональные тренировки       |          с покрытием: gym rubber | `Для спорта/Фитнес/Функциональные тренировки`     | `public/tinder-sport/fitness-functional.webp`    |
| `fitness-crossfit`      | Кроссфит                        |          с покрытием: gym rubber | `Для спорта/Фитнес/Кроссфит`                      | `public/tinder-sport/fitness-crossfit.webp`      |
| `fitness-group`         | Фитнес и групповые тренировки   |        с покрытием: studio floor | `Для спорта/Фитнес/Фитнес и групповые тренировки` | `public/tinder-sport/fitness-group.webp`         |
| `football-artificial`   | Бутсы для искусственного газона |     с покрытием: artificial turf | `Для спорта/Футбол/Для искусственного газона`     | `public/tinder-sport/football-artificial.png`    |
| `football-natural`      | Бутсы для натурального газона   |       с покрытием: natural grass | `Для спорта/Футбол/Для натурального газона`       | `public/tinder-sport/football-natural.png`       |
| `football-base`         | Базовые для футбола             |                          обычная | `Для спорта/Футбол/Базовые сороконожки`           | `public/tinder-sport/football-base.png`          |
| `football-futsal`       | Футзал и мини-футбол            | с покрытием: indoor futsal court | `Для спорта/Футбол/Футзал и мини-футбол`          | `public/tinder-sport/football-futsal.png`        |
| `tennis-clay`           | Грунт                           |          с покрытием: clay court | `Для спорта/Теннис/Грунт`                         | `public/tinder-sport/tennis-clay.png`            |
| `run-track`             | Бег по стадиону и дорожке       |       с покрытием: running track | `Для спорта/Бег/Бег по стадиону и дорожке`        | `public/tinder-sport/run-track.png`              |
| `outdoor-hiking`        | Хайкинг                         |  с покрытием: rocky hiking trail | `Для спорта/Аутдор/Хайкинг`                       | `public/tinder-sport/outdoor-hiking.png`         |

## All tinder cards

| Segment | Sport         | Card id                 | Title                            | Visual plan                               | Source refs in `Shnurok MVP Visual` | Asset status                                                |
| ------- | ------------- | ----------------------- | -------------------------------- | ----------------------------------------- | ----------------------------------: | ----------------------------------------------------------- |
| Daily   | -             | `daily-chunky`          | Массивные кроссовки              | обычная                                   |                                   4 | current: `public/tinder-daily/daily-chunky.png`             |
| Daily   | -             | `daily-retro-low`       | Ретро: низкие силуэты            | обычная                                   |                                   5 | current: `public/tinder-daily/daily-retro-low.png`          |
| Daily   | -             | `daily-retro-basket`    | Ретро: вдохновленные баскетболом | обычная                                   |                                   5 | current: `public/tinder-daily/daily-retro-basket.png`       |
| Daily   | -             | `daily-trending`        | Трендовые кроссовки              | обычная                                   |                                   6 | current: `public/tinder-daily/daily-trending.png`           |
| Daily   | -             | `daily-minimal`         | Минималистичные кроссовки        | обычная                                   |                                   5 | current: `public/tinder-daily/daily-minimal.png`            |
| Sport   | Фитнес / зал  | `fitness-base`          | Базовые для фитнеса              | с покрытием: gym rubber                   |                                   5 | generated: `public/tinder-sport/fitness-base.webp`          |
| Sport   | Фитнес / зал  | `fitness-weightlifting` | Тяжёлая атлетика                 | с покрытием: dark rubber gym platform     |                                   5 | generated: `public/tinder-sport/fitness-weightlifting.webp` |
| Sport   | Фитнес / зал  | `fitness-functional`    | Функциональные тренировки        | с покрытием: rubber gym floor             |                                   5 | generated: `public/tinder-sport/fitness-functional.webp`    |
| Sport   | Фитнес / зал  | `fitness-crossfit`      | Кроссфит                         | с покрытием: rubber gym floor / chalk     |                                   5 | generated: `public/tinder-sport/fitness-crossfit.webp`      |
| Sport   | Фитнес / зал  | `fitness-group`         | Фитнес и групповые тренировки    | с покрытием: studio gym floor             |                                   5 | generated: `public/tinder-sport/fitness-group.webp`         |
| Sport   | Бег           | `run-street`            | Бег по улице                     | с покрытием: asphalt / street             |                                   5 | source refs only                                            |
| Sport   | Бег           | `run-long`              | Длинные дистанции                | обычная                                   |                                   5 | source refs only                                            |
| Sport   | Бег           | `run-trail`             | Трейлраннинг                     | с покрытием: dirt / rocks / trail         |                                   5 | source refs only                                            |
| Sport   | Бег           | `run-urban-trail`       | Городской трейл                  | с покрытием: asphalt + gravel             |                                   5 | source refs only                                            |
| Sport   | Бег           | `run-track`             | Бег по стадиону и дорожке        | с покрытием: running track                |                                   4 | generated: `public/tinder-sport/run-track.png`              |
| Sport   | Бег           | `run-winter`            | Зимний бег                       | с покрытием: snow / icy street            |                                   5 | source refs only                                            |
| Sport   | Футбол        | `football-artificial`   | Бутсы для искусственного газона  | с покрытием: artificial turf              |                                   6 | generated: `public/tinder-sport/football-artificial.png`    |
| Sport   | Футбол        | `football-natural`      | Бутсы для натурального газона    | с покрытием: natural grass                |                                   5 | generated: `public/tinder-sport/football-natural.png`       |
| Sport   | Футбол        | `football-base`         | Базовые для футбола              | обычная                                   |                                   5 | generated: `public/tinder-sport/football-base.png`          |
| Sport   | Футбол        | `football-futsal`       | Футзал и мини-футбол             | с покрытием: indoor futsal court          |                                   4 | generated: `public/tinder-sport/football-futsal.png`        |
| Sport   | Трейл / улица | `outdoor-trail`         | Трейлраннинг                     | с покрытием: trail dirt / rocks           |                                   5 | source refs only                                            |
| Sport   | Трейл / улица | `outdoor-hiking`        | Хайкинг                          | с покрытием: rocky hiking trail           |                                   5 | generated: `public/tinder-sport/outdoor-hiking.png`         |
| Sport   | Трейл / улица | `outdoor-trekking`      | Трекинг                          | с покрытием: rocks / gravel               |                                   5 | source refs only                                            |
| Sport   | Баскетбол     | `basketball-base`       | Базовые для баскетбола           | обычная                                   |                                   5 | source refs only                                            |
| Sport   | Баскетбол     | `basketball-street`     | Уличные площадки                 | с покрытием: asphalt outdoor court        |                                   5 | source refs only                                            |
| Sport   | Баскетбол     | `basketball-rubber`     | Резиновое покрытие               | с покрытием: rubber court                 |                                   5 | generated: `public/tinder-sport/basketball-rubber.png`      |
| Sport   | Баскетбол     | `basketball-parquet`    | Паркет                           | с покрытием: indoor parquet               |                                   5 | source refs only                                            |
| Sport   | Теннис        | `tennis-hard`           | Хард                             | с покрытием: hard court                   |                                   5 | source refs only                                            |
| Sport   | Теннис        | `tennis-clay`           | Грунт                            | с покрытием: clay court                   |                                   5 | generated: `public/tinder-sport/tennis-clay.png`            |
| Sport   | Теннис        | `tennis-grass`          | Трава                            | с покрытием: grass court                  |                             4 mixed | source refs only                                            |
| Sport   | Теннис        | `tennis-universal`      | Универсальные                    | обычная                                   |                             4 mixed | source refs only                                            |
| Sport   | Теннис        | `tennis-padel`          | Падел                            | с покрытием: padel court / synthetic turf |                                   5 | source refs only                                            |
| Sport   | Скейтбординг  | `skate-base`            | Базовые                          | с покрытием: concrete / skatepark         |                                   5 | source refs only                                            |
| Sport   | Скейтбординг  | `skate-slipons`         | Слипоны                          | с покрытием: concrete / skatepark         |                                   3 | source refs only                                            |
| Sport   | Скейтбординг  | `skate-low`             | Низкие скейт-кеды                | с покрытием: concrete / skatepark         |                                   4 | source refs only                                            |
| Sport   | Скейтбординг  | `skate-high`            | Высокие скейт-кеды               | с покрытием: concrete / skatepark         |                                   4 | source refs only                                            |
| Sport   | Скейтбординг  | `skate-cupsole`         | Кроссовки с капсульной подошвой  | с покрытием: concrete / skatepark         |                                   4 | source refs only                                            |

## Source folders not mapped to current tinder cards

These folders have useful single-product references, but there is no current card id for them in `sneakers-mapping.ts`.

| Source folder                               | Single refs | Note                                                       |
| ------------------------------------------- | ----------: | ---------------------------------------------------------- |
| `На каждый день/Беговые кроссовки`          |           5 | Could support a future daily running-style card.           |
| `На каждый день/Дутые кроссовки`            |           4 | Could support a future puffy silhouette card.              |
| `На каждый день/Люксовые`                   |           5 | Could support a future luxury/premium card.                |
| `На каждый день/Ретро_ вдохновленные бегом` |           5 | Separate from current retro-low and retro-basket cards.    |
| `На каждый день/Технологичные`              |           5 | Could support a future tech/utility card.                  |
| `Для спорта/Базовые для спорта`             |           5 | Broad sport references, not tied to a specific sport card. |
| `Для спорта/Скейтерские/Дутые`              |           4 | Extra skate-adjacent puffy references, no current card id. |

## Generation rules used

- Use only single-product source references as silhouette/color guidance.
- Ignore old vertical multi-shoe cards as generation references.
- Match the visible shoe/boot models to the exact single-product references in the category folder. If exact model fidelity is critical, use cutouts from those references over the generated podium scene.
- Keep the current app image format: square `1254 x 1254`, no text, no UI, no captions.
- Use white/light-gray podiums and risers like the daily cards. Do not replace the composition with a full field/court scene.
- For surface-specific cards, apply the sport surface to podium tops or platform inserts under the sneakers, while keeping the upper part visually aligned with the current daily Tinder cards.
- Inside one Tinder card, all podium-top surfaces must use one uniform material/color treatment. Do not mix wood, rubber, mat inserts, or different court pieces across stands in the same card.
- Avoid readable brand logos or readable product text in generated examples.
