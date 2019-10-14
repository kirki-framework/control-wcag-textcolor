<?php
/**
 * Customizer Control: kirki-wcag-link-color.
 *
 * @package   kirki-wcag-link-color
 * @copyright Copyright (c) 2019, Ari Stathopoulos (@aristath)
 * @license   GPL2.0+
 * @since     1.0
 */

namespace WPLemon\Control;

use Kirki\Control\Base;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * React-color control.
 *
 * @since 1.0
 */
class WCAGLinkColor extends Base {

	/**
	 * The control type.
	 *
	 * @access public
	 * @since 1.0
	 * @var string
	 */
	public $type = 'kirki-wcag-link-color';

	/**
	 * The control version.
	 *
	 * @static
	 * @access public
	 * @since 1.0
	 * @var string
	 */
	public static $control_ver = '2.0';

	/**
	 * Enqueue control related scripts/styles.
	 *
	 * @access public
	 * @since 1.0
	 * @return void
	 */
	public function enqueue() {
		parent::enqueue();

		if ( class_exists( '\Kirki\URL' ) ) {
			$folder_url = \Kirki\URL::get_from_path( dirname( dirname( __DIR__ ) ) );
		} else {
			$folder_url = \str_replace(
				\wp_normalize_path( \untrailingslashit( WP_CONTENT_DIR ) ),
				\untrailingslashit( \content_url() ),
				dirname( __DIR__ )
			);
		}

		// Enqueue the script.
		wp_enqueue_script(
			'wplemon-control-auto-links-colorpicker',
			$folder_url . '/dist/main.js',
			[ 'customize-controls', 'wp-element', 'jquery', 'customize-base', 'kirki-dynamic-control', 'wp-color-picker' ],
			self::$control_ver,
			false
		);

		// Enqueue the style.
		wp_enqueue_style(
			'wplemon-control-auto-links-colorpicker-style',
			$folder_url . '/src/style.css',
			[],
			self::$control_ver
		);
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @access public
	 * @since 1.0
	 * @see WP_Customize_Control::to_json()
	 * @return void
	 */
	public function to_json() {

		// Get the basics from the parent class.
		parent::to_json();

		$strings = ( isset( $this->choices['18n'] ) ) ? $this->choices['18n'] : [];

		$this->json['i18n'] = wp_parse_args( $strings,[
			'auto'        => esc_html__( 'Auto', 'kirki-pro' ),
			'recommended' => esc_html__( 'Recommended', 'kirki-pro' ),
			'custom'      => esc_html__( 'Custom', 'kirki-pro' ),
			'a11yRating'  => esc_html__( 'WCAG Rating', 'kirki-pro' ),
			'contrastBg'  => esc_html__( 'Contrast with background', 'kirki-pro' ),
			'contrastSt'  => esc_html__( 'Contrast with surrounding text', 'kirki-pro' ),
		] );
	}

	/**
	 * An Underscore (JS) template for this control's content (but not its container).
	 *
	 * Class variables for this control class are available in the `data` JS object;
	 * export custom variables by overriding {@see WP_Customize_Control::to_json()}.
	 *
	 * @see WP_Customize_Control::print_template()
	 *
	 * @access protected
	 * @since 1.0
	 * @return void
	 */
	protected function content_template() {}
}
