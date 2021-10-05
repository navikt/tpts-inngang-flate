import { Person, TildelingType } from 'internal-types';
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';



import { useInnloggetSaksbehandler } from './authentication';


interface PersonState {
    problems?: Error[];
    person?: Person;
}


export const personState = atom<PersonState | undefined>({
    key: 'personState',
    default: undefined,
});

const tildelingState = atom<TildelingType | undefined>({
    key: 'tildelingState',
    default: undefined,
});

// Avgjør om tilstand i frontend skal overstyre tilstand as of backend
const frontendOverstyrerTildelingState = atom<boolean>({
    key: 'frontendOverstyrerTildeling',
    default: false,
});

const loadingPersonState = atom<boolean>({
    key: 'loadingPersonState',
    default: false,
});

const anonymiserPersonStateToggle = atom<boolean>({
    key: 'anonymiserPersonStateToggle',
    default: localStorage.getItem('agurkmodus') === 'true',
});

export const persondataSkalAnonymiseres = selector<boolean>({
    key: 'persondataSkalAnonymiseres',
    get: ({ get }) => get(anonymiserPersonStateToggle),
    set: ({ set }, newValue: boolean) => {
        localStorage.setItem('agurkmodus', `${newValue}`);
        set(anonymiserPersonStateToggle, newValue);
    },
});

export const useToggleAnonymiserPersondata = () => {
    const setAnonymiserPerson = useSetRecoilState(persondataSkalAnonymiseres);
    return () => {
        setAnonymiserPerson((erAnonymisert) => !erAnonymisert);
    };
};

export const usePersondataSkalAnonymiseres = () => useRecoilValue(persondataSkalAnonymiseres);

export const useTildelPerson = () => {
    const setTildeling = useSetRecoilState(tildelingState);
    const setFrontendOverstyrerTildeling = useSetRecoilState(frontendOverstyrerTildelingState);
    const saksbehandler = useInnloggetSaksbehandler();
    return {
        tildelPerson: (påVent?: boolean) => {
            setFrontendOverstyrerTildeling(true);
            setTildeling({ saksbehandler: { ...saksbehandler }, påVent: påVent ?? false });
        },
        fjernTildeling: () => {
            setFrontendOverstyrerTildeling(true);
            setTildeling(undefined);
        },
    };
};

export const usePersonPåVent = () => {
    const { tildelPerson } = useTildelPerson();
    return (påVent: boolean) => tildelPerson(påVent);
};

export const usePerson = () => {
    const person = useRecoilValue(personState)?.person;
    const tildeling = useRecoilValue(tildelingState);
    const frontendOverstyrerTildeling = useRecoilValue(frontendOverstyrerTildelingState);
    return (
        person && {
            ...person,
            tildeling: frontendOverstyrerTildeling ? tildeling : person.tildeling,
        }
    );
};

export const usePersonnavn = (): string => {
    const { fornavn, mellomnavn, etternavn } = usePerson()?.personinfo ?? {};
    return [fornavn, mellomnavn, etternavn].filter(Boolean).join(' ');
};




export const useIsLoadingPerson = () => useRecoilValue(loadingPersonState);
