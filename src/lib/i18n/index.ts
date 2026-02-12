import {register, init, locale} from 'svelte-i18n'

register('en-US', () => import('./locales/en.json'));
register('ru-RU', () => import('./locales/ru.json'));

// const subdomain = window.location.hostname.split('.')[0]
// const initialLocale = subdomain === 'en' ? 'en-US' : 'ru-RU';

const saved = localStorage.getItem('lang')
const initialLocale = saved === 'ru-RU' ? 'ru-RU' : 'en-US'

init({
    fallbackLocale: 'en-US',
    initialLocale: initialLocale,
});
locale.set(initialLocale)