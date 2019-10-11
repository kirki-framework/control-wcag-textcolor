/* globals _, wp, React */
import { AlphaPicker } from 'react-color';
import { BlockPicker } from 'react-color';
import { ChromePicker } from 'react-color';
import { CirclePicker } from 'react-color';
import { CompactPicker } from 'react-color';
import { GithubPicker } from 'react-color';
import { HuePicker } from 'react-color';
import { MaterialPicker } from 'react-color';
import { PhotoshopPicker } from 'react-color';
import { SketchPicker } from 'react-color';
import { SliderPicker } from 'react-color';
import { SwatchesPicker } from 'react-color';
import { TwitterPicker } from 'react-color';
import reactCSS from 'reactcss';

const WCAGLinkColorForm = ( props ) => {

	const handleChangeComplete = ( color ) => {
		if ( 1 === color.rgb.a ) {
			wp.customize.control( props.customizerSetting.id ).setting.set( color.hex );
		} else {
			wp.customize.control( props.customizerSetting.id ).setting.set( 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')' );
		}
	};

	const styles = reactCSS({
		'default': {
			details: {
				border: '1px solid rgba(0,0,0,.2)',
				padding: '5px',
				'border-radius': '5px'
			},

			summary: {
				display: 'flex',
				'align-items': 'center',
			},

			summaryColor: {
				background: props.value,
				display: 'block',
				width: '40px',
				height: '2em',
				'border-radius': '4px',
				border: '1px solid rgba(0,0,0,.2)',
			},

			summaryText: {
				color: '#a0a0a0',
				padding: '0 12px',
				'font-family': 'Menlo, Consolas, monaco, monospace'
			}
		},
	});

	let controlLabel = <label className="customize-control-title">{ props.label }</label>;
	let controlDescription = <span class="description customize-control-description" dangerouslySetInnerHTML={{ __html: props.description }}></span>;
	let controlNotifications = <div className="customize-control-notifications-container" ref={ props.setNotificationContainer }></div>;
	let summary = <summary style={ styles.summary }><span style={ styles.summaryColor }></span><span style={ styles.summaryText }>{ props.value }</span></summary>
	let isSummaryDefaultOpen = ( true === props.choices.summaryOpen ) ? 'open="true"' : '';

	switch ( props.choices.formComponent ) {
		case 'AlphaPicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<div class="colorPickerContainer">
						<AlphaPicker
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</div>
				</div>
			);
		case 'BlockPicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<details style={ styles.details } class="colorPickerContainer" { ...isSummaryDefaultOpen }>
						{ summary }
						<BlockPicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</details>
				</div>
			);
		case 'ChromePicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<details style={ styles.details } class="colorPickerContainer" { ...isSummaryDefaultOpen }>
						{ summary }
						<ChromePicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</details>
				</div>
			);
		case 'CirclePicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<div class="colorPickerContainer">
						<CirclePicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</div>
				</div>
			);
		case 'CompactPicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<div class="colorPickerContainer">
						<CompactPicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</div>
				</div>
			);
		case 'GithubPicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<div class="colorPickerContainer">
						<GithubPicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</div>
				</div>
			);
		case 'HuePicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<div class="colorPickerContainer">
						<HuePicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</div>
				</div>
			);
		case 'MaterialPicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<div class="colorPickerContainer">
						<MaterialPicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</div>
				</div>
			);
		case 'PhotoshopPicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<details style={ styles.details } class="colorPickerContainer" { ...isSummaryDefaultOpen }>
						{ summary }
						<PhotoshopPicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</details>
				</div>
			);
		case 'SketchPicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<details style={ styles.details } class="colorPickerContainer" { ...isSummaryDefaultOpen }>
						{ summary }
						<SketchPicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</details>
				</div>
			);
		case 'SliderPicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<div class="colorPickerContainer">
						<SliderPicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</div>
				</div>
			);
		case 'SwatchesPicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<div class="colorPickerContainer">
						<SwatchesPicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</div>
				</div>
			);
		case 'TwitterPicker':
			return (
				<div>
					{ controlLabel }{ controlDescription }{ controlNotifications }
					<details style={ styles.details } class="colorPickerContainer" { ...isSummaryDefaultOpen }>
						{ summary }
						<TwitterPicker
							width="300"
							{ ...props.choices }
							color={ props.value }
							onChangeComplete={ handleChangeComplete }
						/>
					</details>
				</div>
			);
	}
};

export default WCAGLinkColorForm;
