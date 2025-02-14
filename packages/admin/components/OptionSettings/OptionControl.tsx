import {
	FormTokenField,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { BaseControlProps } from '@wordpress/components/build-types/base-control/types';
import { FormTokenFieldProps } from '@wordpress/components/build-types/form-token-field/types';
import { SelectControlProps } from '@wordpress/components/build-types/select-control/types';
import { ToggleControlProps } from '@wordpress/components/build-types/toggle-control/types';
import type { SettingSchema } from '../../types';

export type OptionControlType = (
	| FormTokenFieldProps
	| BaseControlProps
	| SelectControlProps
	| ToggleControlProps
 ) &
	SettingSchema & {
		value: unknown;
		options?: { label: string; value: string }[];
		onChange: ( value: unknown ) => void;
	};

const controls = {
	string: TextControl,
	select: SelectControl,
	boolean: ToggleControl,
	array: FormTokenField,
};

export function OptionControl( {
	type,
	description,
	value,
	required,
	label,
	onChange,
	help,
	...rest
}: SettingSchema & OptionControlType ) {
	const componentProps = {
		label: label || description,
		required: required || false,
		help: help || null,
	} as OptionControlType;

	let control;

	switch ( type ) {
		case 'string':
			control = rest?.enum?.length ? controls.select : controls.string;

			componentProps.value = value || '';
			componentProps.onChange = ( selected: unknown ) =>
				onChange( selected );

			if ( rest?.enum?.length ) {
				componentProps.options = rest.enum.map( ( v: string ) => ( {
					label: v.charAt( 0 ).toUpperCase() + v.slice( 1 ),
					value: v,
				} ) );
			}
			break;
		case 'integer':
			control = controls.string;

			componentProps.value = value ? parseInt( value as string ) : '';
			componentProps.onChange = ( selected: unknown ) =>
				onChange( parseInt( selected as string ) );
			componentProps.type = 'number';
			break;
		case 'boolean':
			control = controls.boolean;

			componentProps.checked = value || false;
			componentProps.onChange = ( selected: unknown ) =>
				onChange( selected );
			break;
		case 'array':
			control = controls.array;

			componentProps.onChange = ( selected: unknown ) =>
				onChange( selected );
			componentProps.tokenizeOnSpace = true;
			componentProps.value = value || [];
			break;
	}

	const Component = control;

	return <Component { ...componentProps } />;
}
