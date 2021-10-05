import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { Oppgave, Periodetype } from 'internal-types';
import React from 'react';

import { Sidetittel } from 'nav-frontend-typografi';

import agurk from '../../assets/ingen-oppgaver-agurk.png';
import fredagstaco from '../../assets/ingen-oppgaver-fredagstaco.png';
import brevkasse from '../../assets/ingen-oppgaver.png';
import { useFilters } from './table/state/filter';
import { usePagination } from './table/state/pagination';
import { useSortation } from './table/state/sortation';

import { hentTestOppgaver } from '../../mock/data';
import { Body } from './table/Body';
import { Cell } from './table/Cell';
import { FilterButton } from './table/FilterButton';
import { Header } from './table/Header';
import { HerKommerDetaljer } from './table/HerKommerDetaljer';
import { Pagination } from './table/Pagination';
import { SortButton } from './table/SortButton';
import { Table } from './table/Table';
import { Bosted } from './table/rader/Bosted';
import { Sakstype } from './table/rader/Sakstype';
import { Status } from './table/rader/Status';
import { Søker } from './table/rader/Søker';
import { Tildeling } from './table/rader/Tildeling';
import { Tiltak } from './table/rader/Tiltak';
import { TabType, useAktivTab } from './tabs';

const ScrollableX = styled.div`
    overflow: auto hidden;
    margin: 10px;
    padding: 0;
    height: calc(100% - 50px);
    width: 100%;
`;

const Container = styled.div`
    align-self: flex-start;
    width: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
`;

const Tekst = styled(Sidetittel)`
    margin: 2rem 0 0;
    font-size: 1.25rem;
    flex: 1;
`;

const erFredag = () => dayjs().isoWeekday() === 5;
//const erFredag = () => true;
const personer = hentTestOppgaver();
export const IngenOppgaver = () => {
    const aktivTab = useAktivTab();
    const pagination = usePagination();
    const sortation = useSortation();
    const filters = useFilters();
    const tab = useAktivTab();

    switch (aktivTab) {
        case 'alle':
            return (
                <Container>
                    <ScrollableX>
                        <Table
                            aria-label={
                                tab === TabType.TilGodkjenning
                                    ? 'Saker som er klare for behandling'
                                    : tab === TabType.Mine
                                    ? 'Saker som er tildelt meg'
                                    : 'Saker som er tildelt meg og satt på vent'
                            }
                        >
                            <thead>
                                <tr>
                                    <Header scope="col" colSpan={1}>
                                        {tab === TabType.TilGodkjenning ? (
                                            <FilterButton filters={filters.filter((it) => it.column === 0)}>
                                                Tildelt
                                            </FilterButton>
                                        ) : (
                                            'Tildelt'
                                        )}
                                    </Header>

                                    <Header scope="col" colSpan={1}>
                                        Søker
                                    </Header>
                                    <Header
                                        scope="col"
                                        colSpan={1}
                                        aria-sort={sortation?.label === 'bosted' ? sortation.state : 'none'}
                                    >
                                        <SortButton
                                            label="bosted"
                                            onSort={(a: Oppgave, b: Oppgave) =>
                                                a.boenhet.navn.localeCompare(b.boenhet.navn)
                                            }
                                            state={sortation?.label === 'bosted' ? sortation.state : 'none'}
                                        >
                                            Bosted
                                        </SortButton>
                                    </Header>
                                    <Header scope="col" colSpan={1}>
                                        <FilterButton filters={filters.filter((it) => it.column === 3)}>
                                            Tiltak
                                        </FilterButton>
                                    </Header>

                                    <Header
                                        scope="col"
                                        colSpan={1}
                                        aria-sort={sortation?.label === 'opprettet' ? sortation.state : 'none'}
                                    >
                                        <SortButton
                                            label="opprettet"
                                            onSort={(a: Oppgave, b: Oppgave) =>
                                                new Date(a.opprettet).getTime() - new Date(b.opprettet).getTime()
                                            }
                                            state={sortation?.label === 'opprettet' ? sortation.state : 'none'}
                                        >
                                            Tiltak startdato
                                        </SortButton>
                                    </Header>
                                    <Header scope="col" colSpan={1}>
                                        <FilterButton filters={filters.filter((it) => it.column === 1)}>
                                            Sakstype
                                        </FilterButton>
                                    </Header>
                                    <Header
                                        scope="col"
                                        colSpan={1}
                                        aria-sort={sortation?.label === 'status' ? sortation.state : 'none'}
                                    ></Header>
                                    <Header scope="col" colSpan={1} />
                                </tr>
                            </thead>
                            <Body>
                                {personer.map((person: Oppgave) => (
                                    <tr>
                                        <Cell>
                                            <Tildeling oppgave={person} />
                                        </Cell>

                                        <Cell>
                                            <Søker
                                                personinfo={person.personinfo}
                                                oppgavereferanse={person.oppgavereferanse}
                                            />
                                        </Cell>
                                        <Cell>
                                            <Bosted
                                                stedsnavn={person.boenhet.navn}
                                                oppgavereferanse={person.oppgavereferanse}
                                            />
                                        </Cell>
                                        <Cell>
                                            <Tiltak
                                                tiltaksnavn={person.tiltak.navn}
                                                oppgavereferanse={person.oppgavereferanse}
                                            />
                                        </Cell>

                                        <Cell>'1. april'</Cell>
                                        <Cell>
                                            <Sakstype type={Periodetype.Førstegangsbehandling} />
                                        </Cell>
                                    </tr>
                                ))}
                            </Body>
                        </Table>
                    </ScrollableX>
                </Container>
            );
        case 'mine':
            return (
                <Container>
                    <img alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Tekst>Du har ingen tildelte saker</Tekst>
                </Container>
            );
        case 'ventende':
            return (
                <Container>
                    <img alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Tekst>Du har ingen saker på vent</Tekst>
                </Container>
            );
        default:
            return null;
    }
};
