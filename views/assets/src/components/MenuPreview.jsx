import { __ } from '@wordpress/i18n';
import { Home, FileText, Settings, Users, Layers, ExternalLink } from 'lucide-react';

export const MenuPreview = ( { settings, activeTemplate } ) => {
    if ( ! activeTemplate ) {
        return null;
    }

    const brandColor = settings.brandColor || '#5E6AD2';
    const sidebarWidth = settings.sidebarWidth || 240;
    const topBarHeight = settings.topBarHeight || 46;
    const customLogo = settings.customLogo || '';
    const density = settings.density || 'normal';

    // CSS RGB parser for brand opacity
    const getRgbFromHex = ( hex ) => {
        const cleanHex = hex.replace( '#', '' );
        if ( cleanHex.length === 3 ) {
            return {
                r: parseInt( cleanHex[ 0 ] + cleanHex[ 0 ], 16 ),
                g: parseInt( cleanHex[ 1 ] + cleanHex[ 1 ], 16 ),
                b: parseInt( cleanHex[ 2 ] + cleanHex[ 2 ], 16 ),
            };
        }
        return {
            r: parseInt( cleanHex.substring( 0, 2 ), 16 ),
            g: parseInt( cleanHex.substring( 2, 4 ), 16 ),
            b: parseInt( cleanHex.substring( 4, 6 ), 16 ),
        };
    };

    const rgb = getRgbFromHex( brandColor );
    const brandHover = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.10)`;

    // Calculate spacing based on density
    let itemPadding = 'py-2 px-3.5';
    if ( density === 'compact' ) {
        itemPadding = 'py-1 px-3';
    } else if ( density === 'relaxed' ) {
        itemPadding = 'py-3.5 px-4';
    }

    // Determine default mockup color values based on selected template
    const previewStyles = {
        sidebarBg: activeTemplate.id === 'classic-elevated' ? brandColor : activeTemplate.defaultColors.background,
        sidebarText: activeTemplate.defaultColors.text,
        topBarBg: activeTemplate.id === 'classic-elevated' ? brandColor : ( activeTemplate.style === 'both' ? activeTemplate.defaultColors.background : '#FFFFFF' ),
        topBarBorder: activeTemplate.id === 'vercel-minimal' ? '1px solid #E5E7EB' : ( activeTemplate.id === 'linear-dark' ? '1px solid rgba(255,255,255,0.08)' : 'none' ),
    };

    // Calculate contrast text color for brand color
    const getIdealTextColor = ( r, g, b ) => {
        const luminance = ( 0.2126 * r + 0.7152 * g + 0.0722 * b ) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    };
    const brandTextColor = getIdealTextColor( rgb.r, rgb.g, rgb.b );

    const mockMenuItems = [
        { icon: <Home className="h-4 w-4 shrink-0" />, label: __( 'Dashboard', 'saasmenu' ), active: true },
        { icon: <FileText className="h-4 w-4 shrink-0" />, label: __( 'Posts & Pages', 'saasmenu' ) },
        { icon: <Layers className="h-4 w-4 shrink-0" />, label: __( 'Appearance', 'saasmenu' ) },
        { icon: <Users className="h-4 w-4 shrink-0" />, label: __( 'Users & Profiles', 'saasmenu' ) },
        { icon: <Settings className="h-4 w-4 shrink-0" />, label: __( 'Settings', 'saasmenu' ) },
    ];

    return (
        <div className="saasmenu-menu-preview p-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold text-slate-800 m-0">
                    { __( 'Live Interface Preview', 'saasmenu' ) }
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    { __( 'Visual simulation of how the WordPress backend navigation layout will render.', 'saasmenu' ) }
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
                                borderBottom: activeTemplate.id === 'vercel-minimal' ? '1px solid #E5E7EB' : '1px solid rgba(255, 255, 255, 0.08)',
                            } }
                            className="flex items-center justify-center p-3 select-none"
                        >
                            { customLogo ? (
                                <img
                                    src={ customLogo }
                                    alt="Mock logo"
                                    className="max-h-6 max-w-full object-contain"
                                />
                            ) : (
                                <span className="text-xs font-bold truncate opacity-80 uppercase tracking-wider">
                                    { __( 'WordPress Title', 'saasmenu' ) }
                                </span>
                            ) }
                        </div>

                        { /* Mock Menu Items */ }
                        <div className="flex-1 py-4 space-y-1 select-none overflow-y-auto">
                            { mockMenuItems.map( ( item, i ) => {
                                const isSelected = item.active;

                                return (
                                    <div
                                        key={ i }
                                        style={ {
                                            backgroundColor: isSelected ? brandHover : 'transparent',
                                            color: isSelected ? ( activeTemplate.id === 'vercel-minimal' ? '#000000' : '#FFFFFF' ) : previewStyles.sidebarText,
                                            borderLeft: isSelected ? `3px solid ${ brandColor }` : '3px solid transparent',
                                        } }
                                        className={ `flex items-center gap-2.5 text-xs font-medium cursor-pointer transition-all ${ itemPadding } ${
                                            isSelected ? '' : 'opacity-70 hover:opacity-100 hover:bg-slate-200/20'
                                        }` }
                                    >
                                        <span style={ { color: isSelected ? brandColor : 'inherit' } }>
                                            { item.icon }
                                        </span>
                                        <span className="truncate">{ item.label }</span>
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
                                borderBottom: previewStyles.topBarBorder,
                            } }
                            className="flex items-center justify-between px-4 select-none shrink-0"
                        >
                            { /* Left Node */ }
                            <div className="flex items-center gap-3">
                                { ! settings.hideTopBarItems?.siteName && (
                                    <span className="text-xs font-medium truncate opacity-70">
                                        { __( 'Visit Site', 'saasmenu' ) }
                                    </span>
                                ) }
                                { settings.environmentBadge?.enabled && (
                                    <span
                                        style={ {
                                            backgroundColor: settings.environmentBadge.color || brandColor,
                                            color: '#ffffff',
                                        } }
                                        className="text-[9px] font-semibold px-2 py-0.5 rounded-full block tracking-wide truncate"
                                    >
                                        { settings.environmentBadge.label || __( 'DEV', 'saasmenu' ) }
                                    </span>
                                ) }
                            </div>

                            { /* Right Node - User profile card mock */ }
                            <div className="flex items-center gap-2 text-xs">
                                <span className="opacity-70 truncate hidden md:inline">
                                    { __( 'Howdy, Admin', 'saasmenu' ) }
                                </span>
                                <div
                                    style={ { backgroundColor: brandColor, color: brandTextColor } }
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
                                    <div className="h-6 w-1/3 bg-indigo-100 rounded"></div>
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
                        alert( __( 'Changes will apply to the live admin dashboard when you click "Save Settings" below.', 'saasmenu' ) );
                    } }
                >
                    { __( 'Simulated View. Click "Save Settings" to apply changes.', 'saasmenu' ) }
                    <ExternalLink className="h-3 w-3" />
                </a>
            </div>
        </div>
    );
};

export default MenuPreview;
