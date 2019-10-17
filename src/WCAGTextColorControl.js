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
				// If auto or recommended mode, change the active color.
				if ( 'auto' === control.getMode() || 'recommended' === control.getMode() ) {
					const val = control.getAutoColor();
					control.setting.set( val );
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
					// If auto or recommended mode, change the active color.
					if ( 'auto' === control.getMode() || 'recommended' === control.getMode() ) {
						const val = control.getAutoColor();
						control.setting.set( val );
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
		let lightnessSteps = ( isDarkBackground ) ? [ 80, 78, 77, 76, 75, 73, 71, 68, 65, 61, 57 ] : [ 20, 22, 23, 24, 25, 27, 29, 32, 35, 39, 43 ];
		if ( control.params.choices.lightnessSteps ) {
			lightnessSteps = ( isDarkBackground ) ? control.params.choices.lightnessSteps[ 1 ] : control.params.choices.lightnessSteps[ 0 ];
		}
		const saturationSteps = ( control.params.choices.saturationSteps ) ? ( control.params.choices.lightnessSteps ) : [ 40, 45, 50, 55, 60, 65, 67.5, 70, 72.5, 75, 77.5, 80, 82.5, 85, 87.5, 90, 92.5, 95, 97.5, 100 ];

		control.recommendedColors = [];

		for ( let hue = 0; hue <= 359; hue += 15 ) {

			for ( let saturation = 0; saturation <= 15; saturation += 15 ) {

				for ( let lightness = 0; lightness <= 100; lightness += 12.5 ) {

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
			return a.contrastBackground - b.contrastBackground;
		} );

		return control.recommendedColors;
	},

	/**
	 * Get a flat array of all recommended colors.
	 *
	 * @param {undefined|number} hue undefined for defaults or a number to force a hue.
	 * @param {boolean} forceRecalc - When set to true it force-regenerates colors.
	 * @return {Array} - Return an array of strings [ '#hex1', '#hex2' ].
	 */
	getRecommendedColorsFlat( hue, forceRecalc ) {
		if ( forceRecalc || ! this.recommendedColorsFlat ) {
			this.setRecommendedColorsFlat( hue );
		}
		return this.recommendedColorsFlat;
	},

	setRecommendedColorsFlat( hue ) {
		const allColors = this.getRecommendedColors( hue );
		this.recommendedColorsFlat = [];
		for ( let i = 0; i < allColors.length; i++ ) {
			this.recommendedColorsFlat.push( allColors[ i ].color.toCSS() );
		}
	},

	setMode( mode ) {
		this.forcedMode = mode;
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
