/**
 * Brand color math shared by the settings app, the live preview, and the WCAG
 * contrast warning. PHP mirrors these functions in bootstrap/loaders.php
 * (saasvibe_relative_luminance / saasvibe_contrast_color) so the real admin
 * chrome resolves the same text color the preview shows.
 */

export const SAASVIBE_DEFAULT_BRAND = '#5E6AD2';

/**
 * Convert a #hex color (3 or 6 digit) to an { r, g, b } map of 0-255 channels.
 * Invalid input falls back to the default brand color so callers never have to
 * guard against NaN channels leaking into a CSS value.
 *
 * @param {string} hex Hex color, with or without the leading '#'.
 * @return {{r: number, g: number, b: number}} Channel map.
 */
export const hexToRgb = ( hex ) => {
	let clean = String( hex || '' ).replace( '#', '' );

	if ( clean.length === 3 ) {
		clean = clean[ 0 ] + clean[ 0 ] + clean[ 1 ] + clean[ 1 ] + clean[ 2 ] + clean[ 2 ];
	}

	if ( ! /^[0-9A-Fa-f]{6}$/.test( clean ) ) {
		clean = SAASVIBE_DEFAULT_BRAND.replace( '#', '' );
	}

	const num = parseInt( clean, 16 );

	return {
		r: ( num >> 16 ) & 255,
		g: ( num >> 8 ) & 255,
		b: num & 255,
	};
};

/**
 * Normalize a user-typed color, falling back while it is still incomplete.
 *
 * The hex field updates on every keystroke, so it passes through states like
 * "#5E6" that are not colors yet. hexToRgb() would silently resolve those to
 * the default brand color and flash derived values for a color nobody picked.
 *
 * @param {string} value    Raw field value.
 * @param {string} fallback Color to use until the value is complete.
 * @return {string} A usable #hex color.
 */
export const safeHex = ( value, fallback = SAASVIBE_DEFAULT_BRAND ) => {
	const raw = String( value || '' ).trim();

	if ( ! /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test( raw ) ) {
		return fallback;
	}

	return raw.startsWith( '#' ) ? raw : `#${ raw }`;
};

/**
 * WCAG 2.1 relative luminance (0 = black, 1 = white).
 *
 * Each channel is linearized out of sRGB's gamma curve before being weighted --
 * a plain (0.2126r + 0.7152g + 0.0722b) / 255 average skips that step and
 * overstates the brightness of mid and dark colors, which is what made
 * saturated mid-tones pick black text they could not carry.
 *
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 *
 * @param {string|{r: number, g: number, b: number}} color Hex string or RGB map.
 * @return {number} Relative luminance in the 0-1 range.
 */
export const relativeLuminance = ( color ) => {
	const rgb = typeof color === 'string' ? hexToRgb( color ) : color;

	const channels = [ rgb.r, rgb.g, rgb.b ].map( ( channel ) => {
		const c = channel / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow( ( c + 0.055 ) / 1.055, 2.4 );
	} );

	return (
		0.2126 * channels[ 0 ] + 0.7152 * channels[ 1 ] + 0.0722 * channels[ 2 ]
	);
};

/**
 * WCAG contrast ratio between two colors, from 1:1 to 21:1.
 *
 * @param {string|{r: number, g: number, b: number}} colorA First color.
 * @param {string|{r: number, g: number, b: number}} colorB Second color.
 * @return {number} Contrast ratio.
 */
export const contrastRatio = ( colorA, colorB ) => {
	const l1 = relativeLuminance( colorA );
	const l2 = relativeLuminance( colorB );
	const lighter = Math.max( l1, l2 );
	const darker = Math.min( l1, l2 );

	return ( lighter + 0.05 ) / ( darker + 0.05 );
};

/**
 * Pick black or white -- whichever carries more contrast -- for text sitting on
 * the given background. This is the automatic font contrast detection: dark
 * text on light brand colors, light text on dark ones.
 *
 * @param {string|{r: number, g: number, b: number}} background Background color.
 * @return {string} '#000000' or '#FFFFFF'.
 */
