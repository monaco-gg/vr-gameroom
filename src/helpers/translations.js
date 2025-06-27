// utils/translations.js
import enUS from '../translations/en-US.json';
import ptBR from '../translations/pt-BR.json';

const translations = { 'en-US': enUS, 'pt-BR': ptBR };

export const getTranslations = (locale) => translations[locale] || ptBR;
