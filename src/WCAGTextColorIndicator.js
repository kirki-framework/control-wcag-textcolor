/* globals React, Color */
import reactCSS from 'reactcss';

const WCAGTextColorIndicator = ( props ) => {

	// Get WCAG contrast with background.
	const getContrastBackground = () => {
		return Math.round( Color( props.value ).getDistanceLuminosityFrom( Color( props.backgroundColor ) ) * 100 ) / 100;
	};

	// Get rating.
	const getRating = () => {
		const contrastBg = getContrastBackground();

		if ( 7 <= contrastBg ) {
			return 'AAA';
		} else if ( 4.5 <= contrastBg ) {
			return 'AA';
		} else if ( 3 <= contrastBg ) {
			return 'A';
		}
		return '-';
	};

	const getRatingBackgroundColor = () => {
		const rating = getRating();
		switch ( rating ) {
			case 'AAA':
				return '#46B450';
			case 'AA':
				return '#00a0d2';
			case 'A':
				return '#ffb900';
			default:
				return '#dc3232';
		}
	};

	// Styles.
	const styles = reactCSS( {
		default: {
			selectedColorWrapper: {
				'padding-bottom': '12px',
				display: 'grid',
				'grid-template-columns': 'max-content 1fr',
				'grid-gap': '12px'
			},

			selectedColorIndicator: {
				width: '30px',
				height: '30px',
				'border-radius': '50%',
				display: 'block',
				'background-color': props.value,
				'box-shadow': '#000 2px 2px 5px -3px inset'
			},

			selectedColorIndicatorWrapper: {
				display: 'flex',
				'align-items': 'center',
				'justify-content': 'center',
				'flex-direction': 'column'
			},

			selectedColorIndicatorText: {
				'font-size': '10px',
				'font-weight': '700',
				'font-family': 'Menlo, Consolas, monaco, monospace',
				width: 'max-content'
			},

			ratingIndicator: {
				'border-radius': '3px',
				padding: '3px 10px',
				'background-color': getRatingBackgroundColor(),
				color: '#fff',
				'font-weight': '700',
				'font-size': '10px'
			},

			table: {
				'font-size': '10px',
				width: '100%',
				'line-height': '1'
			},

			td: {
				padding: '3px'
			}
		}
	} );

	return (
		<div style={ styles.selectedColorWrapper }>
			<div style={ styles.selectedColorIndicatorWrapper }>
				<div style={ styles.selectedColorIndicator }></div>
				<p style={ styles.selectedColorIndicatorText }>{ props.value }</p>
			</div>
			<table style={ styles.table }>
				<tr>
					<td style={ styles.td }>{ props.i18n.a11yRating }</td>
					<td style={ styles.td }><span style={ styles.ratingIndicator }>{ getRating() }</span></td>
				</tr>
				<tr>
					<td style={ styles.td }>{ props.i18n.contrastBg }</td>
					<td style={ styles.td }>{ getContrastBackground() }</td>
				</tr>
			</table>
		</div>
	);
};

export default WCAGTextColorIndicator;