export const idealTextColor = ( background ) => {
	return contrastRatio( background, '#FFFFFF' ) >=
		contrastRatio( background, '#000000' )
		? '#FFFFFF'
		: '#000000';
};

/**
 * Contrast ratio the background actually achieves once idealTextColor has
 * chosen its text color -- i.e. the best ratio available on that background.
 * The settings UI warns only when even this best case falls below AA, since
 * that is the only case the automatic choice cannot rescue.
 *
 * @param {string|{r: number, g: number, b: number}} background Background color.
 * @return {number} Contrast ratio of the auto-selected text color.
 */
export const bestContrastRatio = ( background ) => {
	return Math.max(
		contrastRatio( background, '#FFFFFF' ),
		contrastRatio( background, '#000000' )
	);
};

/** WCAG 2.1 minimum contrast ratios for body text: AA is 4.5:1, AAA is 7:1. */
export const AA_CONTRAST = 4.5;
export const AAA_CONTRAST = 7;

/**
 * The ratio every derived color is held to, per the site's setting. AAA shifts
 * brand-derived colors further from the picked hue, so it is opt-in.
 *
 * @param {string} level 'aa' or 'aaa'.
 * @return {number} 4.5 or 7.
 */
export const contrastTargetFor = ( level ) =>
	level === 'aaa' ? AAA_CONTRAST : AA_CONTRAST;

const rgbToHex = ( rgb ) => {
	const hex = ( value ) =>
		Math.max( 0, Math.min( 255, Math.round( value ) ) )
			.toString( 16 )
			.padStart( 2, '0' )
			.toUpperCase();

	return `#${ hex( rgb.r ) }${ hex( rgb.g ) }${ hex( rgb.b ) }`;
};

const rgbToHsl = ( rgb ) => {
	const r = rgb.r / 255;
	const g = rgb.g / 255;
	const b = rgb.b / 255;
	const max = Math.max( r, g, b );
	const min = Math.min( r, g, b );
	const delta = max - min;
	const l = ( max + min ) / 2;

	let h = 0;
	let s = 0;

	if ( delta !== 0 ) {
		s = delta / ( 1 - Math.abs( 2 * l - 1 ) );

		if ( max === r ) {
			h = ( ( g - b ) / delta ) % 6;
		} else if ( max === g ) {
			h = ( b - r ) / delta + 2;
		} else {
			h = ( r - g ) / delta + 4;
		}

		h *= 60;
		if ( h < 0 ) {
			h += 360;
		}
	}

	return { h, s, l };
};

const hslToRgb = ( hsl ) => {
	const c = ( 1 - Math.abs( 2 * hsl.l - 1 ) ) * hsl.s;
	const x = c * ( 1 - Math.abs( ( ( hsl.h / 60 ) % 2 ) - 1 ) );
	const m = hsl.l - c / 2;
	const sextant = Math.floor( hsl.h / 60 ) % 6;
	const table = [
		[ c, x, 0 ],
		[ x, c, 0 ],
		[ 0, c, x ],
		[ 0, x, c ],
		[ x, 0, c ],
		[ c, 0, x ],
	];
	const [ r, g, b ] = table[ sextant < 0 ? sextant + 6 : sextant ];

	return {
		r: ( r + m ) * 255,
		g: ( g + m ) * 255,
		b: ( b + m ) * 255,
	};
};

/**
 * Nudge a foreground color's lightness -- hue and saturation untouched -- until
 * it clears `target` against every background it can be drawn on, and no further.
 *
 * This is what keeps brand-colored labels and icons legible on a template's own
 * chrome: a near-black brand color on Linear Dark's black sidebar is lightened
 * just enough to pass, a pale brand color on Vercel Minimal's white sidebar is
 * darkened. Colors that already pass are returned untouched, so most brand
 * choices render exactly as picked.
 *
 * Pass every surface the color appears on -- an item's resting background AND
 * its hover fill, say. Contrast is checked against the whole set, because a
 * label tuned only to the resting background loses ratio the moment the hover
 * fill slides underneath it.
 *
 * @param {string|{r: number, g: number, b: number}} foreground Color to adjust.
 * @param {string|{r: number, g: number, b: number}|Array} backgrounds Background(s) it sits on.
 * @param {number} [target] Minimum contrast ratio, defaults to AA (4.5:1).
 * @return {string} Hex color meeting the target where achievable.
 */
