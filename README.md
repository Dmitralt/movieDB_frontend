# Movie Database Frontend

## Структура проекту

```
src/
├── components/           # React компоненти
│   ├── MovieCard.tsx    # Картка фільму для списку
│   ├── MovieDetailsModal.tsx  # Модальне вікно з детальною інформацією про фільм
│   └── __tests__/       # Тести компонентів
├── pages/               # Сторінки додатку
│   └── Home.tsx         # Головна сторінка зі списком фільмів
├── types/               # TypeScript типи
│   └── movie.ts         # Типи для даних фільму
└── setupTests.ts        # Налаштування тестів
```

## Типи даних

### Movie
```typescript
interface Movie {
    id: string;
    title: string;
    year: number;
    country: string;
    language: string;
    production_company: string;
    directors: string[];
    screenwriters: string[];
    actors: string[];
    description: string;
    images: {
        stills: string[];
        posters: string[];
    };
    videos: string[];
}
```

## Компоненти

### MovieCard
Компонент для відображення картки фільму в списку. Відображає:
- Постер фільму
- Назву
- Рік випуску

### MovieDetailsModal
Модальне вікно з детальною інформацією про фільм. Відображає:
- Повну інформацію про фільм
- Галерею зображень
- Відео (якщо є)

## API

### Отримання списку фільмів
```
GET /api/movies
Query параметри:
- page: номер сторінки
- limit: кількість фільмів на сторінці
- search: пошуковий запит
```

### Отримання детальної інформації про фільм
```
GET /api/movies/:id
```

## Тестування

Проект використовує Jest та React Testing Library для тестування. Запуск тестів:
```bash
npm test          # Запуск тестів без вотчера
npm run test:watch  # Запуск тестів з вотчером
```

## Розробка

### Встановлення залежностей
```bash
npm install
```

### Запуск в режимі розробки
```bash
npm start
```

### Збірка для продакшена
```bash
npm run build
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
