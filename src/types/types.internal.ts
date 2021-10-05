import { Dayjs } from 'dayjs';




export interface Periode {
    fom: Dayjs;
    tom: Dayjs;
}

export interface Basisvilkår {
    oppfylt?: boolean;
}


export interface Oppsummering {
    antallUtbetalingsdager: number;
    totaltTilUtbetaling: number;
}


export enum Periodetype {
    Forlengelse = 'forlengelse',
    Førstegangsbehandling = 'førstegangsbehandling',
    Infotrygdforlengelse = 'infotrygdforlengelse',
    OvergangFraInfotrygd = 'overgangFraIt',
    Stikkprøve = 'stikkprøve',
    RiskQa = 'riskQa',
    Revurdering = 'revurdering',
}

export interface Søknad {
    id: string;
    fom: Dayjs;
    tom: Dayjs;
    rapportertDato?: Dayjs;
    sendtNav: Dayjs;
}



export type Kjønn = 'mann' | 'kvinne' | 'ukjent';

export interface Personinfo {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    fødselsdato: Dayjs | null;
    kjønn: Kjønn;
    fnr?: string;
}

export interface Person {
    aktørId: string;
    personinfo: Personinfo;
    fødselsnummer: string;
    enhet: Enhetsinfo;
    dødsdato?: Dayjs;
    tildeling?: TildelingType;
}

export interface Enhetsinfo {
    id: string;
    navn: string;
}

export interface Oppgave {
    oppgavereferanse: string;
    opprettet: string;
    vedtaksperiodeId: string;
    personinfo: Personinfo;
    fødselsnummer: string;
    aktørId: string;
    antallVarsler: number;
    boenhet: Boenhet;
    tiltak: Tiltak;
    tildeling?: TildelingType;
}

export interface TildelingType {
    saksbehandler: Saksbehandler;
    påVent: boolean;
}

export interface Boenhet {
    id: string;
    navn: string;
}

export interface Tiltak {
    id: string;
    navn: string;
}


export interface Vurdering {
    godkjent: boolean;
    tidsstempel: Dayjs;
    automatisk: boolean;
    ident: string;
}

export enum Utbetalingstype {
    UTBETALING = 'UTBETALING',
    ANNULLERING = 'ANNULLERING',
    ETTERUTBETALING = 'ETTERUTBETALING',
    REVURDERING = 'REVURDERING',
    UKJENT = 'UKJENT',
}

export interface Error {
    message: string;
    statusCode?: number;
    technical?: string;
}

export interface Saksbehandler {
    oid: string;
    epost: string;
    navn: string;
}

export interface Behandlingsstatistikk {
    antallOppgaverTilGodkjenning: {
        totalt: number;
        perPeriodetype: {
            periodetype: Periodetype;
            antall: number;
        }[];
    };
    antallTildelteOppgaver: {
        totalt: number;
        perPeriodetype: {
            periodetype: Periodetype;
            antall: number;
        }[];
    };
    fullførteBehandlinger: {
        totalt: number;
        manuelt: number;
        automatisk: number;
        annulleringer: number;
    };
}