export const accessibleOn = ( foreground, backgrounds, target = AA_CONTRAST ) => {
	const fgRgb =
		typeof foreground === 'string' ? hexToRgb( foreground ) : foreground;
	const bgList = Array.isArray( backgrounds ) ? backgrounds : [ backgrounds ];
	const worstRatio = ( color ) =>
		Math.min( ...bgList.map( ( bg ) => contrastRatio( color, bg ) ) );

	if ( worstRatio( fgRgb ) >= target ) {
		return rgbToHex( fgRgb );
	}

	const hsl = rgbToHsl( fgRgb );

	// Move away from the backgrounds: lighten on dark ones, darken on light. If
	// that end of the scale cannot reach the target (a saturated hue can top out
	// below 4.5:1), try the other direction before falling back.
	const bgIsDark =
		bgList.reduce( ( sum, bg ) => sum + relativeLuminance( bg ), 0 ) /
			bgList.length <
		0.1791;
	const directions = bgIsDark ? [ 1, 0 ] : [ 0, 1 ];

	// Candidates are measured after rounding to 8-bit hex, so the ratio reported
	// here is the ratio the browser will actually render.
	const atLightness = ( l ) => rgbToHex( hslToRgb( { ...hsl, l } ) );

	for ( const bound of directions ) {
		if ( worstRatio( atLightness( bound ) ) < target ) {
			continue;
		}

		// Binary search for the smallest lightness shift that still passes, so
		// the adjusted color stays as close to the user's pick as possible.
		let near = hsl.l;
		let far = bound;

		for ( let i = 0; i < 24; i++ ) {
			const mid = ( near + far ) / 2;

			if ( worstRatio( atLightness( mid ) ) >= target ) {
				far = mid;
			} else {
				near = mid;
			}
		}

		return atLightness( far );
	}

	// Fully desaturated fallback: black or white, whichever the backgrounds take.
	return idealTextColor( bgList[ 0 ] );
};

/**
 * Nudge a fill color's lightness until black or white text can clear `target`
 * on top of it, and no further.
 *
 * Mid-tone colors around #767676 top out near 4.48:1 against both black and
 * white -- no text color can rescue them, so the fill itself has to give. Every
 * surface that carries text on a brand fill (the active menu item, the avatar,
 * the environment badge, and the whole of Classic Elevated's chrome) is painted
 * with this rather than the raw pick, so no brand color leaves text under AA.
 * Anything already clear of the band is returned untouched.
 *
 * @param {string|{r: number, g: number, b: number}} color Fill color.
 * @param {number} [target] Minimum contrast ratio, defaults to AA (4.5:1).
 * @return {string} Hex color whose ideal text color meets the target.
 */
export const legibleFill = ( color, target = AA_CONTRAST ) => {
	const rgb = typeof color === 'string' ? hexToRgb( color ) : color;

	if ( bestContrastRatio( rgb ) >= target ) {
		return rgbToHex( rgb );
	}

	const hsl = rgbToHsl( rgb );
	const atLightness = ( l ) => rgbToHex( hslToRgb( { ...hsl, l } ) );

	// The band is narrow, so both exits are close. Take whichever is the smaller
	// departure from the color the user picked.
	const candidates = [];

	for ( const bound of [ 0, 1 ] ) {
		if ( bestContrastRatio( atLightness( bound ) ) < target ) {
			continue;
		}

		let near = hsl.l;
		let far = bound;

		for ( let i = 0; i < 24; i++ ) {
			const mid = ( near + far ) / 2;

			if ( bestContrastRatio( atLightness( mid ) ) >= target ) {
				far = mid;
			} else {
				near = mid;
			}
		}

		candidates.push( { l: far, distance: Math.abs( far - hsl.l ) } );
	}

	if ( ! candidates.length ) {
		return rgbToHex( rgb );
	}

	candidates.sort( ( a, b ) => a.distance - b.distance );

	return atLightness( candidates[ 0 ].l );
};

