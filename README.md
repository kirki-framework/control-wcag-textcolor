Example:

```php
new \WPLemon\Field\WCAGTextColor( [
	'settings'    => 'my_setting',
	'label'       => esc_html__( 'My Color Control', 'textdomain' ),
	'description' => esc_html__( 'A description here.', 'textdomain' ),
	'section'     => 'my_section',
	'default'     => '',
	'transport'   => 'postMessage',
	'choices'     => [
		'formComponent'   => 'ChromePicker',
		'backgroundColor' => 'test_accessible_textcolor_control_background', // setting-name or hardcoded color.
		'textColor'       => 'test_accessible_textcolor_control', // setting-name or hardcoded color.
		'show'            => [
			'auto'        => false,
			'recommended' => false,
			'custom'      => true,
		],
	],
	'sanitize_callback' => 'sanitize_text_field',
] );
```
