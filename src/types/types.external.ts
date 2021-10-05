export enum SpleisHendelsetype {
    INNTEKTSMELDING = 'INNTEKTSMELDING',
    SYKMELDING = 'NY_SØKNAD',
    SØKNAD_NAV = 'SENDT_SØKNAD_NAV',
    SØKNAD_ARBEIDSGIVER = 'SENDT_SØKNAD_ARBEIDSGIVER',
}

export interface SpleisHendelse {
    id: string;
    type: SpleisHendelsetype;
}

export interface SpesialistPersoninfo {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    kjønn: string | null;
    fødselsdato: string | null;
}

export enum Oppgavetype {
    Søknad = 'SØKNAD',
    Stikkprøve = 'STIKKPRØVE',
    RiskQa = 'RISK_QA',
    Revurdering = 'REVURDERING',
}

export interface SpesialistOppgave {
    oppgavereferanse: string;
    opprettet: string;
    vedtaksperiodeId: string;
    personinfo: SpesialistPersoninfo;
    fødselsnummer: string;
    aktørId: string;
    antallVarsler: number;
    oppgavetype: Oppgavetype;
    boenhet: SpesialistBoenhet;
    tiltak: Tiltak;
    tildeling?: EksternTildeling;
}

interface SpesialistBoenhet {
    id: string;
    navn: string;
}

interface Tiltak {
    id: string;
    navn: string;
}

export interface SpesialistPerson {
    aktørId: string;
    fødselsnummer: string;

    personinfo: SpesialistPersoninfo;
    enhet: Enhet;

    dødsdato?: string;
    tildeling?: EksternTildeling;
}

interface EksternTildeling {
    oid: string;
    epost: string;
    påVent: boolean;
    navn: string;
}

interface Enhet {
    id: string;
    navn: string;
}

// noinspection JSUnusedGlobalSymbols
export enum SpleisVedtaksperiodetilstand {
    TilUtbetaling = 'TilUtbetaling',
    Utbetalt = 'Utbetalt',
    Oppgaver = 'Oppgaver',
    Venter = 'Venter',
    VenterPåKiling = 'VenterPåKiling',
    IngenUtbetaling = 'IngenUtbetaling',
    Feilet = 'Feilet',
    TilInfotrygd = 'TilInfotrygd',
}

// noinspection JSUnusedGlobalSymbols
export enum SpleisMedlemskapstatus {
    JA = 'JA',
    NEI = 'NEI',
    VET_IKKE = 'VET_IKKE',
}

export type SpleisAlvorlighetsgrad = 'W';

export interface SpleisAktivitet {
    vedtaksperiodeId: string;
    alvorlighetsgrad: SpleisAlvorlighetsgrad;
    melding: string;
    tidsstempel: string;
}

export enum SpleisPeriodetype {
    FØRSTEGANGSBEHANDLING = 'FØRSTEGANGSBEHANDLING',
    FORLENGELSE = 'FORLENGELSE',
    INFOTRYGDFORLENGELSE = 'INFOTRYGDFORLENGELSE',
    OVERGANG_FRA_IT = 'OVERGANG_FRA_IT',
    STIKKPRØVE = 'STIKKPRØVE',
    RISK_QA = 'RISK_QA',
}

// noinspection JSUnusedGlobalSymbols
export enum SpesialistInntektkilde {
    Saksbehandler = 'Saksbehandler',
    Inntektsmelding = 'Inntektsmelding',
    Infotrygd = 'Infotrygd',
    AOrdningen = 'AOrdningen',
}

export interface SpesialistInntekterFraAOrdningen {
    måned: string;
    sum: number;
}

export interface SpesialistSammenligningsgrunnlag {
    beløp: number;
    inntekterFraAOrdningen: SpesialistInntekterFraAOrdningen[];
}

export enum OpptegnelseType {
    UTBETALING_ANNULLERING_FEILET = 'UTBETALING_ANNULLERING_FEILET',
    UTBETALING_ANNULLERING_OK = 'UTBETALING_ANNULLERING_OK',
    NY_SAKSBEHANDLEROPPGAVE = 'NY_SAKSBEHANDLEROPPGAVE',
}

export interface Opptegnelse {
    aktørId: number;
    sekvensnummer: number;
    type: OpptegnelseType;
    payload: string;
}

export interface EksternBehandlingstatistikk {
    antallOppgaverTilGodkjenning: {
        totalt: number;
    };
    antallTildelteOppgaver: {
        totalt: number;
    };
    fullførteBehandlinger: {
        totalt: number;
        manuelt: number;
        automatisk: number;
        annulleringer: number;
    };
}