/**
 * A translucent tint of the background's contrast color, opaque enough to still
 * clear `target`. Templates use these for secondary labels and dividers; on a
 * pale brand color a 60% black label would drop under AA, so the alpha is
 * raised until it passes rather than the color being left unreadable.
 *
 * @param {string|{r: number, g: number, b: number}} background Background color.
 * @param {number} alpha Preferred opacity, 0-1.
 * @param {number} [target] Minimum contrast ratio, 0 to skip the check.
 * @return {string} rgba() string.
 */
export const contrastTint = (
	background,
	alpha,
	target = AA_CONTRAST,
	against = null
) => {
	const bgRgb =
		typeof background === 'string' ? hexToRgb( background ) : background;
	const surfaces = against && against.length ? against : [ bgRgb ];
	const channel = idealTextColor( bgRgb ) === '#FFFFFF' ? 255 : 0;
	// Composited channels are rounded to 8 bits, the way the browser will
	// rasterize them -- checking the float would pass tints that render a shade
	// short of the target.
	const composite = ( a ) => ( {
		r: Math.round( a * channel + ( 1 - a ) * bgRgb.r ),
		g: Math.round( a * channel + ( 1 - a ) * bgRgb.g ),
		b: Math.round( a * channel + ( 1 - a ) * bgRgb.b ),
	} );
	const worst = ( a ) =>
		Math.min(
			...surfaces.map( ( surface ) =>
				contrastRatio( composite( a ), surface )
			)
		);

	let resolved = alpha;

	if ( target > 0 && worst( alpha ) < target ) {
		// Contrast rises monotonically with alpha, so bisect between the asked
		// alpha and fully opaque -- which is idealTextColor and always the best
		// available on this background.
		let low = alpha;
		let high = 1;

		for ( let i = 0; i < 16; i++ ) {
			const mid = ( low + high ) / 2;

			if ( worst( mid ) >= target ) {
				high = mid;
			} else {
				low = mid;
			}
		}

		// The emitted alpha carries two decimals, so round UP -- rounding down
		// would ship a slightly thinner tint than the one just verified.
		resolved = Math.min( 1, Math.ceil( high * 100 ) / 100 );
	}

	return `rgba(${ channel },${ channel },${ channel },${ Number(
		resolved.toFixed( 2 )
	) })`;
};

/**
 * A translucent wash for hover fills, dividers and panel borders drawn on a
 * brand-painted surface.
 *
 * This is the INVERSE of contrastTint: it uses the channel furthest from the
 * text color, so the fill slides the background away from the text rather than
 * toward it. Washing a light brand chrome with black would darken it under its
 * own dark labels and drop them below AA; lightening it further keeps them
 * clear.
 *
 * @param {string|{r: number, g: number, b: number}} background Surface color.
 * @param {number} alpha Opacity, 0-1.
 * @return {string} rgba() string.
 */
export const surfaceTint = ( background, alpha ) => {
	const channel = idealTextColor( background ) === '#FFFFFF' ? 0 : 255;

	return `rgba(${ channel },${ channel },${ channel },${ alpha })`;
};

/**
 * The 10% brand tint used for hover states.
 *
 * @param {string|{r: number, g: number, b: number}} color Brand color.
 * @return {string} rgba() string.
 */
export const brandHoverTint = ( color ) => {
	const rgb = typeof color === 'string' ? hexToRgb( color ) : color;
	return `rgba(${ rgb.r }, ${ rgb.g }, ${ rgb.b }, 0.10)`;
};
