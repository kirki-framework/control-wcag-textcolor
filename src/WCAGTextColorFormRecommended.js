/* globals React */
/* eslint jsx-a11y/label-has-for: off */
import { HuePicker, CompactPicker } from 'react-color';
import reactCSS from 'reactcss';
import WCAGTextColorIndicator from './WCAGTextColorIndicator';

const WCAGTextColorFormRecommended = ( props ) => {
	// Handle changes to the hue picker.
	const handleChangeCompleteHuePicker = ( color ) => {
		const val = props.control.getAutoColor();
		wp.customize( props.customizerSetting.id ).set( val );
	};

	// Handle changes to the recommended picker.
	const handleChangeComplete = ( color ) => {
		wp.customize( props.customizerSetting.id ).set( color.hex );
	};

	// Styles.
	const styles = reactCSS( {
		default: {
			pickerWrapper: {
				'max-height': '200px',
				'overflow-x': 'hidden',
				'overflow-y': 'auto'
			}
		}
	} );

	return (
		<div>
			<WCAGTextColorIndicator { ...props } />
			<div style={ styles.pickerWrapper }>
				<CompactPicker
					width="300"
					{ ...props.choices }
					color={ props.value }
					colors={ props.recommendedColorsFlat }
					onChangeComplete={ handleChangeComplete }
				/>
			</div>
		</div>
	);
};

export default WCAGTextColorFormRecommended;
