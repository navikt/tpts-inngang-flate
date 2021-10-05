import styled from '@emotion/styled';
import { Person } from 'internal-types';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { InternalHeader, InternalHeaderTitle } from '@navikt/ds-react';

import { authState } from '../../state/authentication';
import { useToggleEasterEgg } from '../../state/easterEgg';
import { useAddVarsel, useRemoveVarsel } from '../../state/varsler';

import { BentoMeny } from '../BentoMeny';
import { SearchBar } from './SearchBar';

const Container = styled.div`
    flex-shrink: 0;
    width: 100%;
    

    > header {
        max-width: unset;
        box-sizing: border-box;
        min-width: var(--speil-total-min-width);
        max-height: 50px;
        
      
    }

    input {
        margin: 1.5rem 1.5rem;
        
    }

    .navds-header__title > span > a:focus {
        box-shadow: none;
    }
    

    .navds-header__title > span > a:focus-visible {
        box-shadow: var(--navds-shadow-focus-on-dark);
        outline: none;
    }
`;

export const Header = () => {
    const history = useHistory();

    const removeVarsel = useRemoveVarsel();
    const addVarsel = useAddVarsel();

    const toggleEasterEgg = useToggleEasterEgg();

    const { name, ident, isLoggedIn } = useRecoilValue(authState);

    const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' };

    const onSøk = (personId: string) => {
        if (personId.toLowerCase() === 'agurk') {
            toggleEasterEgg('Agurk');
            return Promise.resolve();
        }
        const key = 'ugyldig-søk';
        removeVarsel(key);

        return Promise.resolve();
    };

    return (
        <Container>
            <InternalHeader>
                <InternalHeaderTitle>
                    <Link to="/">NAV Tiltakspenger</Link>
                </InternalHeaderTitle>
                <SearchBar onSearch={onSøk} />

                <BentoMeny />
            </InternalHeader>
        </Container>
    );
};
