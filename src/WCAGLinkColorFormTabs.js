/* globals React */
/* eslint jsx-a11y/label-has-for: off */
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import WCAGLinkColorFormAuto from './WCAGLinkColorFormAuto';
import WCAGLinkColorFormRecommended from './WCAGLinkColorFormRecommended';
import WCAGLinkColorFormCustom from './WCAGLinkColorFormCustom';

const WCAGLinkColorFormTabs = ( props ) => {
	const switchTab = ( id ) => {
		props.control.setMode( props.control.getAvailableModes()[ id ] );
	};

	// Check if we only have a single mode, and render it without tabs.
	if ( 1 === props.control.getAvailableModes().length ) {
		// Auto.
		if ( props.control.isModeAvailable( 'auto' ) ) {
			return (
				<WCAGLinkColorFormAuto { ...props } />
			);
		}

		// Recommended.
		if ( props.control.isModeAvailable( 'recommended' ) ) {
			return (
				<WCAGLinkColorFormRecommended { ...props } />
			);
		}

		// Custom.
		if ( props.control.isModeAvailable( 'custom' ) ) {
			return (
				<WCAGLinkColorFormCustom { ...props } />
			);
		}
	}

	return (
		<Tabs forceRenderTabPanel defaultIndex={ props.control.getAvailableModes().indexOf( props.activeMode ) } onSelect={ ( index ) => switchTab( index ) }>
			<TabList>
				{ props.control.isModeAvailable( 'auto' ) ? ( <Tab>Auto</Tab> ) : '' }
				{ props.control.isModeAvailable( 'recommended' ) ? ( <Tab>Recommended</Tab> ) : '' }
				{ props.control.isModeAvailable( 'custom' ) ? ( <Tab>Custom</Tab> ) : '' }
			</TabList>
			{ props.control.isModeAvailable( 'auto' ) ? (
				<TabPanel>
					{ 'auto' === props.activeMode ? <WCAGLinkColorFormAuto { ...props } /> : '' }
				</TabPanel>
			) : '' }
			{ props.control.isModeAvailable( 'recommended' ) ? (
				<TabPanel>
					{ 'recommended' === props.activeMode ? <WCAGLinkColorFormRecommended { ...props } /> : '' }
				</TabPanel>
			) : '' }
			{ props.control.isModeAvailable( 'custom' ) ? (
				<TabPanel>
					{ 'custom' === props.activeMode ? <WCAGLinkColorFormCustom { ...props } /> : '' }
				</TabPanel>
			) : '' }
		</Tabs>
	);
};

export default WCAGLinkColorFormTabs;
