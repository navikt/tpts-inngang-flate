import dayjs from 'dayjs';
import { Oppgave, Periodetype, Saksbehandler, TildelingType, Boenhet, Tiltak } from 'internal-types';
import { atom, selector, useRecoilValueLoadable, useSetRecoilState } from 'recoil';

import { Varseltype } from '@navikt/helse-frontend-varsel';

import { deletePåVent, deleteTildeling, fetchOppgaver, postLeggPåVent, postTildeling } from '../io/http';

import { flereArbeidsgivere, stikkprøve } from '../featureToggles';
import { useInnloggetSaksbehandler } from './authentication';
import { useAddVarsel, useRemoveVarsel } from './varsler';
import { Oppgavetype, SpesialistOppgave } from 'external-types';

const oppgaverStateRefetchKey = atom<Date>({
    key: 'oppgaverStateRefetchKey',
    default: new Date(),
});

export const tilOppgave = (oppgave: SpesialistOppgave): { antallVarsler: number; opprettet: string; aktørId: string; fødselsnummer: string; tildeling: { saksbehandler: { epost: string; navn: string; oid: string }; påVent: boolean } | undefined; oppgavereferanse: string; vedtaksperiodeId: string; personinfo: { mellomnavn: string | null; etternavn: string; fødselsdato: dayjs.Dayjs | null; fornavn: string; fnr: undefined; kjønn: any };  boenhet: Boenhet; tiltak: Tiltak } => ({
    oppgavereferanse: oppgave.oppgavereferanse,
    opprettet: oppgave.opprettet,
    vedtaksperiodeId: oppgave.vedtaksperiodeId,
    personinfo: {
        fornavn: oppgave.personinfo.fornavn,
        mellomnavn: oppgave.personinfo.mellomnavn,
        etternavn: oppgave.personinfo.etternavn,
        kjønn: (oppgave.personinfo.kjønn),
        fødselsdato: oppgave.personinfo.fødselsdato ? dayjs(oppgave.personinfo.fødselsdato) : null,
        fnr: undefined,
    },
    fødselsnummer: oppgave.fødselsnummer,
    aktørId: oppgave.aktørId,
    antallVarsler: oppgave.antallVarsler,
    tiltak: oppgave.tiltak,
    boenhet: oppgave.boenhet,
    tildeling: oppgave.tildeling
        ? {
            saksbehandler: {
                epost: oppgave.tildeling.epost,
                oid: oppgave.tildeling.oid,
                navn: oppgave.tildeling.navn,
            },
            påVent: oppgave.tildeling.påVent,
        }
        : undefined,
});


type TildelingStateType = { [oppgavereferanse: string]: TildelingType | undefined };

const _tildelingerState = atom<TildelingStateType>({
    key: '_tildelingerState',
    default: {},
});

const tildelingerState = selector<TildelingStateType>({
    key: 'tildelingerState',
    get: async ({ get }) => {
        const local = get(_tildelingerState);

        return { ...local };
    },
});

const remoteOppgaverState = selector<Oppgave[]>({
    key: 'remoteOppgaverState',
    get: async ({ get }) => {
        get(oppgaverStateRefetchKey);
        return await fetchOppgaver()
            .then((spesialistOppgaver) => spesialistOppgaver.map(tilOppgave))
            .catch((error) => {
                switch (error.statusCode) {
                    case 404:
                        throw Error('Fant ingen saker mellom i går og i dag.');
                    case 401:
                        throw Error('Du må logge inn for å kunne hente saker.');
                    default:
                        throw Error('Kunne ikke hente saker. Prøv igjen senere.');
                }
            });
    },
});

export const oppgaverState = selector<Oppgave[]>({
    key: 'oppgaverState',
    get: ({ get }) => {
        const tildelinger = get(tildelingerState);
        const oppgaver = get(remoteOppgaverState);
        return oppgaver
            .filter((oppgave) => stikkprøve)
            .map((oppgave) => ({ ...oppgave, tildeling: tildelinger[oppgave.oppgavereferanse] }));
    },
});
export const useOppgaver = (): Oppgave[] => {
    const oppgaver = useRecoilValueLoadable<Oppgave[]>(oppgaverState);
    return oppgaver.state === 'hasValue' ? oppgaver.contents : [];
};

export const useMineOppgaver = (): Oppgave[] => {
    const { oid } = useInnloggetSaksbehandler();
    return useOppgaver().filter(({ tildeling }) => tildeling?.saksbehandler?.oid === oid);
};

export const useRefetchOppgaver = () => {
    const setKey = useSetRecoilState(oppgaverStateRefetchKey);
    const setTildelinger = useSetRecoilState(_tildelingerState);
    return () => {
        setTildelinger({});
        setKey(new Date());
    };
};

