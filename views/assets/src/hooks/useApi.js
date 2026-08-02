/**
 * Custom hook for REST API requests.
 * Leverages Saasvibe_Vars injected via wp_localize_script.
 */

const buildQueryString = ( params ) => {
	return Object.keys( params )
		.map(
			( key ) =>
				encodeURIComponent( key ) +
				'=' +
				encodeURIComponent( params[ key ] )
		)
		.join( '&' );
};

export const useApi = () => {
	const get = ( path, params = {} ) => {
		const restUrl = window.Saasvibe_Vars?.rest_url || '';
		const permission = window.Saasvibe_Vars?.permission || '';

		// Capability is decided server-side from the authenticated user; sending
		// a client-supplied "is_admin" alongside it only looked like a trust
		// boundary, and every endpoint ignored it.
		const query = buildQueryString( params );

		return fetch(
			`${ restUrl }${ path }${ query ? `?${ query }` : '' }`,
			{
				headers: {
					'X-WP-Nonce': permission,
				},
			}
		).then( ( r ) => {
			if ( ! r.ok ) {
				return r.json().then( ( err ) => {
					throw err;
				} );
			}
			return r.json();
		} );
	};

	const post = ( path, body = {} ) => {
		const restUrl = window.Saasvibe_Vars?.rest_url || '';
		const permission = window.Saasvibe_Vars?.permission || '';

		return fetch( `${ restUrl }${ path }`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-WP-Nonce': permission,
			},
			body: JSON.stringify( body ),
		} ).then( ( r ) => {
			if ( ! r.ok ) {
				return r.json().then( ( err ) => {
					throw err;
				} );
			}
			return r.json();
		} );
	};

	return { get, post };
};

export default useApi;
