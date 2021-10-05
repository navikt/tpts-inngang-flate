import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Knapp } from 'nav-frontend-knapper';

import { useInnloggetSaksbehandler } from '../../../../state/authentication';


import { CellContent } from './CellContent';

const Tildelingsknapp = styled(Knapp)`
    min-height: 0;
    height: 1.5rem;
    padding: 0 0.75rem;
    box-sizing: border-box;
    font-size: var(--navds-font-size-xs);
`;

interface IkkeTildeltProps {
    oppgavereferanse: string;
}

export const IkkeTildelt = ({ oppgavereferanse }: IkkeTildeltProps) => {
    const saksbehandler = useInnloggetSaksbehandler();
    const [isFetching, setIsFetching] = useState(false);


    const tildel = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!saksbehandler || isFetching) return;
        setIsFetching(true);

    };

    return (
        <CellContent width={128}>
            <Tildelingsknapp mini onClick={tildel} spinner={isFetching}>
                Tildel meg
            </Tildelingsknapp>
        </CellContent>
    );
};
