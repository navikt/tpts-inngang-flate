import React from 'react';

import { TekstMedEllipsis } from '../../../../components/TekstMedEllipsis';
import { Tooltip } from '../../../../components/Tooltip';
import { usePersondataSkalAnonymiseres } from '../../../../state/person';

import { CellContent } from './CellContent';

interface TiltakProps {
    tiltaksnavn: string;
    oppgavereferanse: string;
}

export const Tiltak = React.memo(({ tiltaksnavn, oppgavereferanse }: TiltakProps) => {
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();
    const id = `tiltaksnavn-${oppgavereferanse}`;
    const tiltak = anonymiseringEnabled ? 'Agurktiltak' : tiltaksnavn;
    console.log({ tiltak });
    return (
        <CellContent width={128} data-for={id} data-tip={tiltak}>
            <TekstMedEllipsis>{tiltak}</TekstMedEllipsis>
            {tiltak.length > 18 && <Tooltip id={id} />}
        </CellContent>
    );
});
