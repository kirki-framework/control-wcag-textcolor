/* globals React */
/* eslint jsx-a11y/label-has-for: off */
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import WCAGTextColorFormAuto from './WCAGTextColorFormAuto';
import WCAGTextColorFormRecommended from './WCAGTextColorFormRecommended';
import WCAGTextColorFormCustom from './WCAGTextColorFormCustom';

const WCAGTextColorFormTabs = ( props ) => {
	const switchTab = ( id ) => {
		props.control.setMode( props.control.getAvailableModes()[ id ] );
	};

	// Check if we only have a single mode, and render it without tabs.
	if ( 1 === props.control.getAvailableModes().length ) {
		// Auto.
		if ( props.control.isModeAvailable( 'auto' ) ) {
			return (
				<WCAGTextColorFormAuto { ...props } />
			);
		}

		// Recommended.
		if ( props.control.isModeAvailable( 'recommended' ) ) {
			return (
				<WCAGTextColorFormRecommended { ...props } />
			);
		}

		// Custom.
		if ( props.control.isModeAvailable( 'custom' ) ) {
			return (
				<WCAGTextColorFormCustom { ...props } />
			);
		}
	}

	return (
		<Tabs forceRenderTabPanel defaultIndex={ props.control.getAvailableModes().indexOf( props.activeMode ) } onSelect={ ( index ) => switchTab( index ) }>
			<TabList>
				{ props.control.isModeAvailable( 'auto' ) ? ( <Tab>{ props.i18n.auto }</Tab> ) : '' }
				{ props.control.isModeAvailable( 'recommended' ) ? ( <Tab>{ props.i18n.recommended }</Tab> ) : '' }
				{ props.control.isModeAvailable( 'custom' ) ? ( <Tab>{ props.i18n.custom }</Tab> ) : '' }
			</TabList>
			{ props.control.isModeAvailable( 'auto' ) ? (
				<TabPanel>
					{ 'auto' === props.activeMode ? <WCAGTextColorFormAuto { ...props } /> : '' }
				</TabPanel>
			) : '' }
			{ props.control.isModeAvailable( 'recommended' ) ? (
				<TabPanel>
					{ 'recommended' === props.activeMode ? <WCAGTextColorFormRecommended { ...props } /> : '' }
				</TabPanel>
			) : '' }
			{ props.control.isModeAvailable( 'custom' ) ? (
				<TabPanel>
					{ 'custom' === props.activeMode ? <WCAGTextColorFormCustom { ...props } /> : '' }
				</TabPanel>
			) : '' }
		</Tabs>
	);
};

export default WCAGTextColorFormTabs;
