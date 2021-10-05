import './body.less';
import { TableHeader } from './table-header/table-header';
import { TableSoknader } from './table-soknader/table-soknader';
import React from 'react';


export const Body = () => {
	return (
		<div role="table" aria-label="Nye søknader tiltakspenger" className="table-soknader">
			<TableHeader />
			<TableSoknader />
		</div>
	);
};
