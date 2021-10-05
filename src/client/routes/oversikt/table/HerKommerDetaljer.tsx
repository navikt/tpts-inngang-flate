import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { Sidetittel } from 'nav-frontend-typografi';

import agurk from '../../assets/ingen-oppgaver-agurk.png';
import fredagstaco from '../../assets/ingen-oppgaver-fredagstaco.png';

const Container = styled.div`
    align-self: flex-start;
    width: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
`;

const Tekst = styled(Sidetittel)`
    margin: 2rem 0 0;
    font-size: 1.25rem;
    flex: 1;
`;

const erFredag = () => dayjs().isoWeekday() === 5;

export const HerKommerDetaljer = () => {
    return (
        <Container>
            {erFredag() ? (
                <img alt="Agurk med armer og bein ikledd sombrero som holder en taco" src={fredagstaco} />
            ) : (
                <img alt="Agurk med armer og bein som holder kaffekopp" src={agurk} />
            )}
            <Tekst>Her kommer detaljer</Tekst>
        </Container>
    );
};
