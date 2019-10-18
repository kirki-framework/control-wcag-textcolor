/* global jQuery, React, ReactDOM, Color */
import WCAGTextColorForm from './WCAGTextColorForm';

/**
 * WCAGTextColorControl.
 *
 * @class
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
const WCAGTextColorControl = wp.customize.Control.extend( {

	/**
	 * Initialize.
	 *
	 * @param {string} id - Control ID.
	 * @param {Object} params - Control params.
	 */
	initialize( id, params ) {
		const control = this;

		// Bind functions to this control context for passing as React props.
		control.setNotificationContainer = control.setNotificationContainer.bind( control );

		wp.customize.Control.prototype.initialize.call( control, id, params );

		// The following should be eliminated with <https://core.trac.wordpress.org/ticket/31334>.
		function onRemoved( removedControl ) {
			if ( control === removedControl ) {
				control.destroy();
				control.container.remove();
				wp.customize.control.unbind( 'removed', onRemoved );
			}
		}
		wp.customize.control.bind( 'removed', onRemoved );
	},

	/**
	 * Set notification container and render.
	 *
	 * This is called when the React component is mounted.
	 *
	 * @param {Element} element - Notification container.
	 * @return {void}
	 */
	setNotificationContainer: function setNotificationContainer( element ) {
		const control = this;
		control.notifications.container = jQuery( element );
		control.notifications.render();
	},

	/**
	 * Render the control into the DOM.
	 *
	 * This is called from the Control#embed() method in the parent class.
	 *
	 * @return {void}
	 */
	renderContent: function renderContent() {
		const control = this;
		const value = control.setting.get();

		ReactDOM.render(
			<WCAGTextColorForm
				{ ...control.params }
				value={ value }
				setNotificationContainer={ control.setNotificationContainer }
				customizerSetting={ control.setting }
				control={ control }
				backgroundColor={ control.getBackgroundColor() }
				autoColor={ control.getAutoColor() }
				recommendedColorsFlat={ control.getRecommendedColorsFlat() }
				activeMode={ control.getMode() }
			/>,
			control.container[ 0 ]
		);

		if ( false !== control.params.choices.allowCollapse ) {
			control.container.addClass( 'allowCollapse colorPickerIsCollapsed' );
		}
	},

	/**
	 * After control has been first rendered, start re-rendering when setting changes.
	 *
	 * React is able to be used here instead of the wp.customize.Element abstraction.
	 *
	 * @return {void}
	 */
	ready: function ready() {
		const control = this;

		control.setMode( control.getMode() );

		// Re-render control when setting changes.
		control.setting.bind( () => {
			control.renderContent();
		} );

		// Watch for changes to the background color.
		control.watchSetting( control.params.choices.backgroundColor, 'backgroundColor' );
	},

	/**
	 * Get the background color.
	 *
	 * @return {string} - HEX color.
	 */
	getBackgroundColor() {
		const control = this;

		if ( control.backgroundColor ) {
			return control.backgroundColor;
		}

		if (
			0 === control.params.choices.backgroundColor.indexOf( '#' ) ||
			0 === control.params.choices.backgroundColor.indexOf( 'rgb(' ) ||
			0 === control.params.choices.backgroundColor.indexOf( 'rgba(' ) ||
			0 === control.params.choices.backgroundColor.indexOf( 'hsl(' ) ||
			0 === control.params.choices.backgroundColor.indexOf( 'hsla(' )
		) {
			control.backgroundColor = control.params.choices.backgroundColor;
			return control.backgroundColor;
		}

		control.backgroundColor = wp.customize( control.params.choices.backgroundColor ).get();
		return control.backgroundColor;
	},

	/**
	 * Watch defined controls and re-trigger results calculations when there's a change.
	 *
	 * @param {string} settingToWatch - The setting we want to watch or a hardcoded color.
	 * @return {void}
	 */
	watchSetting( settingToWatch ) {
		const control = this;
		const debounce = require( 'lodash.debounce' );
		wp.customize( settingToWatch, function( setting ) {
			setting.bind( debounce( function() {
				// Reset any already-calculated colors.
				control.backgroundColor = false;
				control.recommendedColors = false;

				if ( 'recommended' === control.getMode() || 'auto' === control.getMode() ) {
					if ( 'recommended' === getMode() ) {
						control.setRecommendedColorsFlat();
					}

					const val = control.getAutoColor();
					const noChange = val === control.setting.get();

					control.setting.set( val );

					if ( noChange ) {
						control.renderContent();
					}
				} else {
					control.renderContent();
				}
			}, 100 ) );
	} );

		if ( -1 < settingToWatch.indexOf( '[' ) ) {
			wp.customize( settingToWatch.split( '[' )[ 0 ], function( setting ) {
				setting.bind( debounce( function() {
					// Reset any already-calculated colors.
					control.backgroundColor = false;
					control.recommendedColors = false;

					if ( 'recommended' === control.getMode() || 'auto' === control.getMode() ) {
						if ( 'recommended' === getMode() ) {
							control.setRecommendedColorsFlat();
						}

						const val = control.getAutoColor();
						const noChange = val === control.setting.get();

						control.setting.set( val );

						if ( noChange ) {
							control.renderContent();
						}
					} else {
						control.renderContent();
					}
				}, 100 ) );
			} );
		}
	},

	/**
	 * Get the auto-color.
	 *
	 * @return {string} - Returns the auto-color as a hex value.
	 */
	getAutoColor() {
		return Color( this.getBackgroundColor() ).getMaxContrastColor().toCSS();
	},

	getMode() {
		const control = this;

		// If we already have a mode defined return it.
		if ( control.forcedMode ) {
			return control.forcedMode;
		}

		const availableModes = control.getAvailableModes();

		// If we only have 1 mode, return it.
		if ( 1 === availableModes.length ) {
			return availableModes[ 0 ];
		}

		const currentVal = control.setting.get();

		// Check if auto.
		if ( -1 !== availableModes.indexOf( 'auto' ) && currentVal === control.getAutoColor() ) {
			return 'auto';
		}

		// Check if recommended.
		if ( -1 !== availableModes.indexOf( 'recommended' ) && control.isColorRecommended( currentVal ) ) {
			return 'recommended';
		}

		// If custom is available return it, otherwise fallback to the 1st available.
		return ( -1 !== availableModes.indexOf( 'custom' ) ) ? 'custom' : availableModes[ 0 ];
	},

	isColorRecommended( color ) {
		return -1 !== this.getRecommendedColorsFlat().indexOf( color );
	},

	// Get available modes.
	getAvailableModes() {
		const control = this;
		const availableModes = [];
		[ 'auto', 'recommended', 'custom' ].forEach( function( mode ) {
			if ( control.isModeAvailable( mode ) ) {
				availableModes.push( mode );
			}
		} );
		return availableModes;
	},

	// Check if a mode is available.
	isModeAvailable( mode ) {
		const control = this;
		if ( ! control.params.choices.show ) {
			return true;
		}
		return ( false !== control.params.choices.show[ mode ] );
	},

	// Get an array of colors for all hues.
	getRecommendedColors() {
		const control = this;
		const backgroundColor = Color( control.getBackgroundColor() );
		const isDarkBackground = '#000000' !== backgroundColor.getMaxContrastColor().toCSS();

		const minLightness = isDarkBackground ? 50 : 0;
		const maxLightness = isDarkBackground ? 100 : 50;
		const stepLightness = 10;

		const minSaturation = 0;
		const maxSaturation = 5;
		const stepSaturation = 5;

		const stepHue = 30;

		control.recommendedColors = [];

		for ( let hue = 0; hue <= 360; hue += stepHue ) {

			for ( let saturation = minSaturation; saturation <= maxSaturation; saturation += stepSaturation ) {

				// Double the resulution for black/white.
				let stepL = 0 === saturation ? stepLightness / 2 : stepLightness;

				for ( let lightness = minLightness; lightness <= maxLightness; lightness += stepL ) {

					const item = {
						color: Color( {
							h: hue,
							s: saturation,
							l: lightness
						} )
					}; 
					item.contrastBackground = item.color.getDistanceLuminosityFrom( backgroundColor );

					// Check if the color is already in our array.
					const colorAlreadyInArray = control.recommendedColors.find( function( el ) {
						return el.color._color === item.color._color;
					} );

					// Only add if the color is not already in the array.
					if ( 4.5 < item.contrastBackground && undefined === colorAlreadyInArray ) {
						control.recommendedColors.push( item );
					}
				}
			}
		}

		// Add fallbacks in case we couldn't find any colors.
		if ( ! control.recommendedColors.length ) {
			const item = {
				color: Color( this.getAutoColor() )
			};
			item.contrastBackground = item.color.getDistanceLuminosityFrom( backgroundColor );

			control.recommendedColors.push( item );
		}

		control.recommendedColors.sort( function( a, b ) {
			return b.contrastBackground - a.contrastBackground;
		} );

		return control.recommendedColors;
	},

	/**
	 * Get a flat array of all recommended colors.
	 *
	 * @param {boolean} forceRecalc - When set to true it force-regenerates colors.
	 * @return {Array} - Return an array of strings [ '#hex1', '#hex2' ].
	 */
	getRecommendedColorsFlat( forceRecalc ) {
		if ( forceRecalc || ! this.recommendedColorsFlat ) {
			this.setRecommendedColorsFlat();
		}
		return this.recommendedColorsFlat;
	},

	setRecommendedColorsFlat() {
		const allColors = this.getRecommendedColors();
		this.recommendedColorsFlat = [];
		for ( let i = 0; i < allColors.length; i++ ) {
			this.recommendedColorsFlat.push( allColors[ i ].color.toCSS() );
		}
	},

	setMode( mode ) {
		this.forcedMode = mode;

		if ( 'recommended' === mode ) {
			this.setRecommendedColorsFlat();
		}

		if ( 'auto' === mode || 'recommended' === mode ) {
			this.setting.set( this.getAutoColor() );
		}

		this.renderContent();
	},

	/**
	 * Handle removal/de-registration of the control.
	 *
	 * This is essentially the inverse of the Control#embed() method.
	 *
	 * @see https://core.trac.wordpress.org/ticket/31334
	 * @return {void}
	 */
	destroy: function destroy() {
		const control = this;

		// Garbage collection: undo mounting that was done in the embed/renderContent method.
		ReactDOM.unmountComponentAtNode( control.container[ 0 ] );

		// Call destroy method in parent if it exists (as of #31334).
		if ( wp.customize.Control.prototype.destroy ) {
			wp.customize.Control.prototype.destroy.call( control );
		}
	}
} );

export default WCAGTextColorControl;
