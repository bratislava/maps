/// <reference types="react" />
export interface ISearchBarProps {
    direction?: 'top' | 'bottom';
    language: string;
    placeholder: string;
}
export declare function SearchBar({ direction, language, placeholder, }: ISearchBarProps): JSX.Element;
