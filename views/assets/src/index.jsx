import { useState, useEffect } from 'react';
import { createRoot } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { Toaster, toast } from 'sonner';
import {
	Palette,
	Layers,
	Sliders,
	Shield,
	FileJson,
	FolderLock,
	Check,
	ChevronRight,
	Sparkles,
	UserCheck,
	Loader2,
} from 'lucide-react';

import useApi from '@hooks/useApi';
import TemplateSelector from './components/TemplateSelector';
import ColorCustomizer from './components/ColorCustomizer';
import MenuPreview from './components/MenuPreview';
import ExportModal from './components/ExportModal';

import './index.css';

// Simple sanitization helper
const sanitize = ( html ) => {
	if ( typeof html !== 'string' ) {
		return '';
	}
	return html
		.replace( /&/g, '&amp;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' )
		.replace( /"/g, '&quot;' )
		.replace( /'/g, '&#039;' );
};

// Expose public bridge
window.Saasvibe = {
	components: { TemplateSelector, ColorCustomizer, MenuPreview },
	utils: { sanitize },
};

const App = () => {
	const api = useApi();

	// Configuration states loaded from localized variable
	const initialSettings = window.Saasvibe_Vars?.settings || {};
	const [ settings, setSettings ] = useState( {
		templateId: 'linear-dark',
		brandColor: '',
		density: 'normal',
		customLogo: '',
		topBarHeight: 46,
		sidebarWidth: 240,
		environmentBadge: {
			enabled: true,
			label: 'Development',
			color: '#5E6AD2',
		},
		hideTopBarItems: {
			wpLogo: true,
			siteName: false,
			search: false,
			notifications: false,
			howdy: false,
		},
		roleVisibility: {},
		wizard_completed: false,
		...initialSettings,
	} );

	const [ activeTab, setActiveTab ] = useState( 'templates' );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ showExportModal, setShowExportModal ] = useState( false );
	const [ showWizard, setShowWizard ] = useState(
		! settings.wizard_completed
	);
	const [ wizardStep, setWizardStep ] = useState( 1 );

	// License variables
	const [ licenseKey, setLicenseKey ] = useState(
		window.Saasvibe_Vars?.license?.key || ''
	);
	const [ isActivatingLicense, setIsActivatingLicense ] = useState( false );
	const [ isPro, setIsPro ] = useState(
		window.Saasvibe_Vars?.is_pro || false
	);

	useEffect( () => {
		const brandColor = settings.brandColor || window.Saasvibe_Vars?.wp_brand_color || '#5E6AD2';
		const root = document.getElementById( 'saasvibe-app' );
		if ( root ) {
			const hexToRgb = ( hex ) => {
				hex = hex.replace( '#', '' );
				if ( hex.length === 3 ) {
					hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
				}
				const num = parseInt( hex, 16 );
				return {
					r: ( num >> 16 ) & 255,
					g: ( num >> 8 ) & 255,
					b: num & 255,
				};
			};

			const getContrastColor = ( rgb ) => {
				const luminance = ( 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b ) / 255;
				return luminance > 0.5 ? '#000000' : '#FFFFFF';
			};

			try {
				const rgb = hexToRgb( brandColor );
				const hoverColor = `rgba(${ rgb.r }, ${ rgb.g }, ${ rgb.b }, 0.10)`;
				const textColor = getContrastColor( rgb );

				root.style.setProperty( '--saasvibe-brand-color', brandColor );
				root.style.setProperty( '--saasvibe-brand-hover-color', hoverColor );
				root.style.setProperty( '--saasvibe-brand-text-color', textColor );
			} catch ( e ) {
				root.style.setProperty( '--saasvibe-brand-color', '#5E6AD2' );
				root.style.setProperty( '--saasvibe-brand-hover-color', 'rgba(94, 106, 210, 0.10)' );
				root.style.setProperty( '--saasvibe-brand-text-color', '#FFFFFF' );
			}
		}
	}, [ settings.brandColor ] );

	// Get active template info
	const templates = window.Saasvibe_Vars?.templates || [];
	const activeTemplate =
		templates.find( ( t ) => t.id === settings.templateId ) ||
		templates[ 0 ];

	const handleSettingChange = ( key, value ) => {
		setSettings( ( prev ) => ( {
			...prev,
			[ key ]: value,
		} ) );
	};

	const handleNestedChange = ( parentKey, childKey, value ) => {
		setSettings( ( prev ) => ( {
			...prev,
			[ parentKey ]: {
				...prev[ parentKey ],
				[ childKey ]: value,
			},
		} ) );
	};

	const handleSaveSettings = async () => {
		setIsSaving( true );
		try {
			const response = await api.post( 'settings', settings );
			if ( response.success ) {
				toast.success(
					__( 'Settings saved successfully!', 'saasvibe' )
				);
				// Sync global var so page reloads have it
				if ( window.Saasvibe_Vars ) {
					window.Saasvibe_Vars.settings = response.data;
				}
			} else {
				toast.error(
					response.message ||
						__( 'Failed to save settings.', 'saasvibe' )
				);
			}
		} catch ( err ) {
			toast.error(
				err.message ||
					__( 'Connection error. Please try again.', 'saasvibe' )
			);
		} finally {
			setIsSaving( false );
		}
	};

	const handleLicenseActivate = async ( e ) => {
		e.preventDefault();
		if ( ! licenseKey ) {
			return;
		}

		setIsActivatingLicense( true );
		// Simulate remote activation API check
		setTimeout( () => {
			setIsActivatingLicense( false );
			if (
				licenseKey.startsWith( 'PRO-' ) ||
				licenseKey.startsWith( 'AGENCY-' )
			) {
				setIsPro( true );
				if ( window.Saasvibe_Vars ) {
					window.Saasvibe_Vars.is_pro = true;
					if ( ! window.Saasvibe_Vars.settings ) {
						window.Saasvibe_Vars.settings = {};
					}
					window.Saasvibe_Vars.settings.license_tier =
						licenseKey.startsWith( 'AGENCY-' ) ? 'agency' : 'pro';
				}
				toast.success(
					__(
						'License activated successfully! Pro templates unlocked.',
						'saasvibe'
					)
				);
			} else {
				toast.error(
					__(
						'Invalid license key format. Use keys starting with PRO- or AGENCY-.',
						'saasvibe'
					)
				);
			}
		}, 1200 );
	};

	const handleWizardComplete = async () => {
		setIsSaving( true );
		const updatedSettings = {
			...settings,
			wizard_completed: true,
		};
		try {
			const response = await api.post( 'settings', updatedSettings );
			if ( response.success ) {
				setSettings( updatedSettings );
				setShowWizard( false );
				toast.success(
					__(
						'Wizard completed! Welcome to your new admin panel.',
						'saasvibe'
					)
				);
			}
		} catch ( err ) {
			toast.error( __( 'Error saving wizard progress.', 'saasvibe' ) );
		} finally {
			setIsSaving( false );
		}
	};

	// Render Wizard View
	if ( showWizard ) {
		return (
			<div className="fixed inset-0 flex items-center justify-center p-4 z-[9999] bg-slate-100/80 backdrop-blur-md select-none text-slate-800">
				<div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
					{ /* Left onboarding column info */ }
					<div className="bg-slate-50 p-8 md:w-1/3 flex flex-col justify-between border-r border-slate-200">
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-indigo-600">
								<Sparkles className="h-6 w-6 animate-pulse" />
								<span className="font-bold text-sm tracking-wider uppercase">
									{ __( 'Saasvibe', 'saasvibe' ) }
								</span>
							</div>
							<h2 className="text-2xl font-bold leading-tight text-slate-800">
								{ __(
									'Transform your admin backend.',
									'saasvibe'
								) }
							</h2>
							<p className="text-xs text-slate-500 leading-relaxed">
								{ __(
									'Get set up in less than 60 seconds. Customize templates, match brand elements, and assign clean workspaces.',
									'saasvibe'
								) }
							</p>
						</div>

						{ /* Steps tracker */ }
						<div className="space-y-3 mt-8">
							{ [
								{
									step: 1,
									label: __( 'Design Theme', 'saasvibe' ),
								},
								{
									step: 2,
									label: __( 'Brand Identity', 'saasvibe' ),
								},
								{
									step: 3,
									label: __( 'All Done', 'saasvibe' ),
								},
							].map( ( s ) => (
								<div
									key={ s.step }
									className="flex items-center gap-2.5"
								>
									<span
										className={ `w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
											wizardStep === s.step
												? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
												: wizardStep > s.step
												? 'bg-green-600 text-white'
												: 'bg-slate-200 text-slate-400'
										}` }
									>
										{ wizardStep > s.step ? (
											<Check className="h-3 w-3" />
										) : (
											s.step
										) }
									</span>
									<span
										className={ `text-xs font-semibold ${
											wizardStep === s.step
												? 'text-slate-800'
												: 'text-slate-400'
										}` }
									>
										{ s.label }
									</span>
								</div>
							) ) }
						</div>
					</div>

					{ /* Right active panel column */ }
					<div className="flex-1 p-8 flex flex-col justify-between bg-white">
						{ /* Step content */ }
						<div className="flex-1">
							{ wizardStep === 1 && (
								<div className="space-y-6">
									<div>
										<span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
											{ __( 'Step 1 of 3', 'saasvibe' ) }
										</span>
										<h3 className="text-xl font-bold mt-1 text-slate-800">
											{ __(
												'Choose a visual layout',
												'saasvibe'
											) }
										</h3>
										<p className="text-xs text-slate-500 mt-1">
											{ __(
												'Select the layout theme that matches your brand style.',
												'saasvibe'
											) }
										</p>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
										{ templates
											.slice( 0, 3 )
											.map( ( t ) => (
												<div
													key={ t.id }
													onClick={ () =>
														handleSettingChange(
															'templateId',
															t.id
														)
													}
													className={ `border rounded-xl p-4 cursor-pointer transition-all ${
														settings.templateId ===
														t.id
															? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
															: 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:shadow-xs'
													}` }
												>
													<div className="flex items-center justify-between">
														<span className="text-xs font-bold">
															{ t.name }
														</span>
														{ settings.templateId ===
															t.id && (
															<span className="bg-indigo-600 text-white rounded-full p-0.5">
																<Check className="h-3 w-3" />
															</span>
														) }
													</div>
													<span className="text-[10px] text-slate-400 mt-1 block font-mono">
														{ t.designRef }
													</span>
												</div>
											) ) }
									</div>
								</div>
							) }

							{ wizardStep === 2 && (
								<div className="space-y-6">
									<div>
										<span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">
											{ __( 'Step 2 of 3', 'saasvibe' ) }
										</span>
										<h3 className="text-xl font-bold mt-1 text-slate-800">
											{ __(
												'Establish brand color & logo',
												'saasvibe'
											) }
										</h3>
										<p className="text-xs text-slate-500 mt-1">
											{ __(
												'Inject your identity directly into the sidebar highlights and top accent.',
												'saasvibe'
											) }
										</p>
									</div>
									<div className="space-y-4">
										<div className="space-y-2">
											<label className="text-xs font-medium text-slate-500 block">
												{ __(
													'Brand color (HEX)',
													'saasvibe'
												) }
											</label>
											<div className="flex items-center gap-3">
												<input
													type="color"
													value={
														settings.brandColor || window.Saasvibe_Vars?.wp_brand_color || '#5E6AD2'
													}
													onChange={ ( e ) =>
														handleSettingChange(
															'brandColor',
															e.target.value
														)
													}
													className="w-10 h-10 p-0 border border-slate-200 rounded cursor-pointer bg-transparent"
												/>
												<input
													type="text"
													value={
														settings.brandColor
													}
													placeholder={
														window.Saasvibe_Vars?.wp_brand_color || '#5E6AD2'
													}
													onChange={ ( e ) =>
														handleSettingChange(
															'brandColor',
															e.target.value
														)
													}
													className="border border-slate-300 rounded px-3 py-1.5 text-xs font-mono uppercase text-slate-800 w-32"
												/>
											</div>
										</div>

										<div className="space-y-2">
											<label className="text-xs font-medium text-slate-500 block">
												{ __(
													'Custom Logo URL (Optional)',
													'saasvibe'
												) }
											</label>
											<input
												type="text"
												placeholder="https://example.com/logo.png"
												value={ settings.customLogo }
												onChange={ ( e ) =>
													handleSettingChange(
														'customLogo',
														e.target.value
													)
												}
												className="border border-slate-300 rounded px-3 py-2 text-xs w-full focus:outline-none focus:border-indigo-600 text-slate-800 bg-white"
											/>
										</div>
									</div>
								</div>
							) }

							{ wizardStep === 3 && (
								<div className="space-y-6">
									<div className="text-center py-6 space-y-3">
										<div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200">
											<Check className="h-6 w-6" />
										</div>
										<h3 className="text-xl font-bold text-slate-800">
											{ __(
												'Setup Complete!',
												'saasvibe'
											) }
										</h3>
										<p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
											{ __(
												'Your configuration defaults have been set. Saving changes will transform your WordPress dashboard experience.',
												'saasvibe'
											) }
										</p>
									</div>
								</div>
							) }
						</div>

						{ /* Step navigation buttons */ }
						<div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100 shrink-0">
							{ wizardStep > 1 ? (
								<button
									onClick={ () =>
										setWizardStep( ( prev ) => prev - 1 )
									}
									className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
								>
									{ __( 'Back', 'saasvibe' ) }
								</button>
							) : (
								<button
									onClick={ () => {
										// Skip entire wizard
										handleWizardComplete();
									} }
									className="text-slate-400 hover:text-slate-600 text-xs font-medium"
								>
									{ __( 'Skip Setup', 'saasvibe' ) }
								</button>
							) }

							{ wizardStep < 3 ? (
								<button
									onClick={ () =>
										setWizardStep( ( prev ) => prev + 1 )
									}
									className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
								>
									{ __( 'Continue', 'saasvibe' ) }
									<ChevronRight className="h-3.5 w-3.5" />
								</button>
							) : (
								<button
									onClick={ handleWizardComplete }
									disabled={ isSaving }
									className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
								>
									{ isSaving ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : null }
									{ __( 'Start Customizing', 'saasvibe' ) }
								</button>
							) }
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="saasvibe-container min-h-screen bg-slate-50 flex flex-col select-none">
			<Toaster position="top-right" richColors />

			{ /* Global Header panel */ }
			<header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm shrink-0">
				<div className="flex items-center gap-3">
					<div className="bg-indigo-600 text-white p-2 rounded-xl">
						<Sparkles className="h-5 w-5" />
					</div>
					<div>
						<h1 className="text-lg font-bold text-slate-800 m-0 leading-tight">
							{ __( 'Saasvibe', 'saasvibe' ) }
						</h1>
						<span className="text-xs text-slate-400">
							{ sprintf(
								__( 'Version %s', 'saasvibe' ),
								window.Saasvibe_Vars?.version || '2.0.0'
							) }
						</span>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<button
						onClick={ () => setShowWizard( true ) }
						className="bg-white border border-slate-200 hover:border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
					>
						{ __( 'Onboarding Wizard', 'saasvibe' ) }
					</button>
					<button
						onClick={ handleSaveSettings }
						disabled={ isSaving }
						className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
					>
						{ isSaving ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : null }
						{ __( 'Save Settings', 'saasvibe' ) }
					</button>
				</div>
			</header>

			{ /* Main App area split screen */ }
			<div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-[500px]">
				{ /* Tabs and configurations Column */ }
				<div className="flex-1 flex flex-col bg-white overflow-y-auto">
					{ /* Tab selectors bar */ }
					<div className="flex border-b border-slate-100 bg-slate-50/50 px-6 overflow-x-auto shrink-0">
						{ [
							{
								id: 'templates',
								label: __( 'Templates', 'saasvibe' ),
								icon: <Layers className="h-4 w-4" />,
							},
							{
								id: 'colors',
								label: __( 'Styling', 'saasvibe' ),
								icon: <Palette className="h-4 w-4" />,
							},
							{
								id: 'roles',
								label: __( 'Role Visibility', 'saasvibe' ),
								icon: <UserCheck className="h-4 w-4" />,
							},
							{
								id: 'advanced',
								label: __( 'Advanced', 'saasvibe' ),
								icon: <Sliders className="h-4 w-4" />,
							},
							{
								id: 'license',
								label: __( 'License', 'saasvibe' ),
								icon: <Shield className="h-4 w-4" />,
							},
						].map( ( tab ) => (
							<button
								key={ tab.id }
								onClick={ () => setActiveTab( tab.id ) }
								className={ `flex items-center gap-2 py-4 px-4 border-b-2 text-xs font-semibold transition-all ${
									activeTab === tab.id
										? 'border-indigo-600 text-indigo-600'
										: 'border-transparent text-slate-500 hover:text-slate-800'
								}` }
							>
								{ tab.icon }
								{ tab.label }
							</button>
						) ) }
					</div>

					{ /* Tab Panels */ }
					<div className="flex-1 overflow-y-auto">
						{ activeTab === 'templates' && (
							<TemplateSelector
								currentTemplate={ settings.templateId }
								onSelect={ ( id ) =>
									handleSettingChange( 'templateId', id )
								}
							/>
						) }

						{ activeTab === 'colors' && (
							<ColorCustomizer
								settings={ settings }
								onChange={ handleSettingChange }
								activeTemplate={ activeTemplate }
							/>
						) }

						{ activeTab === 'roles' && (
							<div className="p-6">
								<div className="mb-6">
									<h2 className="text-xl font-semibold text-slate-800 m-0">
										{ __(
											'Role-Based Visibility Matrix',
											'saasvibe'
										) }
									</h2>
									<p className="text-sm text-slate-500 mt-1">
										{ __(
											'Select which WordPress user roles should hide specific navigation menu items.',
											'saasvibe'
										) }
									</p>
								</div>

								<div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
									<table className="w-full text-left text-xs border-collapse">
										<thead>
											<tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
												<th className="p-4">
													{ __(
														'Navigation Menu Item',
														'saasvibe'
													) }
												</th>
												{ (
													window.Saasvibe_Vars
														?.roles || []
												).map( ( role ) => (
													<th
														key={ role.key }
														className="p-4 text-center"
													>
														{ role.name }
													</th>
												) ) }
											</tr>
										</thead>
										<tbody>
											{ (
												window.Saasvibe_Vars
													?.menuItems || []
											).map( ( item ) => (
												<tr
													key={ item.id }
													className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
												>
													<td className="p-4 font-medium text-slate-700">
														{ item.title }
													</td>
													{ (
														window.Saasvibe_Vars
															?.roles || []
													).map( ( role ) => {
														const isHidden =
															settings
																.roleVisibility?.[
																role.key
															]?.[ item.id ] ||
															false;

														return (
															<td
																key={ role.key }
																className="p-4 text-center"
															>
																<input
																	type="checkbox"
																	checked={
																		isHidden
																	}
																	onChange={ (
																		e
																	) => {
																		const roleMap =
																			settings
																				.roleVisibility?.[
																				role
																					.key
																			] ||
																			{};
																		const updatedRoleMap =
																			{
																				...roleMap,
																				[ item.id ]:
																					e
																						.target
																						.checked,
																			};
																		handleSettingChange(
																			'roleVisibility',
																			{
																				...settings.roleVisibility,
																				[ role.key ]:
																					updatedRoleMap,
																			}
																		);
																	} }
																	className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
																/>
															</td>
														);
													} ) }
												</tr>
											) ) }
										</tbody>
									</table>
								</div>
							</div>
						) }

						{ activeTab === 'advanced' && (
							<div className="p-6 space-y-6">
								<div>
									<h2 className="text-xl font-semibold text-slate-800 m-0">
										{ __(
											'Advanced Configuration',
											'saasvibe'
										) }
									</h2>
									<p className="text-sm text-slate-500 mt-1">
										{ __(
											'Set up target development environment indicators and manage JSON exports.',
											'saasvibe'
										) }
									</p>
								</div>

								{ /* Environment indicator pill */ }
								<div className="border border-slate-200 rounded-xl p-6 bg-white space-y-4">
									<h3 className="text-sm font-semibold text-slate-800 m-0">
										{ __(
											'Environment Badge',
											'saasvibe'
										) }
									</h3>

									<div className="space-y-4">
										<div className="flex items-center gap-3">
											<input
												type="checkbox"
												id="env-badge-enabled"
												checked={
													settings.environmentBadge
														?.enabled
												}
												onChange={ ( e ) =>
													handleNestedChange(
														'environmentBadge',
														'enabled',
														e.target.checked
													)
												}
												className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
											/>
											<label
												htmlFor="env-badge-enabled"
												className="text-xs font-semibold text-slate-700"
											>
												{ __(
													'Show Environment Indicator Badge in Top Bar',
													'saasvibe'
												) }
											</label>
										</div>

										{ settings.environmentBadge
											?.enabled && (
											<div className="grid grid-cols-2 gap-4 pt-2">
												<div className="space-y-1">
													<label className="text-xs font-medium text-slate-500 block">
														{ __(
															'Badge Label',
															'saasvibe'
														) }
													</label>
													<input
														type="text"
														value={
															settings
																.environmentBadge
																.label
														}
														onChange={ ( e ) =>
															handleNestedChange(
																'environmentBadge',
																'label',
																e.target.value
															)
														}
														className="border border-slate-200 rounded px-3 py-1.5 text-xs w-full focus:outline-none focus:border-indigo-500"
													/>
												</div>
												<div className="space-y-1">
													<label className="text-xs font-medium text-slate-500 block">
														{ __(
															'Badge Color (HEX)',
															'saasvibe'
														) }
													</label>
													<div className="flex items-center gap-2">
														<input
															type="color"
															value={
																settings
																	.environmentBadge
																	.color
															}
															onChange={ ( e ) =>
																handleNestedChange(
																	'environmentBadge',
																	'color',
																	e.target
																		.value
																)
															}
															className="w-8 h-8 p-0 border-0 rounded cursor-pointer bg-transparent"
														/>
														<input
															type="text"
															value={
																settings
																	.environmentBadge
																	.color
															}
															onChange={ ( e ) =>
																handleNestedChange(
																	'environmentBadge',
																	'color',
																	e.target
																		.value
																)
															}
															className="border border-slate-200 rounded px-2 py-1 text-xs w-24 font-mono uppercase"
														/>
													</div>
												</div>
											</div>
										) }
									</div>
								</div>

								{ /* Config transfers */ }
								<div className="border border-slate-200 rounded-xl p-6 bg-white space-y-4">
									<h3 className="text-sm font-semibold text-slate-800 m-0">
										{ __(
											'Data Backup & Deployment',
											'saasvibe'
										) }
									</h3>
									<p className="text-xs text-slate-500 max-w-lg">
										{ __(
											'Deploy layouts seamlessly. Export configurations into a JSON file, or upload configuration packages on new WordPress instances.',
											'saasvibe'
										) }
									</p>
									<button
										type="button"
										onClick={ () =>
											setShowExportModal( true )
										}
										className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
									>
										<FileJson className="h-4 w-4" />
										{ __(
											'Import / Export Config Package',
											'saasvibe'
										) }
									</button>
								</div>
							</div>
						) }

						{ activeTab === 'license' && (
							<div className="p-6 space-y-6">
								<div>
									<h2 className="text-xl font-semibold text-slate-800 m-0">
										{ __(
											'Plugin License Manager',
											'saasvibe'
										) }
									</h2>
									<p className="text-sm text-slate-500 mt-1">
										{ __(
											'Register license keys to unlock advanced design templates and configuration transfer utilities.',
											'saasvibe'
										) }
									</p>
								</div>

								<div className="border border-slate-200 rounded-xl p-6 bg-white space-y-4 max-w-xl">
									<div className="flex items-center justify-between border-b border-slate-100 pb-4">
										<span className="text-xs text-slate-500 font-medium">
											{ __(
												'Current Tier:',
												'saasvibe'
											) }
										</span>
										<span
											className={ `text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
												isPro
													? 'bg-indigo-100 text-indigo-700'
													: 'bg-slate-100 text-slate-600'
											}` }
										>
											{ isPro
												? __(
														'Pro / Agency Active',
														'saasvibe'
												  )
												: __(
														'Free Tier',
														'saasvibe'
												  ) }
										</span>
									</div>

									<form
										onSubmit={ handleLicenseActivate }
										className="space-y-4"
									>
										<div className="space-y-1">
											<label className="text-xs font-medium text-slate-500 block">
												{ __(
													'License Activation Key',
													'saasvibe'
												) }
											</label>
											<div className="flex items-center gap-3">
												<input
													type="password"
													value={ licenseKey }
													placeholder="PRO-XXXX-XXXX"
													onChange={ ( e ) =>
														setLicenseKey(
															e.target.value
														)
													}
													className="border border-slate-200 rounded px-3 py-2 text-sm w-72 focus:outline-none focus:border-indigo-500"
												/>
												<button
													type="submit"
													disabled={
														isActivatingLicense ||
														! licenseKey
													}
													className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
												>
													{ isActivatingLicense ? (
														<Loader2 className="h-4 w-4 animate-spin" />
													) : null }
													{ __(
														'Activate',
														'saasvibe'
													) }
												</button>
											</div>
										</div>
									</form>

									{ ! isPro && (
										<div className="p-4 bg-slate-50 rounded-xl flex items-start gap-2.5 text-slate-600 text-xs mt-4">
											<FolderLock className="h-5 w-5 text-indigo-600 shrink-0" />
											<div>
												<span className="font-semibold text-slate-800 block mb-0.5">
													{ __(
														'Demo Key Notice',
														'saasvibe'
													) }
												</span>
												{ __(
													'Enter a demo license key starting with "PRO-" (e.g. PRO-DEMO) or "AGENCY-" (e.g. AGENCY-DEMO) to test the Pro templates and Agency migration tools.',
													'saasvibe'
												) }
											</div>
										</div>
									) }
								</div>
							</div>
						) }
					</div>
				</div>

				{ /* Visual Interface Previewer column */ }
				<div className="lg:w-[460px] xl:w-[500px] bg-slate-50 shrink-0">
					<MenuPreview
						settings={ settings }
						activeTemplate={ activeTemplate }
					/>
				</div>
			</div>

			{ /* Config transfers Modal */ }
			<ExportModal
				isOpen={ showExportModal }
				onClose={ () => setShowExportModal( false ) }
				onImportSuccess={ ( importedSettings ) => {
					setSettings( importedSettings );
					setShowExportModal( false );
					toast.success(
						__(
							'Import successfully written! Save to apply.',
							'saasvibe'
						)
					);
				} }
			/>
		</div>
	);
};

const rootEl = document.getElementById( 'saasvibe-app' );
if ( rootEl ) {
	createRoot( rootEl ).render( <App /> );
}
