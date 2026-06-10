/**
   * Custom hook for REST API requests.
   * Leverages SaasMenu_Vars injected via wp_localize_script.
   */
  
  const buildQueryString = ( params ) => {
      return Object.keys( params )
          .map( ( key ) => encodeURIComponent( key ) + '=' + encodeURIComponent( params[ key ] ) )
          .join( '&' );
  };
  
  export const useApi = () => {
      const get = ( path, params = {} ) => {
          const restUrl = window.SaasMenu_Vars?.rest_url || '';
          const permission = window.SaasMenu_Vars?.permission || '';
          const isAdmin = window.SaasMenu_Vars?.is_admin || false;
  
          const queryParams = {
              ...params,
              is_admin: isAdmin,
          };
  
          return fetch( `${restUrl}${path}?${buildQueryString( queryParams )}`, {
              headers: {
                  'X-WP-Nonce': permission,
              },
          } ).then( ( r ) => {
              if ( ! r.ok ) {
                  return r.json().then( ( err ) => {
                      throw err;
                  } );
              }
              return r.json();
          } );
      };
  
      const post = ( path, body = {} ) => {
          const restUrl = window.SaasMenu_Vars?.rest_url || '';
          const permission = window.SaasMenu_Vars?.permission || '';
          const isAdmin = window.SaasMenu_Vars?.is_admin || false;
  
          const bodyData = {
              ...body,
              is_admin: isAdmin,
          };
  
          return fetch( `${restUrl}${path}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-WP-Nonce': permission,
              },
              body: JSON.stringify( bodyData ),
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
  
