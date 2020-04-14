import { injectable } from 'inversify';
import {
    TranslatableString,
    TranslationLangs
} from '../model';

@injectable()
export class TranslationUtils {
    validate(data: TranslatableString) {
        if (data == null)
            throw new Error('TranslatableString is null');

        if (typeof data !== 'object')
            throw new Error('TranslatableString must be an object');

        if (data[TranslationLangs.DEFAULT] == null) {
            throw new Error('Missing default translation');
        }

        const langs = Object.values(TranslationLangs);

        for (const key in data) {
            if (!(key in TranslationLangs)) {
                throw new Error(`Unknown language: ${key}`);
            }
        }
    }
}
