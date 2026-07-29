import { useState, useEffect } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { RefreshCw, Upload, X } from 'lucide-react';

import {
	SAASVIBE_DEFAULT_BRAND,
	accessibleOn,
	bestContrastRatio,
	contrastRatio as ratioBetween,
	contrastTargetFor,
	idealTextColor,
	legibleFill,
} from '../utils/color';

export const ColorCustomizer = ( { settings, onChange, activeTemplate } ) => {
	const [ contrast, setContrast ] = useState( {
		fill: SAASVIBE_DEFAULT_BRAND,
		fillAdjusted: false,
		fillText: '#FFFFFF',
		fillRatio: '21.00',
		accent: SAASVIBE_DEFAULT_BRAND,
		accentRatio: '21.00',
		accentAdjusted: false,
		chromeBg: '#000000',
	} );

	useEffect( () => {
		const typed =
			settings.brandColor ||
			window.Saasvibe_Vars?.wp_brand_color ||
			SAASVIBE_DEFAULT_BRAND;

		// Mid-typing values like "#5E6" are not colors yet. Recomputing on them
		// would resolve through the default-brand fallback and flash a readout
		// for a color nobody picked, so hold the last complete value instead.
		if ( ! /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test( typed ) ) {
			return;
		}

		const brandColor = typed.startsWith( '#' ) ? typed : `#${ typed }`;

		// Two derivations cover every foreground the templates draw:
		//
		// 1. Surfaces that carry text are painted with the legible fill -- the
		//    pick itself, unless it lands in the mid-tone band around #767676
		//    where neither black nor white clears AA, in which case its lightness
		//    is nudged just clear of the band. Text on it is then black or white
		//    by relative luminance.
		// 2. The brand color used AS a label or icon sits on the template's own
		//    chrome, so it is lightened or darkened until it clears AA there --
		//    on the resting background and the hover fill alike. Classic Elevated
		//    paints its chrome with the brand color itself, so its brand-colored
		//    label sits on the contrast fill instead.
		const target = contrastTargetFor( settings.contrastLevel );
		const fill = legibleFill( brandColor, target );
		const fillText = idealTextColor( fill );
		const isClassic = activeTemplate?.id === 'classic-elevated';
		const chromeBg = isClassic
			? fillText
			: activeTemplate?.defaultColors?.background || '#000000';
		const chromeSurfaces = isClassic
			? [ chromeBg ]
			: [
					chromeBg,
					activeTemplate?.id === 'vercel-minimal'
						? '#F3F4F6'
						: '#1A1A1A',
			  ];
		const accent = accessibleOn( brandColor, chromeSurfaces, target );

		setContrast( {
			fill,
			fillAdjusted: fill.toUpperCase() !== brandColor.toUpperCase(),
			fillText,
			fillRatio: bestContrastRatio( fill ).toFixed( 2 ),
			accent,
			accentRatio: Math.min(
				...chromeSurfaces.map( ( bg ) => ratioBetween( accent, bg ) )
			).toFixed( 2 ),
			accentAdjusted: accent.toUpperCase() !== brandColor.toUpperCase(),
			chromeBg,
		} );
	}, [ settings.brandColor, settings.contrastLevel, activeTemplate ] );

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

					{ /* Contrast target */ }
					<div className="mt-4">
						<span className="block text-xs font-semibold text-slate-700">
							{ __( 'Contrast target', 'saasvibe' ) }
						</span>
						<div
							role="radiogroup"
							aria-label={ __( 'Contrast target', 'saasvibe' ) }
							className="mt-1.5 inline-flex rounded-lg border border-slate-200 p-0.5"
						>
							{ [
								{
									value: 'aa',
									label: __( 'AA — 4.5:1', 'saasvibe' ),
								},
								{
									value: 'aaa',
									label: __( 'AAA — 7:1', 'saasvibe' ),
								},
							].map( ( option ) => {
								const isActive =
									( settings.contrastLevel || 'aa' ) ===
									option.value;

								return (
									<button
										key={ option.value }
										type="button"
										role="radio"
										aria-checked={ isActive }
										onClick={ () =>
											onChange(
												'contrastLevel',
												option.value
											)
										}
										className={ `rounded-md px-3 py-1 text-xs font-medium transition-colors ${
											isActive
												? 'bg-indigo-600 text-white'
												: 'text-slate-600 hover:bg-slate-100'
										}` }
									>
										{ option.label }
									</button>
								);
							} ) }
						</div>
						<p className="mt-1.5 text-xs text-slate-500">
							{ __(
								'AAA holds every derived color to 7:1. It is stricter than AA and moves brand-derived colors further from the color you picked.',
								'saasvibe'
							) }
						</p>
					</div>

					{ /* WCAG Contrast Verification */ }
					<div className="mt-3 space-y-1.5 text-xs text-slate-500">
						<p className="flex items-center gap-2">
							<span
								style={ {
									backgroundColor: contrast.fill,
									color: contrast.fillText,
								} }
								className="inline-flex items-center rounded px-2 py-0.5 font-semibold"
							>
								{ __( 'Aa', 'saasvibe' ) }
							</span>
							{ contrast.fillAdjusted
								? sprintf(
										/* translators: 1: text color (dark or light), 2: adjusted hex color, 3: contrast ratio. */
										__(
											'On brand fills: %1$s text — fill nudged to %2$s to clear the target, %3$s:1.',
											'saasvibe'
										),
										contrast.fillText === '#000000'
											? __( 'dark', 'saasvibe' )
											: __( 'light', 'saasvibe' ),
										contrast.fill,
										contrast.fillRatio
								  )
								: sprintf(
										/* translators: 1: text color (dark or light), 2: contrast ratio. */
										__(
											'On brand fills: %1$s text, %2$s:1.',
											'saasvibe'
										),
										contrast.fillText === '#000000'
											? __( 'dark', 'saasvibe' )
											: __( 'light', 'saasvibe' ),
										contrast.fillRatio
								  ) }
						</p>
						<p className="flex items-center gap-2">
							<span
								style={ {
									backgroundColor: contrast.chromeBg,
									color: contrast.accent,
								} }
								className="inline-flex items-center rounded px-2 py-0.5 font-semibold border border-slate-200"
							>
								{ __( 'Aa', 'saasvibe' ) }
							</span>
							{ contrast.accentAdjusted
								? sprintf(
										/* translators: 1: adjusted hex color, 2: contrast ratio. */
										__(
											'As a label on this template\'s chrome: adjusted to %1$s, %2$s:1.',
											'saasvibe'
										),
										contrast.accent,
										contrast.accentRatio
								  )
								: sprintf(
										/* translators: %s: contrast ratio. */
										__(
											'As a label on this template\'s chrome: used as picked, %s:1.',
											'saasvibe'
										),
										contrast.accentRatio
								  ) }
						</p>
					</div>

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
							min="160"
							max="280"
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
							'Contrast is handled for you in every template. Text on a brand fill takes black or white by WCAG relative luminance, and the brand color used as a label or icon is lightened or darkened only as far as it must be to clear WCAG 2.1 AA (4.5:1) against the chrome behind it — so any brand color stays readable.',
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
							'Set sidebar widths between 160px (the WordPress default) and 280px depending on the depth of your site menu titles to avoid truncation.',
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
