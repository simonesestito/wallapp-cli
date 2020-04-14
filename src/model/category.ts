import { TranslatableString } from './translation';

export type CategoryID = string;

export enum CategoryGroup {
    COMMUNITY = 'community',
    ORIGINAL = 'original'
}

export interface CategoryData {
    count: number,
    creationDate: Date,
    published: boolean,
    group: CategoryGroup,
    description: TranslatableString,
    title: TranslatableString
}

export interface Category extends CategoryData {
    id: CategoryID
}