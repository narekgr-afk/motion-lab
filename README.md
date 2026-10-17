# motion-lab

Тесты motion-инструментов и ролики студии. Сюда идёт всё, что не должно попадать в боевой сайт `studio`.

- `docs/motion-tools.md` — какой инструмент под какой тип заказа (разбор поста «НЕЙРО ПРОФИТ»).
- `styles/mirni/kit.js` — стиль для `animate`: копия isometric в палитре Мирного (синий фон, янтарное окно).
- `mirni-one-window/` — ролик «Мирный: одно окно горит», 20 с, 9:16. Исходники: `src/`, `piece.json`. Превью: `preview-540p.mp4`.

## Как собрать ролик
Нужны Node 22, Chromium, ffmpeg, `playwright@1.56` и [`cth9191/animate`](https://github.com/cth9191/animate) (MIT).
Положить `styles/mirni` в `styles/` рядом с роликом или в стили `animate`, затем из папки навыка:

```
node tools/build.mjs <путь>/mirni-one-window
node tools/export.mjs <путь>/mirni-one-window --workers 4 --share
node tools/review.mjs <путь>/mirni-one-window
```

Тяжёлые рендеры и кадры в git не кладём.

## Что известно
- `animate` работает; остальные репозитории из поста не тестировали (у студии есть `video-studio`).
- Звук ролика не слушали, только измеряли. Логотип нарисован по описанию, не из `SiteLogo`.
