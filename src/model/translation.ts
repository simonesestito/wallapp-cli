/*
 * Define a translatable string.
 * It's an object, with the language code as the key
 * and translated string as the value.
 */

/**
 * Enum of supported languages
 */
export enum TranslationLangs {
    DEFAULT = 'default',
    IT = 'it'
}

/**
 * A translatable string is an object which must have a default translation.
 * It can have other supported translations.
 */
export type TranslatableString = {
    [key in TranslationLangs]: string;
} & {
    [TranslationLangs.DEFAULT]: string;
};