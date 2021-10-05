import { Periodetype } from 'internal-types';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Flex } from '../../../../components/Flex';


import { CellContent } from './CellContent';

const getLabelForType = (type: Periodetype) => {
    switch (type) {
        case Periodetype.Forlengelse:
        case Periodetype.Infotrygdforlengelse:
            return 'Forlengelse';
        case Periodetype.Førstegangsbehandling:
            return 'Førstegang.';
        case Periodetype.OvergangFraInfotrygd:
            return 'Forlengelse IT';
        case Periodetype.Stikkprøve:
            return 'Stikkprøve';
        case Periodetype.RiskQa:
            return 'Risk QA';
        case Periodetype.Revurdering:
            return 'Revurdering';
    }
};

interface SakstypeProps {
    type: Periodetype;
}

export const Sakstype = React.memo(({ type }: SakstypeProps) => (
    <CellContent width={128}>
        <Flex alignItems="center">

            <Normaltekst style={{ marginLeft: '12px' }}>{getLabelForType(type)}</Normaltekst>
        </Flex>
    </CellContent>
));
