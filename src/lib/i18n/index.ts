import {register, init, getLocaleFromNavigator} from 'svelte-i18n'

register('en-US', () => import('./locales/en.json'));
register('ru-RU', () => import('./locales/ru.json'));

const subdomain = window.location.hostname.split('.')[0]
const initialLocale = subdomain === 'en' ? 'en-US' : 'ru-RU';

init({
    fallbackLocale: 'en-US',
    initialLocale: initialLocale,
});