/* globals React, Color */
import reactCSS from 'reactcss';

const WCAGLinkColorIndicator = ( props ) => {

	// Get WCAG contrast with background.
	const getContrastBackground = () => {
		return Math.round( Color( props.value ).getDistanceLuminosityFrom( Color( props.backgroundColor ) ) * 100 ) / 100;
	};

	// Get WCAG contrast with surrounding text.
	const getContrastSurroundingText = () => {
		return Math.round( Color( props.value ).getDistanceLuminosityFrom( Color( props.textColor ) ) * 100 ) / 100;
	};

	// Get rating.
	const getRating = () => {
		const contrastBG = getContrastBackground();
		const contrastST = getContrastSurroundingText();
		let rating = {
			colorOnly: '-',
			underlined: '-',
		};

		// Check if contrast with background is more than 7:1.
		if ( 7 <= contrastBG ) {
			rating.underlined  = 'AAA';

			// Check if contrast with surrounding text is above 3:1
			if ( 3 <= contrastST ) {
				rating.colorOnly = 'AAA';
			}
		} else if ( 4.5 <= contrastBG ) {
			rating.underlined = 'AA';

			// Check if contrast with surrounding text is above 3:1
			if ( 3 <= contrastST ) {
				rating.colorOnly = 'AAA';
			}
		}

		return rating;
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

	let ratingHTML = () => {
		const rating = getRating();
		const ratingColor = {
			'AAA': '#46B450',
			'AA': '#00a0d2',
			'-': '#dc3232'
		};
		let style = {
			underlined: styles.ratingIndicator,
			colorOnly: styles.ratingIndicator
		};
		style.underlined['background-color'] = ratingColor[ rating.underlined ];
		style.colorOnly['background-color'] = ratingColor[ rating.colorOnly ];
		if ( rating.underlined === rating.colorOnly ) {
			return (
				<span style={ styles.underlined }>{ getRating().underlined }</span>
			);
		}

		return (
			<span>
				<span style={ styles.underlined }>{ getRating().underlined }</span>
				<span style={ styles.colorOnly }>{ getRating().colorOnly }</span>
			</span>
		)
	};
console.log( getRating() );
	return (
		<div style={ styles.selectedColorWrapper }>
			<div style={ styles.selectedColorIndicatorWrapper }>
				<div style={ styles.selectedColorIndicator }></div>
				<p style={ styles.selectedColorIndicatorText }>{ props.value }</p>
			</div>
			<table style={ styles.table }>
				<tr>
					<td style={ styles.td }>{ props.i18n.a11yRating }</td>
					<td style={ styles.td }>{ ratingHTML }</td>
				</tr>
				<tr>
					<td style={ styles.td }>{ props.i18n.contrastBg }</td>
					<td style={ styles.td }>{ getContrastBackground() }</td>
				</tr>
				<tr>
					<td style={ styles.td }>{ props.i18n.contrastSt }</td>
					<td style={ styles.td }>{ getContrastSurroundingText() }</td>
				</tr>
			</table>
		</div>
	);
};

export default WCAGLinkColorIndicator;
