import { __ } from '@wordpress/i18n';
import {
	Home,
	FileText,
	Settings,
	Users,
	Layers,
	ExternalLink,
} from 'lucide-react';

import {
	accessibleOn,
	brandHoverTint,
	contrastTargetFor,
	contrastTint,
	idealTextColor,
	legibleFill,
	safeHex,
} from '../utils/color';

export const MenuPreview = ( { settings, activeTemplate } ) => {
	if ( ! activeTemplate ) {
		return null;
	}

	const brandColor = safeHex(
		settings.brandColor || window.Saasvibe_Vars?.wp_brand_color
	);
	const sidebarWidth = settings.sidebarWidth || 200;
	const topBarHeight = settings.topBarHeight || 46;
	const customLogo = settings.customLogo || '';
	const logoType = settings.logoType || 'icon';
	const density = settings.density || 'normal';

	const brandHover = brandHoverTint( brandColor );

	// Calculate spacing based on density
	let itemPadding = 'py-2 px-3.5';
	if ( density === 'compact' ) {
		itemPadding = 'py-1 px-3';
	} else if ( density === 'relaxed' ) {
		itemPadding = 'py-3.5 px-4';
	}

	// Surfaces that carry text are painted with the legible fill: a mid-tone
	// around #767676 reaches only ~4.48:1 against both black and white, so the
	// fill is nudged clear of that band. Everything else passes through as picked.
	const target = contrastTargetFor( settings.contrastLevel );
	const brandFill = legibleFill( brandColor, target );

	// Automatic font contrast: black on light brand colors, white on dark ones,
	// decided by WCAG relative luminance (see utils/color.js).
	const brandTextColor = idealTextColor( brandFill );

	// Classic Elevated paints the whole chrome -- sidebar and top bar -- with the
	// brand color, so its idle labels ride on the brand color too and have to use
	// the derived contrast color rather than the template's static text color.
	const brandPaintsChrome = activeTemplate.id === 'classic-elevated';

	// Determine default mockup color values based on selected template
	const previewStyles = {
		sidebarBg: brandPaintsChrome
			? brandFill
			: activeTemplate.defaultColors.background,
		// Idle labels on brand-painted chrome take a verified tint rather than a
		// blanket opacity, which could dip under AA on a mid-tone brand color.
		sidebarText: brandPaintsChrome
			? contrastTint( brandFill, 0.85, target )
			: activeTemplate.defaultColors.text,
		topBarBg: brandPaintsChrome
			? brandFill
			: activeTemplate.style === 'both'
			? activeTemplate.defaultColors.background
			: '#FFFFFF',
		topBarText: brandPaintsChrome
			? contrastTint( brandFill, 0.85, target )
			: 'inherit',
		topBarBorder:
			activeTemplate.id === 'vercel-minimal'
				? '1px solid #E5E7EB'
				: activeTemplate.id === 'linear-dark'
				? '1px solid rgba(255,255,255,0.08)'
				: 'none',
	};

	// Every template marks the active row with a solid fill. Classic Elevated
	// inverts it -- its sidebar is already painted with the brand color, so the
	// fill has to be the contrast color with a brand-colored label, lightened or
	// darkened as needed to stay above AA on that fill.
	const invertsActiveFill = brandPaintsChrome;
	const activeFillBg = invertsActiveFill ? brandTextColor : brandFill;
	const activeFillText = invertsActiveFill
		? accessibleOn( brandColor, brandTextColor, target )
		: brandTextColor;

	// Signature corner radius per template.
	const activeFillRadius =
		activeTemplate.id === 'dev-dark'
			? '9999px'
			: activeTemplate.id === 'vercel-minimal'
			? '4px'
			: activeTemplate.id === 'classic-elevated'
			? '6px'
			: '8px';

	const mockMenuItems = [
		{
			icon: <Home className="h-4 w-4 shrink-0" />,
			label: __( 'Dashboard', 'saasvibe' ),
			active: true,
		},
		{
			icon: <FileText className="h-4 w-4 shrink-0" />,
			label: __( 'Posts & Pages', 'saasvibe' ),
		},
		{
			icon: <Layers className="h-4 w-4 shrink-0" />,
			label: __( 'Appearance', 'saasvibe' ),
		},
		{
			icon: <Users className="h-4 w-4 shrink-0" />,
			label: __( 'Users & Profiles', 'saasvibe' ),
		},
		{
			icon: <Settings className="h-4 w-4 shrink-0" />,
			label: __( 'Settings', 'saasvibe' ),
		},
	];

	return (
		<div className="saasvibe-menu-preview p-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between">
			<div>
				<h2 className="text-xl font-semibold text-slate-800 m-0">
					{ __( 'Live Interface Preview', 'saasvibe' ) }
				</h2>
				<p className="text-sm text-slate-500 mt-1">
					{ __(
						'Visual simulation of how the WordPress backend navigation layout will render.',
						'saasvibe'
					) }
				</p>
			</div>

			{ /* Device / Window Container Mockup */ }
			<div className="my-8 border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-white flex flex-col h-[400px]">
				{ /* Browser Topbar Mockup */ }
				<div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 select-none shrink-0">
					<span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
					<span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block" />
					<span className="w-2.5 h-2.5 rounded-full bg-green-400 block" />
					<div className="bg-white px-3 py-0.5 rounded border border-slate-200 text-[10px] text-slate-400 w-1/3 text-center mx-auto truncate">
						wp-admin/index.php
					</div>
				</div>

				<div className="flex-1 flex overflow-hidden">
					{ /* Mock Sidebar */ }
					<div
						style={ {
							backgroundColor: previewStyles.sidebarBg,
							color: previewStyles.sidebarText,
							width: `${ sidebarWidth * 0.75 }px`, // Scale width slightly to fit preview viewport
							transition: 'all 200ms ease-in-out',
						} }
						className="h-full border-r border-slate-200 flex flex-col shrink-0 overflow-hidden"
					>
						{ /* Sidebar Header Logo Mockup */ }
						<div
							style={ {
								height: `${ topBarHeight }px`,
								borderBottom:
									activeTemplate.id === 'vercel-minimal'
										? '1px solid #E5E7EB'
										: '1px solid rgba(255, 255, 255, 0.08)',
							} }
							className="flex items-center justify-center p-3 select-none"
						>
							<span className="text-xs font-bold truncate opacity-80 uppercase tracking-wider">
								{ __( 'WordPress Title', 'saasvibe' ) }
							</span>
						</div>

						{ /* Mock Menu Items */ }
						<div className="flex-1 py-4 space-y-1 select-none overflow-y-auto">
							{ mockMenuItems.map( ( item, i ) => {
								const isSelected = item.active;

								return (
									<div
										key={ i }
										style={ {
											backgroundColor: isSelected
												? activeFillBg
												: 'transparent',
											color: isSelected
												? activeFillText
												: previewStyles.sidebarText,
											borderRadius: activeFillRadius,
											margin: '0 8px',
										} }
										className={ `flex items-center gap-2.5 text-xs font-medium cursor-pointer transition-all ${ itemPadding } ${
											isSelected || brandPaintsChrome
												? ''
												: 'opacity-70 hover:opacity-100 hover:bg-slate-200/20'
										}` }
									>
										<span
											style={ {
												color: isSelected
													? activeFillText
													: 'inherit',
											} }
										>
											{ item.icon }
										</span>
										<span className="truncate">
											{ item.label }
										</span>
									</div>
								);
							} ) }
						</div>
					</div>

					{ /* Mock Content Area */ }
					<div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
						{ /* Mock Top Bar */ }
						<div
							style={ {
								height: `${ topBarHeight }px`,
								backgroundColor: previewStyles.topBarBg,
								color: previewStyles.topBarText,
								borderBottom: previewStyles.topBarBorder,
							} }
							className="flex items-center justify-between px-4 select-none shrink-0"
						>
							{ /* Left Node */ }
							<div className="flex items-center gap-3">
								{ ! settings.hideTopBarItems?.siteName && (
									<span className="flex items-center gap-2 min-w-0">
										{ /* Mirrors the toolbar: the icon shape
										     sits beside the site name, the full
										     logo replaces it. */ }
										{ customLogo && (
											<img
												src={ customLogo }
												alt="Mock logo"
												style={ {
													maxHeight: `${
														logoType === 'full'
															? Math.min(
																	40,
																	Math.max(
																		18,
																		topBarHeight -
																			12
																	)
															  )
															: Math.min(
																	28,
																	Math.max(
																		16,
																		topBarHeight -
																			14
																	)
															  )
													}px`,
													maxWidth:
														logoType === 'full'
															? '120px'
															: '32px',
												} }
												className="object-contain shrink-0"
											/>
										) }
										{ ( ! customLogo ||
											logoType === 'icon' ) && (
											<span className="text-xs font-medium truncate opacity-70">
												{ __(
													'Visit Site',
													'saasvibe'
												) }
											</span>
										) }
									</span>
								) }
								{ settings.environmentBadge?.enabled && (
									<span
										style={ {
											backgroundColor: legibleFill(
												settings.environmentBadge
													.color || brandColor,
												target
											),
											color: idealTextColor(
												legibleFill(
													settings.environmentBadge
														.color || brandColor,
													target
												)
											),
										} }
										className="text-[9px] font-semibold px-2 py-0.5 rounded-full block tracking-wide truncate"
									>
										{ settings.environmentBadge.label ||
											__( 'DEV', 'saasvibe' ) }
									</span>
								) }
							</div>

							{ /* Right Node - User profile card mock */ }
							<div className="flex items-center gap-2 text-xs">
								<span className="opacity-70 truncate hidden md:inline">
									{ __( 'Howdy, Admin', 'saasvibe' ) }
								</span>
								<div
									style={ {
										backgroundColor: brandColor,
										color: brandTextColor,
									} }
									className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px]"
								>
									AD
								</div>
							</div>
						</div>

						{ /* Mock Body Canvas */ }
						<div className="flex-1 p-6 space-y-4 overflow-y-auto">
							<div className="h-6 w-1/3 bg-slate-200 rounded"></div>
							<div className="grid grid-cols-3 gap-4">
								<div className="h-24 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
									<div className="h-3 w-1/2 bg-slate-200 rounded"></div>
									<div style={ { backgroundColor: brandHover } } className="h-6 w-1/3 rounded"></div>
								</div>
								<div className="h-24 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
									<div className="h-3 w-1/2 bg-slate-200 rounded"></div>
									<div className="h-6 w-1/3 bg-slate-200 rounded"></div>
								</div>
								<div className="h-24 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
									<div className="h-3 w-1/2 bg-slate-200 rounded"></div>
									<div className="h-6 w-1/3 bg-slate-200 rounded"></div>
								</div>
							</div>
							<div className="h-32 bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-2">
								<div className="h-3.5 w-1/4 bg-slate-200 rounded"></div>
								<div className="h-2.5 w-full bg-slate-100 rounded"></div>
								<div className="h-2.5 w-full bg-slate-100 rounded"></div>
								<div className="h-2.5 w-3/4 bg-slate-100 rounded"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="text-center">
				<a
					href={ window.location.pathname }
					className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium select-none"
					onClick={ ( e ) => {
						e.preventDefault();
						alert(
							__(
								'Changes will apply to the live admin dashboard when you click "Save Settings" below.',
								'saasvibe'
							)
						);
					} }
				>
					{ __(
						'Simulated View. Click "Save Settings" to apply changes.',
						'saasvibe'
					) }
					<ExternalLink className="h-3 w-3" />
				</a>
			</div>
		</div>
	);
};

export default MenuPreview;
