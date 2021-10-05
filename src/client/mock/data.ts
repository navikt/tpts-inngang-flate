import { Oppgave } from 'internal-types';

const testOppgaver: Oppgave[] = [{
    oppgavereferanse: '1',
    opprettet: '2021-09-27T08:38:00.728127',
    vedtaksperiodeId: 'aaaaaaaa-6541-4dcf-aa53-8b466fc4ac87',

    personinfo: {
        fornavn: 'Anton',
        mellomnavn: null,
        etternavn: 'Svensson',
        fødselsdato: null,
        kjønn: 'mann',
        fnr: '21023701901',
    },
    fødselsnummer: '21023701901',
    aktørId: '1000000009871',
    antallVarsler: 2,
    boenhet: {
        id: '0220',
        navn: 'Asker',
    },
    tiltak: {
        id: 'Ttype1',
        navn: 'Avklaring',
    },
    tildeling: {
        saksbehandler: {
            oid: 'H115405',
            epost: 'klara.margrethe.helgemo@nav.no',
            navn: 'Klara Helgemo',
        },

        påVent: false,
    },
},
    {
        oppgavereferanse: '234',
        opprettet: '2021-03-10T08:38:00.728127',
        vedtaksperiodeId: '876f8c45-e9d1-4fd0-9c8c-9ee10f66b171',

        personinfo: {
            fornavn: 'Alma A',
            mellomnavn: null,
            etternavn: 'Svensson',
            fødselsdato: null,
            kjønn: 'kvinne',
            fnr: '04073732100',
        },
        fødselsnummer: '04073732100',
        aktørId: '87654321962123',
        antallVarsler: 0,
        boenhet: {
            id: '0220',
            navn: 'Asker',
        },
        tiltak: {
            id: 'Ttype2',
            navn: 'Mentor',
        },
        tildeling: {
            saksbehandler: {
                oid: 'H115405',
                epost: 'klara.margrethe.helgemo@nav.no',
                navn: 'Klara Helgemo',
            },

            påVent: false,
        },
    }];

export function hentTestOppgaver(): Oppgave[] {
    return testOppgaver;
}
