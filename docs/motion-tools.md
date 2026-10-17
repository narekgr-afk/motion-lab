# Motion-инструменты для заказов

Памятка: какой open-source инструмент брать под какой тип заказа.
Источник списка: пост канала «НЕЙРО ПРОФИТ» (10 репозиториев GitHub для motion-дизайна).
Данные ниже взяты из README репозиториев на 17.10.2026. Что в README не нашли, помечено «проверить».

> Почти все инструменты рассчитаны на Claude Code + Opus 5.5 и ставятся как skills.
> Для видео нужны Node.js 22+, ffmpeg и Chrome/Chromium.

## Какой инструмент под какой заказ

| Тип заказа | Инструмент | Установка |
|---|---|---|
| Анимация на сайте (hover, scroll, переходы) | `motiondivision/motion` + `199-biotechnologies/motion-dev-animations-skill` | `npm install motion` + skill |
| Лаунч-ролик продукта по URL сайта | `AbubakrChan/product-launch-motion` | `npx skills add AbubakrChan/product-launch-motion` |
| Презентационные ролики, анимированные диаграммы, reels | `charlie947/motion-graphics-skills` | `npx skills add charlie947/motion-graphics-skills` |
| Монтаж говорящей головы (паузы, оговорки, субтитры, B-roll) | `nateherkai/hyperframes-student-kit` (теперь `herk-edit-kit`) | `git clone` + `npm ci` + `npm run setup` |
| B-roll по транскрипту, отделение человека от фона, промо-ролики, звуки | `Barty-Bart/motion-graphics` | `npx skills add Barty-Bart/motion-graphics` |
| Motion-графика с контролем качества кадров и звуком | `whaleyxbt/claude-motion` | `git clone` + `npm install` |
| Короткие ролики в 7 стилях (аппликация, ризография, пиксель-арт) | `cth9191/animate` | проверить (README не читали) |
| Видео из HTML/кода, свой пайплайн | `heygen-com/hyperframes` | `claude plugin marketplace add heygen-com/hyperframes` |
| Видео на React, автоматизация, массовый рендер | `remotion-dev/remotion` | `npx create-video@latest` |

## По инструментам

### Сайты

**motion** (`motiondivision/motion`)
Библиотека анимаций для JS, React и Vue, бывший Framer Motion. Импорт: `motion/react`.
Есть жесты, пружины, layout-переходы, scroll-эффекты. Для Next.js-проектов (наш стек) подходит напрямую.

**motion-dev-animations-skill** (`199-biotechnologies`)
Skill для Claude Code поверх Motion.dev. По запросу вроде «добавь hero-анимацию» или «parallax на лендинг»
генерирует TypeScript-код. Заявлено: только GPU-свойства (transform, opacity, filter),
поддержка `prefers-reduced-motion`, бандл до 50 КБ. Лицензия MIT.
Установка: клонировать в `~/.claude/skills/motion-dev-animations` или в `.claude/skills/` проекта.

> Правило проекта: без одобрения заказчика макет не «улучшаем». Анимации добавляем только по согласованию.

### Ролики для продуктов

**product-launch-motion**
Даёшь URL сайта и получаешь лаунч-ролик 60 fps с музыкой, синхронными звуками и motion blur.
Всё рендерится из HTML и пружин, без After Effects и AI-видеомоделей. Работает с Opus 5.5.
Правки идут в формате «решение режиссёра `DECISION:`», которое можно оспорить одним сообщением.
В README есть платный сервис авторов (launchvideos.app), но навык самостоятельный.

**motion-graphics-skills**
15 навыков: лаунч-видео, анимированные графики, reels. Начинать с `brand-intake`: он собирает фирменный стиль клиента.
Работает в Claude Code и Codex. Для Claude Desktop можно загрузить отдельный навык как zip.

### Монтаж

**herk-edit-kit** (бывший `hyperframes-student-kit`)
Вырезает паузы и оговорки, ищет ошибки, планирует историю, добавляет субтитры, B-roll, motion-графику и звук.
Включает 15 навыков и ~406 заготовок карточек. Транскрибация через ElevenLabs Scribe (нужен ключ),
вместо него можно Whisper. Генерация медиа через Kie.ai (по желанию, тоже платно).
Есть пошаговый playbook в `docs/EDITING-PLAYBOOK.md`.

**Barty-Bart/motion-graphics** (MIT)
Шесть навыков: `motion-broll`, `object-separation` (человек/товар на новый фон, локально),
`explainer-high-energy` (12–20 с), `explainer-default` (45–90 с демо), `explainer-engaging` (10–30 с),
`sound-effects` (звуки CC0).

### Графика и звук

**claude-motion**
Набор для агентов на Remotion: правила motion-дизайна с цифрами, цикл самопроверки по кадрам (contact sheet),
движок звука на чистом Python и вторая ветка `sims/` для симуляций и 3D через web-страницу.
Работает с Claude Code и Cursor.

### Базовые движки

**hyperframes** (HeyGen, Apache 2.0)
«Пишем HTML, получаем видео». Детерминированный рендер MP4, плагин для Claude Code и другие агенты.

**remotion**
Видео на React. Есть агентные навыки, шаблоны, рендер на Lambda и пакетный рендер.
**Лицензию для коммерческого использования проверить** перед тем, как брать платные заказы.

## Как начать на заказе

1. Определить тип заказа по таблице выше.
2. Поставить нужный навык. Для навыков Claude Code: в `.claude/skills/` проекта или `~/.claude/skills/`.
3. Для видео выбрать модель Opus 5.5 (`/model`) и сначала прогнать `brand-intake` (если есть) на материалах клиента.
4. Перед сдачей смотреть результат со звуком. Превью в README часто немое.

## Что проверить

- [ ] `cth9191/animate`: прочитать README, установку и лицензию.
- [ ] Лицензии на коммерческое использование: `remotion`, `motion`, `product-launch-motion`, `motion-graphics-skills`, `claude-motion`.
- [ ] Прогнать по одному реальному заказу на каждый тип и записать, что реально экономит время.
