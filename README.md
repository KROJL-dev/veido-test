# Test task to assess skills

The essence of the task is to fix the types and refactor the `FavoriteCompaniesSelect` component - translate it into Typescript and make clean and understandable code there. At the moment, it's a real mess, and the component is actually very simple.

The component currently works correctly. The `App.tsx` file contains several examples of use - this is done so that you can understand how the component should work. After refactoring, it should work the same way.
The names of the props can be different if this improves the readability of the code.

The `FavortieCompaniesSelect` file contains the constant `company_stats` - within the test, this is data from json, but in real conditions it will be dynamic, so this data should come to the component props.

If you need to completely rewrite the component from scratch to achieve the ideal code - no problem.

## The goal of the test task is very short, clear and correctly working code.

Тестове завдання для оцінки навичок

Суть завдання - потрібно виправити типи, і відрефакторити компонент FavoriteCompaniesSelect - перекласти на Typescript і зробити там чистий і зрозумілий код. На даний момент там чорт ногу зломить, а компонент насправді дуже простий.

На даний момент компонент працює правильно. У файлі `App.tsx` є кілька прикладів використання – це зроблено для того, щоб можна було зрозуміти, як повинен працювати компонент. Після рефакторингу він має працювати так само.
Назви пропсів можуть бути інші, якщо це покращить читання коду.

У файлі `FavortieCompaniesSelect` є константа `company_stats` - в рамках тестового дані з json, але в реальних умовах вони будуть динамічні, тому ці дані повинні приходити в пропси компонента.

Якщо для досягнення ідеального коду потрібно повністю переписати компонент з нуля - без проблем.

## Мета тестового завдання - дуже короткий, зрозумілий і правильно працюючий код.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
