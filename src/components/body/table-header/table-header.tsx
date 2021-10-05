import React from 'react';

export const TableHeader = () => {


	return (
		<div role="rowgroup">
			<div role="row" className="table-header">
				<HeaderField
					name={HeaderFieldName.BRUKER_ETTERNAVN}
					text="Etternavn, Fornavn"

				/>
				<HeaderField
					name={HeaderFieldName.BRUKER_FNR}
					text="Fødselsnummer"

				/>
				<HeaderField
					name={HeaderFieldName.VEDTAK_STARTET}
					text="Vedtak startet"

				/>
				<HeaderField
					name={HeaderFieldName.STATUS}
					text="Status"

				/>
				<HeaderField
					name={HeaderFieldName.BESLUTTER_NAVN}
					text="Kvalitetssikrer"

				/>
				<HeaderField
					name={HeaderFieldName.VEILEDER_NAVN}
					text="Veileder"

				/>
				<HeaderField
					name={HeaderFieldName.STATUS_ENDRET}
					text="Status endret"

				/>
				<HeaderField
					name={HeaderFieldName.BRUKER_OPPFOLGINGSENHET_NAVN}
					text="Enhet"

				/>
			</div>
		</div>
	);
};

interface HeaderFieldProps {
	name: HeaderFieldName;
	text: string;
}

const HeaderField = (props: HeaderFieldProps) => {
	const { name, text } = props;




	return (
		<button
			role="columnheader"

			className="table-header-field"
		>
			{text}

		</button>
	);
};
