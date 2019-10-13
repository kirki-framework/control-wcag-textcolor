/* globals React */
/* eslint jsx-a11y/label-has-for: off */
import { ChromePicker } from 'react-color';
import WCAGLinkColorIndicator from './WCAGLinkColorIndicator';

const WCAGLinkColorFormCustom = ( props ) => {
	// Handle changes to the recommended picker.
	const handleChangeComplete = ( color ) => {
		wp.customize( props.customizerSetting.id ).set( color.hex );
	};

	return (
		<div>
			<WCAGLinkColorIndicator { ...props } />
			<ChromePicker
				width="300"
				{ ...props.choices }
				color={ props.value }
				disableAlpha={ true }
				onChangeComplete={ handleChangeComplete }
			/>
		</div>
	);
};

export default WCAGLinkColorFormCustom;
