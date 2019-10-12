/* globals _, wp, React, Color */
import { HuePicker } from 'react-color';
import { CompactPicker } from 'react-color';
import { ChromePicker } from 'react-color';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import reactCSS from 'reactcss';

const WCAGLinkColorForm = ( props ) => {

	let debounce = require( 'lodash.debounce' );

	// Get the hue. We'll use that to prevent erratic changes.
	window.WCAGLinkControlsHues = window.WCAGLinkControlsHues || {};

	// Get the current mode.
	const getMode = () => {

		if ( props.currentMode ) {
			return props.currentMode;
		}

		const availableModes = getAvailableModes();

		// If we only have 1 mode return it.
		if ( 1 === availableModes.length ) {
			return availableModes[ 0 ];
		}

		// Check if auto.
		if ( isModeAvailable( 'auto' ) ) {
			let auto = Color( props.value )
				.getReadableContrastingColor( Color( getBackgroundColor() ), 5 )
				.toCSS();
			if ( auto === props.value ) {
				return 'auto';
			}
		}

		// Check if recommended.
		if ( isModeAvailable( 'recommended' ) ) {
			let isRecommended = getRecommendedColors().find( function( el ) {
				return el.color.toCSS() === Color( props.value ).toCSS();
			});
			if ( isRecommended ) {
				return 'recommended';
			}
		}

		if ( isModeAvailable( 'custom' ) ) {
			return 'custom';
		}

		if ( 1 <= availableModes.length ) {
			return availableModes[ 0 ];
		}
	};

	// Get available modes.
	const getAvailableModes = () => {
		let availableModes = [];
		[ 'auto', 'recommended', 'custom' ].forEach( function( mode ) {
			if ( isModeAvailable( mode ) ) {
				availableModes.push( mode );
			}
		});
		return availableModes;
	};

	// Check if a mode is available.
	const isModeAvailable = ( mode ) => {
		if ( ! props.choices.show ) {
			return true;
		}
		return ( false !== props.choices.show[ mode ] );
	};

	// Get the background color.
	const getBackgroundColor = () => {
		if ( 0 === props.choices.backgroundColor.indexOf( '#' ) ) {
			return props.choices.backgroundColor;
		}
		return wp.customize( props.choices.backgroundColor ).get();
	}

	// Get the text color.
	const getTextColor = () => {
		if ( 0 === props.choices.textColor.indexOf( '#' ) ) {
			return props.choices.textColor;
		}
		return wp.customize( props.choices.textColor ).get();
	}

	// Get an auto color with a 5:1 contrast with background.
	const getAutoColor = () => {
		window.WCAGLinkControlsHues[ props.customizerSetting.id ] = window.WCAGLinkControlsHues[ props.customizerSetting.id ] || Color( props.value ).h();
		return Color({
			h: window.WCAGLinkControlsHues[ props.customizerSetting.id ],
			s: 50,
			l: 50
		}).getReadableContrastingColor( Color( getBackgroundColor() ), 5 ).toCSS();
	};

	// Get an array of Color objects for recommended colors for this hue.
	const getRecommendedColors = () => {
		const backgroundColor = Color( getBackgroundColor() );
		const textColor = Color( getTextColor() );
		const isDarkBackground = '#000000' !== backgroundColor.getMaxContrastColor().toCSS();
		const minL = isDarkBackground ? 50 : 20;
		const maxL = isDarkBackground ? 80 : 50;
		const stepSaturation = 2.5;
		const stepLightness = 2.5;

		window.WCAGLinkControlsHues[ props.customizerSetting.id ] = window.WCAGLinkControlsHues[ props.customizerSetting.id ] || Color( props.value ).h();

		let colors = [];

		for ( let s = 50; s <= 100; s += stepSaturation ) {
			for ( let l = minL; l <= maxL; l += stepLightness ) {
				let colorAlreadyInArray;
				let item = {
					color: Color({
						h: window.WCAGLinkControlsHues[ props.customizerSetting.id ],
						s: s,
						l: l
					})
				};
				item.contrastBackground = item.color.getDistanceLuminosityFrom( backgroundColor );
				item.contrastText = item.color.getDistanceLuminosityFrom( textColor );
				item.score = item.contrastBackground * item.contrastText;

				// Check if the color is already in our array.
				colorAlreadyInArray = colors.find( function( el ) {
					return el.color._color === item.color._color;
				});

				// Only add if the color is not already in the array.
				if ( 4.5 < item.contrastBackground && undefined === colorAlreadyInArray ) {
					colors.push( item );
				}
			}
		}

		// Add fallbacks in case we couldn't find any colors.
		if ( ! colors.length ) {
			let item = {
				color: Color({
					h: window.WCAGLinkControlsHues[ props.customizerSetting.id ],
					s: 50,
					l: 50
				}).getReadableContrastingColor( backgroundColor )
			};
			item.contrastBackground = item.color.getDistanceLuminosityFrom( backgroundColor );
			item.contrastText = item.color.getDistanceLuminosityFrom( textColor );
			item.score = item.contrastBackground * item.contrastText;

			colors.push( item );
		}

		colors.sort( function( a, b ) {
			return b.score - a.score;
		} );

		return colors;
	};

	// Get an array of recommended HEX colors.
	const getRecommendedColorsFlat = () => {
		const allColors = getRecommendedColors();
		let colors = [];
		for ( let i = 0; i < allColors.length; i++ ) {
			colors.push( allColors[ i ].color.toCSS() );
		}
		return colors;
	}

	// Handle changes to the hue picker.
	const handleChangeCompleteHuePicker = ( color ) => {
		let currentMode = props.currentMode || getMode();

		window.WCAGLinkControlsHues[ props.customizerSetting.id ] = color.hsl.h;

		props.selectedColor = color;

		if ( 'recommended' === currentMode ) {

			// Set the 1st recommended color.
			setValue( getRecommendedColorsFlat()[ 0 ] );
		} else if ( 'auto' === currentMode ) {

			// Set the auto color.
			setValue( getAutoColor( false, color.hsl.h ) );
		} else if ( 'custom' === currentMode ) {

			// Change the hue.
			setValue( Color( props.value ).h( color.hsl.h ).toCSS() );
		}
	};

	// Handle changes to the recommended picker.
	const handleChangeComplete = ( color ) => {
		setValue( color.hex );
	};

	// Handle changes to the recommended picker.
	const handleChangeCompleteCustom = ( color ) => {
		window.WCAGLinkControlsHues[ props.customizerSetting.id ] = color.hsl.h;
		setValue( color.hex );
	};

	const setValue = ( val ) => {
		let currentVal = wp.customize( props.customizerSetting.id ).get();
		if ( val !== currentVal ) {
			wp.customize( props.customizerSetting.id ).set( val );
		}
	}

	const switchTab = ( id ) => {
		setMode( getAvailableModes()[ id ] );
	};

	// Change the current mode.
	const setMode = ( mode ) => {
		props.currentMode = mode;
	};

	// Watch defined controls and re-trigger results calculations when there's a change.
	const watchSetting = function( settingToWatch ) {
		// No need to watch anything if we have a hardcoded color.
		if (
			0 === settingToWatch.indexOf( '#' ) ||
			0 === settingToWatch.indexOf( 'rgb(' ) ||
			0 === settingToWatch.indexOf( 'rgba(' ) ||
			0 === settingToWatch.indexOf( 'hsl(' ) ||
			0 === settingToWatch.indexOf( 'hsla(' )
		) {
			return;
		}

		let currentMode = getMode();

		wp.customize( settingToWatch, function( setting ) {
			setting.bind( debounce( function() {
				if ( 'auto' === currentMode || 'recommended' === currentMode ) {
					setValue( getAutoColor() );
				}
			}, 50 ));
		});

		if ( -1 < settingToWatch.indexOf( '[' ) ) {
			wp.customize( settingToWatch.split( '[' )[0], function( setting ) {
				setting.bind( debounce( function() {
					if ( 'auto' === currentMode || 'recommended' === currentMode ) {
						setValue( getAutoColor() );
					}
				}, 50 ));
			});
		}
	};

	// Watch for changes to the background color.
	watchSetting( props.choices.backgroundColor );

	// Watch for changes to the text color.
	watchSetting( props.choices.textColor );

	const getRatingBackgroundColor = () => {
		let rating = getRating();
		if ( 'AAA' === rating ) {
			return '#008a20';
		}
		if ( 'AA' === rating ) {
			return '#187aa2';
		}
		return '#d63638';
	};

	// Get WCAG contrast with background.
	const getContrastBackground = () => {
		return Math.round( Color( props.value ).getDistanceLuminosityFrom( Color( getBackgroundColor() ) ) * 100 ) / 100;
	}

	// Get WCAG contrast with surrounding text.
	const getContrastSurroundingText = () => {
		return Math.round( Color( props.value ).getDistanceLuminosityFrom( Color( getTextColor() ) ) * 100 ) / 100;
	}

	// Get rating.
	const getRating = () => {
		if ( 7 <= getContrastBackground() && 3 <= getContrastSurroundingText() ) {
			return 'AAA';
		}

		if ( 4.5 <= getContrastBackground() ) {
			return 'AA';
		}
		return ' - ';
	};

	// Styles.
	const styles = reactCSS({
		'default': {
			controlHead: {},

			hueWrapper: {
				position: 'relative',
				padding: '12px 0',
				// Hide hue-picker if we only have custom.
				display: ( 1 === getAvailableModes().length && isModeAvailable( 'custom' ) ) ? 'none' : 'block',
			},

			tabsWrapper: {},

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
				'background-color': props.value
			},

			selectedColorIndicatorWrapper: {
				display: 'flex',
				'align-items': 'center',
				'justify-content': 'center',
				'flex-direction': 'column',
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
			},

			tabPanel: {
			},

			pickerWrapper: {
				'max-height': '350px',
				'overflow-x': 'hidden',
				'overflow-y': 'auto'
			}
		}
	});

	const selectedColor = <div style={ styles.selectedColorWrapper }>
		<div style={ styles.selectedColorIndicatorWrapper }>
			<div style={ styles.selectedColorIndicator }></div>
			<p style={ styles.selectedColorIndicatorText }>{ props.value }</p>
		</div>
		<table style={ styles.table }>
			<tr>
				<td style={ styles.td }>Rating</td>
				<td style={ styles.td }><span style={ styles.ratingIndicator }>{ getRating() }</span></td>
			</tr>
			<tr>
				<td style={ styles.td }>Contrast with background</td>
				<td style={ styles.td }>{ getContrastBackground() }</td>
			</tr>
			<tr>
				<td style={ styles.td }>Contrast with surrounding text</td>
				<td style={ styles.td }>{ getContrastSurroundingText() }</td>
			</tr>
		</table>
	</div>;

	// The autoColor element.
	let autoColor = ( isModeAvailable( 'auto' ) ) ? selectedColor : false;

	// The recommended color element.
	let recommendedColors = false;
	if ( isModeAvailable( 'recommended' ) ) {
		recommendedColors = '';
		if ( ! props.currentMode || 'recommended' === props.currentMode ) {
			recommendedColors = <div>
				{ selectedColor }
				<div style={ styles.pickerWrapper }>
					<CompactPicker
						width="300"
						{ ...props.choices }
						color={ props.value }
						colors={ getRecommendedColorsFlat() }
						onChangeComplete={ handleChangeComplete }
					/>
				</div>
			</div>;
		}
	}

	// The custom color element.
	let customPicker = false;
	if ( isModeAvailable( 'custom' ) ) {
		customPicker = '';
		if ( ! props.currentMode || 'custom' === props.currentMode ) {
			customPicker = <div>
				{ selectedColor }
				<div style={ styles.pickerWrapper }>
					<ChromePicker
						width="300"
						{ ...props.choices }
						color={ props.value }
						disableAlpha={ true }
						onChangeComplete={ handleChangeCompleteCustom }
					/>
				</div>
			</div>;
		}
	}

	let autoTabTitle = '';
	let autoTab = '';
	if ( autoColor ) {
		autoTabTitle = <Tab>Auto</Tab>;
		autoTab = <TabPanel style={ styles.tabPanel }>{ autoColor }</TabPanel>;
	}

	let recommendedTabTitle = '';
	let recommendedTab = '';
	if ( recommendedColors ) {
		recommendedTabTitle = <Tab>Recommended</Tab>;
		recommendedTab = <TabPanel style={ styles.tabPanel }>{ recommendedColors }</TabPanel>;
	}

	let customTabTitle = '';
	let customTab = '';
	if ( customPicker ) {
		customTabTitle = <Tab>Custom</Tab>;
		customTab = <TabPanel style={ styles.tabPanel }>{ customPicker }</TabPanel>;
	}

	let tabs = '';
	if ( 1 === getAvailableModes().length ) {
		if ( isModeAvailable( 'auto' ) ) {
			tabs = autoColor;
		} else if ( isModeAvailable( 'recommended' ) ) {
			tabs = recommendedColors;
		} else {
			tabs = customPicker;
		}
	} else {
		tabs = <Tabs forceRenderTabPanel defaultIndex={ getAvailableModes().indexOf( getMode() )} onSelect={ index => switchTab( index ) }>
			<TabList>
				{ autoTabTitle }
				{ recommendedTabTitle }
				{ customTabTitle }
			</TabList>
			{ autoTab }
			{ recommendedTab }
			{customTab }
		</Tabs>
	}

	return (
		<div>
			<div style={ styles.controlHead }>
				<label className="customize-control-title">{ props.label }</label>
				<span class="description customize-control-description" dangerouslySetInnerHTML={{ __html: props.description }}></span>
				<div className="customize-control-notifications-container" ref={ props.setNotificationContainer }></div>
			</div>

			<div style={ styles.hueWrapper }>
				<HuePicker
					width="300"
					{ ...props.choices }
					color={ props.value }
					onChangeComplete={ handleChangeCompleteHuePicker }
				/>
			</div>

			<div style={ styles.tabsWrapper }>
				{ tabs }
			</div>
		</div>
	);
};

export default WCAGLinkColorForm;
