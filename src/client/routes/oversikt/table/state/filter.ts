import { Oppgave, Periodetype } from 'internal-types';
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';

import { tabState, TabType } from '../../tabs';

export type Filter<T> = {
    label: string;
    function: (value: T) => boolean;
    active: boolean;
    column: number;
};

type ActiveFiltersPerTab = {
    [key in TabType]: Filter<Oppgave>[];
};

const defaultFilters: Filter<Oppgave>[] = [
    {
        label: 'Ufordelte saker',
        active: false,
        function: (oppgave: Oppgave) => !oppgave.tildeling,
        column: 0,
    },
    {
        label: 'Tildelte saker',
        active: false,
        function: (oppgave: Oppgave) => !!oppgave.tildeling,
        column: 0,
    },


];

const makeFilterActive = (targetFilterLabel: string) => (it: Filter<Oppgave>) =>
    it.label === targetFilterLabel ? { ...it, active: true } : it;

const activeFiltersPerTab = atom<ActiveFiltersPerTab>({
    key: 'activeFiltersPerTab',
    default: {
        [TabType.TilGodkjenning]: defaultFilters.map(makeFilterActive('Ufordelte saker')),
        [TabType.Mine]: defaultFilters,
        [TabType.Ventende]: defaultFilters,
    },
});

const filtersState = selector<Filter<Oppgave>[]>({
    key: 'filtersState',
    get: ({ get }) => {
        const tab = get(tabState);
        return get(activeFiltersPerTab)[tab];
    },
    set: ({ get, set }, newValue) => {
        const tab = get(tabState);
        set(activeFiltersPerTab, (filters) => ({ ...filters, [tab]: newValue }));
    },
});

export const useFilters = () => useRecoilValue(filtersState);

export const useSetMultipleFilters = () => {
    const setFilters = useSetRecoilState(filtersState);
    return (state: boolean, ...labels: string[]) => {
        setFilters((filters) => filters.map((it) => (labels.includes(it.label) ? { ...it, active: state } : it)));
    };
};

export const useToggleFilter = () => {
    const setFilters = useSetRecoilState(filtersState);
    return (label: string) =>
        setFilters((filters) => filters.map((it) => (it.label === label ? { ...it, active: !it.active } : it)));
};
