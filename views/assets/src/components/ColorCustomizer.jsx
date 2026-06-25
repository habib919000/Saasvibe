import { useState, useEffect } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { ShieldAlert, RefreshCw, Upload, X } from 'lucide-react';

export const ColorCustomizer = ( { settings, onChange, activeTemplate } ) => {
	const [ contrastRatio, setContrastRatio ] = useState( 1 );
	const [ contrastPass, setContrastPass ] = useState( true );

	// WCAG Contrast Math
	const getLuminance = ( hex ) => {
		const cleanHex = hex.replace( '#', '' );
		let rgb = [];
		if ( cleanHex.length === 3 ) {
			rgb = [
				parseInt( cleanHex[ 0 ] + cleanHex[ 0 ], 16 ) / 255,
				parseInt( cleanHex[ 1 ] + cleanHex[ 1 ], 16 ) / 255,
				parseInt( cleanHex[ 2 ] + cleanHex[ 2 ], 16 ) / 255,
			];
		} else if ( cleanHex.length === 6 ) {
			rgb = [
				parseInt( cleanHex.substring( 0, 2 ), 16 ) / 255,
				parseInt( cleanHex.substring( 2, 4 ), 16 ) / 255,
				parseInt( cleanHex.substring( 4, 6 ), 16 ) / 255,
			];
		} else {
			return 0; // fallback
		}

		const sRGB = rgb.map( ( c ) => {
			return c <= 0.03928
				? c / 12.92
				: Math.pow( ( c + 0.055 ) / 1.055, 2.4 );
		} );

		return 0.2126 * sRGB[ 0 ] + 0.7152 * sRGB[ 1 ] + 0.0722 * sRGB[ 2 ];
	};

	const calculateContrast = ( c1, c2 ) => {
		const l1 = getLuminance( c1 );
		const l2 = getLuminance( c2 );
		return l1 > l2
			? ( l1 + 0.05 ) / ( l2 + 0.05 )
			: ( l2 + 0.05 ) / ( l1 + 0.05 );
	};

	useEffect( () => {
		if ( ! activeTemplate ) {
			return;
		}

		const brandColor = settings.brandColor || window.Saasvibe_Vars?.wp_brand_color || '#5E6AD2';
		const textColor = activeTemplate.defaultColors.text || '#FFFFFF';
		const ratio = calculateContrast( brandColor, textColor );
		setContrastRatio( ratio.toFixed( 2 ) );
		setContrastPass( ratio >= 4.5 );
	}, [ settings.brandColor, activeTemplate ] );

	const handleResetColors = () => {
		onChange( 'brandColor', '' );
	};

	const handleUploadLogo = ( e ) => {
		e.preventDefault();
		if ( typeof wp !== 'undefined' && wp.media ) {
			const mediaFrame = wp.media( {
				title: __( 'Select Custom Logo', 'saasvibe' ),
				button: {
					text: __( 'Use Logo', 'saasvibe' ),
				},
				multiple: false,
				library: { type: 'image' },
			} );

			mediaFrame.on( 'select', () => {
				const attachment = mediaFrame
					.state()
					.get( 'selection' )
					.first()
					.toJSON();
				onChange( 'customLogo', attachment.url );
			} );

			mediaFrame.open();
		} else {
			const url = prompt( __( 'Enter Logo Image URL:', 'saasvibe' ) );
			if ( url !== null ) {
				onChange( 'customLogo', url );
			}
		}
	};

	return (
		<div className="saasvibe-color-customizer p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white">
			{ /* Left Panel - Form Controls */ }
			<div className="space-y-6">
				<div>
					<h2 className="text-xl font-semibold text-slate-800 m-0">
						{ __( 'Branding & Sizing', 'saasvibe' ) }
					</h2>
					<p className="text-sm text-slate-500 mt-1">
						{ __(
							'Configure brand identity colors, sizing parameters, and logo settings.',
							'saasvibe'
						) }
					</p>
				</div>

				{ /* Brand Color Picker & Preset */ }
				<div className="space-y-2 border-b border-slate-100 pb-5">
					<label className="block text-sm font-semibold text-slate-700">
						{ __( 'Primary Brand Color', 'saasvibe' ) }
					</label>
					<div className="flex items-center gap-3">
						<div className="relative w-12 h-10 rounded border border-slate-200 overflow-hidden cursor-pointer">
							<input
								type="color"
								value={ settings.brandColor || window.Saasvibe_Vars?.wp_brand_color || '#5E6AD2' }
								onChange={ ( e ) =>
									onChange( 'brandColor', e.target.value )
								}
								className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0"
							/>
							<div
								style={ {
									backgroundColor: settings.brandColor || window.Saasvibe_Vars?.wp_brand_color || '#5E6AD2',
								} }
								className="w-full h-full"
							/>
						</div>
						<input
							type="text"
							value={ settings.brandColor }
							placeholder={ window.Saasvibe_Vars?.wp_brand_color || '#5E6AD2' }
							onChange={ ( e ) =>
								onChange( 'brandColor', e.target.value )
							}
							className="border border-slate-200 rounded px-3 py-1.5 text-sm w-32 font-mono uppercase"
						/>
						<button
							type="button"
							onClick={ handleResetColors }
							className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 transition-colors"
						>
							<RefreshCw className="h-3.5 w-3.5" />
							{ __( 'Reset to Default', 'saasvibe' ) }
						</button>
					</div>

					{ /* WCAG Contrast Verification Alerts */ }
					{ ! contrastPass && (
						<div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-800 text-xs">
							<ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
							<div>
								<span className="font-semibold">
									{ __(
										'WCAG Contrast Warning: ',
										'saasvibe'
									) }
								</span>
								{ sprintf(
									__(
										'Selected brand color contrast ratio is %s:1 against default template text, which fails WCAG 2.1 AA requirements (4.5:1). Text visibility may be limited.',
										'saasvibe'
									),
									contrastRatio
								) }
							</div>
						</div>
					) }
				</div>

				{ /* Custom Logo Upload */ }
				<div className="space-y-2 border-b border-slate-100 pb-5">
					<label className="block text-sm font-semibold text-slate-700">
						{ __( 'Custom Site Logo', 'saasvibe' ) }
					</label>
					<div className="space-y-3">
						{ settings.customLogo ? (
							<div className="relative border border-slate-200 rounded-lg p-3 w-64 bg-slate-50 flex items-center justify-between">
								<img
									src={ settings.customLogo }
									alt="Logo preview"
									className="max-h-12 max-w-[180px] object-contain"
								/>
								<button
									type="button"
									onClick={ () =>
										onChange( 'customLogo', '' )
									}
									className="p-1 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={ handleUploadLogo }
								className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 border-dashed rounded-lg p-5 w-64 justify-center transition-colors group"
							>
								<Upload className="h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
								{ __( 'Upload Logo (PNG/SVG)', 'saasvibe' ) }
							</button>
						) }
						<p className="text-[11px] text-slate-400">
							{ __(
								'Max recommended size: 200px wide by 60px high. SVG or transparent PNG preferred.',
								'saasvibe'
							) }
						</p>
					</div>
				</div>

				{ /* Sidebar Layout Options */ }
				<div className="space-y-4 border-b border-slate-100 pb-5">
					<h3 className="text-sm font-semibold text-slate-700 m-0">
						{ __( 'Sidebar Settings', 'saasvibe' ) }
					</h3>

					{ /* Sidebar Width slider */ }
					<div className="space-y-1">
						<div className="flex justify-between text-xs font-medium text-slate-500">
							<span>
								{ __( 'Expanded Sidebar Width', 'saasvibe' ) }
							</span>
							<span className="font-mono text-slate-700">
								{ settings.sidebarWidth }px
							</span>
						</div>
						<input
							type="range"
							min="200"
							max="320"
							step="5"
							value={ settings.sidebarWidth }
							onChange={ ( e ) =>
								onChange(
									'sidebarWidth',
									parseInt( e.target.value )
								)
							}
							className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
						/>
					</div>

					{ /* Sidebar Density Preset */ }
					<div className="space-y-1">
						<span className="text-xs font-medium text-slate-500">
							{ __( 'Menu Spacing Density', 'saasvibe' ) }
						</span>
						<div className="grid grid-cols-3 gap-2 mt-1.5">
							{ [
								{
									value: 'compact',
									label: __( 'Compact', 'saasvibe' ),
								},
								{
									value: 'normal',
									label: __( 'Normal', 'saasvibe' ),
								},
								{
									value: 'relaxed',
									label: __( 'Relaxed', 'saasvibe' ),
								},
							].map( ( d ) => (
								<button
									key={ d.value }
									type="button"
									onClick={ () =>
										onChange( 'density', d.value )
									}
									className={ `text-xs py-2 border rounded-lg transition-all ${
										settings.density === d.value
											? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
											: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
									}` }
								>
									{ d.label }
								</button>
							) ) }
						</div>
					</div>
				</div>

				{ /* Top Bar Layout Options */ }
				<div className="space-y-4">
					<h3 className="text-sm font-semibold text-slate-700 m-0">
						{ __( 'Top Bar Settings', 'saasvibe' ) }
					</h3>

					{ /* Top Bar Height slider */ }
					<div className="space-y-1">
						<div className="flex justify-between text-xs font-medium text-slate-500">
							<span>{ __( 'Top Bar Height', 'saasvibe' ) }</span>
							<span className="font-mono text-slate-700">
								{ settings.topBarHeight }px
							</span>
						</div>
						<input
							type="range"
							min="32"
							max="52"
							step="1"
							value={ settings.topBarHeight }
							onChange={ ( e ) =>
								onChange(
									'topBarHeight',
									parseInt( e.target.value )
								)
							}
							className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
						/>
					</div>
				</div>

				{ /* Modern Icons Options */ }
				<div className="space-y-4">
					<h3 className="text-sm font-semibold text-slate-700 m-0">
						{ __( 'Modern Icons', 'saasvibe' ) }
					</h3>

					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								id="modern-icons-enabled"
								checked={ settings.modernIcons?.enabled || false }
								onChange={ ( e ) =>
									onChange( 'modernIcons', {
										...settings.modernIcons,
										enabled: e.target.checked,
									} )
								}
								className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label
								htmlFor="modern-icons-enabled"
								className="text-xs font-semibold text-slate-700"
							>
								{ __( 'Enable Modern Icons (Lucide)', 'saasvibe' ) }
							</label>
						</div>

						{ settings.modernIcons?.enabled && (
							<div className="space-y-1">
								<span className="text-xs font-medium text-slate-500 block">
									{ __( 'Icon Style', 'saasvibe' ) }
								</span>
								<div className="grid grid-cols-2 gap-2 mt-1.5">
									{ [
										{ value: 'line', label: __( 'Line', 'saasvibe' ) },
										{ value: 'flat', label: __( 'Flat (Solid)', 'saasvibe' ) },
									].map( ( style ) => (
										<button
											key={ style.value }
											type="button"
											onClick={ () =>
												onChange( 'modernIcons', {
													...settings.modernIcons,
													style: style.value,
												} )
											}
											className={ `text-xs py-2 border rounded-lg transition-all ${
												( settings.modernIcons?.style || 'line' ) === style.value
													? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
													: 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
											}` }
										>
											{ style.label }
										</button>
									) ) }
								</div>
							</div>
						) }
					</div>
				</div>
			</div>

			{ /* Right Panel - Documentation and quick tips */ }
			<div className="border border-slate-100 bg-slate-50/50 p-6 rounded-xl space-y-4">
				<h3 className="text-sm font-semibold text-slate-800 m-0">
					{ __( 'Design Guidelines & Tips', 'saasvibe' ) }
				</h3>
				<ul className="text-xs text-slate-600 space-y-3 pl-4 list-disc leading-relaxed">
					<li>
						<strong className="text-slate-700">
							{ __( 'Contrast Compliance: ', 'saasvibe' ) }
						</strong>
						{ __(
							'Ensure your brand color passes contrast compliance with the text color of your active design template. This secures compliance under WCAG 2.1 AA requirements, preventing readability barriers.',
							'saasvibe'
						) }
					</li>
					<li>
						<strong className="text-slate-700">
							{ __( 'Dynamic Custom Properties: ', 'saasvibe' ) }
						</strong>
						{ __(
							'Once saved, your color specifications generate root CSS custom properties in the WordPress header. Changing templates retains color specifications.',
							'saasvibe'
						) }
					</li>
					<li>
						<strong className="text-slate-700">
							{ __( 'Width Adjustment: ', 'saasvibe' ) }
						</strong>
						{ __(
							'Set sidebar widths between 200px and 320px depending on the depth of your site menu titles to avoid truncation.',
							'saasvibe'
						) }
					</li>
					<li>
						<strong className="text-slate-700">
							{ __( 'Collapsing state: ', 'saasvibe' ) }
						</strong>
						{ __(
							'Folding the sidebar reduces layout spacing into a clean, icon-only 60px panel automatically.',
							'saasvibe'
						) }
					</li>
				</ul>
			</div>
		</div>
	);
};

export default ColorCustomizer;