type TildelingError = {
    feilkode: string;
    kildesystem: string;
    kontekst: {
        tildeling: {
            oid: string;
            navn: string;
            epost: string;
            påVent: boolean;
        };
    };
};

const useRemoveTildelingsvarsel = () => {
    const removeVarsel = useRemoveVarsel();
    return () => removeVarsel('tildeling');
};

const useAddTildelingsvarsel = () => {
    const addVarsel = useAddVarsel();
    return (message: string) => addVarsel({ key: 'tildeling', message: message, type: Varseltype.Info });
};

export const useTildelOppgave = () => {
    const setTildelinger = useSetRecoilState(_tildelingerState);
    const addTildelingsvarsel = useAddTildelingsvarsel();
    const removeTildelingsvarsel = useRemoveTildelingsvarsel();

    return ({ oppgavereferanse }: Pick<Oppgave, 'oppgavereferanse'>, saksbehandler: Saksbehandler) => {
        removeTildelingsvarsel();
        return postTildeling(oppgavereferanse)
            .then((response) => {
                setTildelinger((it) => ({ ...it, [oppgavereferanse]: { saksbehandler, påVent: false } }));
                return Promise.resolve(response);
            })
            .catch(async (error) => {
                if (error.statusCode === 409) {
                    const respons: TildelingError = (await JSON.parse(error.message)) as TildelingError;
                    const { oid, navn, epost, påVent } = respons.kontekst.tildeling;
                    setTildelinger((it) => ({
                        ...it,
                        [oppgavereferanse]: { saksbehandler: { oid, navn, epost }, påVent: påVent },
                    }));
                    addTildelingsvarsel(`${navn} har allerede tatt saken.`);
                    return Promise.reject(oid);
                } else {
                    addTildelingsvarsel('Kunne ikke tildele sak.');
                    return Promise.reject();
                }
            });
    };
};

export const useFjernTildeling = () => {
    const setTildelinger = useSetRecoilState(_tildelingerState);
    const addTildelingsvarsel = useAddTildelingsvarsel();
    const removeTildelingsvarsel = useRemoveTildelingsvarsel();

    return ({ oppgavereferanse }: Pick<Oppgave, 'oppgavereferanse'>) => {
        removeTildelingsvarsel();
        return deleteTildeling(oppgavereferanse)
            .then((response) => {
                setTildelinger((it) => ({ ...it, [oppgavereferanse]: undefined }));
                return Promise.resolve(response);
            })
            .catch(() => {
                addTildelingsvarsel('Kunne ikke fjerne tildeling av sak.');
                return Promise.reject();
            });
    };
};

export const useLeggPåVent = () => {
    const setTildelinger = useSetRecoilState(_tildelingerState);
    const addTildelingsvarsel = useAddTildelingsvarsel();
    const removeTildelingsvarsel = useRemoveTildelingsvarsel();

    return ({ oppgavereferanse }: Pick<Oppgave, 'oppgavereferanse'>) => {
        removeTildelingsvarsel();
        return postLeggPåVent(oppgavereferanse)
            .then((response) => {
                setTildelinger((tildelinger) => ({
                    ...tildelinger,
                    [oppgavereferanse]: tildelinger[oppgavereferanse]
                        ? { ...tildelinger[oppgavereferanse]!, påVent: true }
                        : undefined,
                }));
                return Promise.resolve(response);
            })
            .catch(() => {
                addTildelingsvarsel('Kunne ikke legge sak på vent.');
                return Promise.reject();
            });
    };
};

export const useFjernPåVent = () => {
    const setTildelinger = useSetRecoilState(_tildelingerState);
    const addTildelingsvarsel = useAddTildelingsvarsel();
    const removeTildelingsvarsel = useRemoveTildelingsvarsel();

    return ({ oppgavereferanse }: Pick<Oppgave, 'oppgavereferanse'>) => {
        removeTildelingsvarsel();
        return deletePåVent(oppgavereferanse)
            .then((response) => {
                setTildelinger((it) => ({
                    ...it,
                    [oppgavereferanse]: it[oppgavereferanse] ? { ...it[oppgavereferanse]!, påVent: false } : undefined,
                }));
                return Promise.resolve(response);
            })
            .catch(() => {
                addTildelingsvarsel('Kunne ikke fjerne sak fra på vent.');
                return Promise.reject();
            });
    };
};

export const useTildeling = () => ({
    tildelOppgave: useTildelOppgave(),
    fjernTildeling: useFjernTildeling(),
    leggPåVent: useLeggPåVent(),
    fjernPåVent: useFjernPåVent(),
});
