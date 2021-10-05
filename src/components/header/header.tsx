import React from 'react';
import { Sidetittel } from 'nav-frontend-typografi';
import './header.less';

export const Header = () => {
	return (
		<div aria-label="overskrift og filtere">
			<div className="header">
				<Sidetittel>Tiltakspenger nye søknader</Sidetittel>
			</div>
		</div>
	);
};