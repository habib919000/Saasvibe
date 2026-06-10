import { useState, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { Download, Upload, ShieldAlert, X, FileJson, CheckCircle } from 'lucide-react';
import useApi from '@hooks/useApi';

export const ExportModal = ( { isOpen, onClose, onImportSuccess } ) => {
    const isPro = window.SaasMenu_Vars?.is_pro || false;
    // For local evaluation, check if agency tier is active
    const licenseTier = window.SaasMenu_Vars?.settings?.license_tier || ( isPro ? 'agency' : 'free' ); 
    const isAgency = licenseTier === 'agency';

    const [ isImporting, setIsImporting ] = useState( false );
    const [ importStatus, setImportStatus ] = useState( null ); // 'success' | 'error'
    const [ errorMessage, setErrorMessage ] = useState( '' );
    const fileInputRef = useRef( null );
    const api = useApi();

    if ( ! isOpen ) {
        return null;
    }

    const handleExport = () => {
        if ( ! isAgency ) {
            alert( __( 'Exporting settings is an Agency feature. Please upgrade your plan.', 'saasmenu' ) );
            return;
        }

        const restUrl = window.SaasMenu_Vars?.rest_url || '';
        const permission = window.SaasMenu_Vars?.permission || '';
        
        // Trigger a direct browser file download by redirecting to our REST export route
        window.location.href = `${ restUrl }settings/export?is_admin=true&_wpnonce=${ permission }`;
    };

    const handleImportClick = () => {
        if ( ! isAgency ) {
            alert( __( 'Importing settings is an Agency feature. Please upgrade your plan.', 'saasmenu' ) );
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async ( e ) => {
        const file = e.target.files?.[ 0 ];
        if ( ! file ) {
            return;
        }

        setIsImporting( true );
        setImportStatus( null );
        setErrorMessage( '' );

        const reader = new FileReader();
        reader.onload = async ( event ) => {
            try {
                const jsonContent = JSON.parse( event.target?.result );
                
                // Call standard REST API importer
                const response = await api.post( 'settings/import', jsonContent );
                
                if ( response.success ) {
                    setImportStatus( 'success' );
                    if ( onImportSuccess ) {
                        onImportSuccess( response.data );
                    }
                } else {
                    setImportStatus( 'error' );
                    setErrorMessage( response.message || __( 'Import failed. Unknown error.', 'saasmenu' ) );
                }
            } catch ( err ) {
                setImportStatus( 'error' );
                setErrorMessage( __( 'Invalid JSON file content.', 'saasmenu' ) );
            } finally {
                setIsImporting( false );
            }
        };

        reader.readAsText( file );
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[600] p-4 select-none">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
                { /* Header */ }
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-800 m-0">
                        { __( 'Import / Export Settings', 'saasmenu' ) }
                    </h3>
                    <button
                        onClick={ onClose }
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                { /* Content */ }
                <div className="p-6 space-y-6">
                    { ! isAgency && (
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-indigo-950 text-xs">
                            <ShieldAlert className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-semibold block text-indigo-900 mb-0.5">{ __( 'Agency Feature Upgrade Required', 'saasmenu' ) }</span>
                                { __( 'Exporting configurations into a JSON file or importing settings on client deployments is limited to the Agency Plan ($89/yr). Upgrade to unlock.', 'saasmenu' ) }
                            </div>
                        </div>
                    ) }

                    <div className="grid grid-cols-2 gap-4">
                        { /* Export Button Card */ }
                        <button
                            type="button"
                            onClick={ handleExport }
                            disabled={ ! isAgency }
                            className={ `flex flex-col items-center justify-center p-6 border rounded-xl gap-2 transition-all ${
                                isAgency
                                    ? 'border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-700 hover:text-indigo-700 cursor-pointer'
                                    : 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'
                            }` }
                        >
                            <Download className={ `h-6 w-6 ${ isAgency ? 'text-indigo-600' : 'text-slate-300' }` } />
                            <span className="text-xs font-semibold">{ __( 'Export JSON', 'saasmenu' ) }</span>
                            <span className="text-[10px] text-slate-400 text-center leading-normal">
                                { __( 'Download current configurations.', 'saasmenu' ) }
                            </span>
                        </button>

                        { /* Import Button Card */ }
                        <button
                            type="button"
                            onClick={ handleImportClick }
                            disabled={ ! isAgency || isImporting }
                            className={ `flex flex-col items-center justify-center p-6 border rounded-xl gap-2 transition-all ${
                                isAgency
                                    ? 'border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-700 hover:text-indigo-700 cursor-pointer'
                                    : 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'
                            }` }
                        >
                            <Upload className={ `h-6 w-6 ${ isAgency ? 'text-indigo-600' : 'text-slate-300' }` } />
                            <span className="text-xs font-semibold">{ __( 'Import JSON', 'saasmenu' ) }</span>
                            <span className="text-[10px] text-slate-400 text-center leading-normal">
                                { __( 'Upload saasmenu-settings.json file.', 'saasmenu' ) }
                            </span>
                        </button>
                        <input
                            ref={ fileInputRef }
                            type="file"
                            accept=".json"
                            onChange={ handleFileChange }
                            className="hidden"
                        />
                    </div>

                    { /* Import feedback status message */ }
                    { isImporting && (
                        <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                            <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin block"></span>
                            { __( 'Uploading and writing configurations...', 'saasmenu' ) }
                        </div>
                    ) }

                    { importStatus === 'success' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800 text-xs">
                            <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                            <span>{ __( 'Settings imported successfully! Reloading variables...', 'saasmenu' ) }</span>
                        </div>
                    ) }

                    { importStatus === 'error' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800 text-xs">
                            <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                            <span>{ errorMessage }</span>
                        </div>
                    ) }
                </div>

                { /* Footer */ }
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        type="button"
                        onClick={ onClose }
                        className="bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        { __( 'Close Window', 'saasmenu' ) }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
