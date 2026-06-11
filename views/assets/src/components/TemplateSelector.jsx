import { __ } from '@wordpress/i18n';
import { Lock, Check } from 'lucide-react';

export const TemplateSelector = ( { currentTemplate, onSelect } ) => {
	const templates = window.SaasMenu_Vars?.templates || [];
	const isPro = window.SaasMenu_Vars?.is_pro || false;

	return (
		<div className="saasmenu-template-selector p-6">
			<div className="mb-6">
				<h2 className="text-xl font-semibold text-slate-800 m-0">
					{ __( 'Select a Design Template', 'saasmenu' ) }
				</h2>
				<p className="text-sm text-slate-500 mt-1">
					{ __(
						'Choose from modern SaaS templates to transform your WordPress dashboard.',
						'saasmenu'
					) }
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{ templates.map( ( template ) => {
					const isLocked = template.tier === 'pro' && ! isPro;
					const isSelected = currentTemplate === template.id;

					return (
						<div
							key={ template.id }
							onClick={ () => {
								if ( isLocked ) {
									alert(
										__(
											'This template requires a Pro License.',
											'saasmenu'
										)
									);
									return;
								}
								onSelect( template.id );
							} }
							className={ `relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 bg-white group ${
								isSelected
									? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md'
									: 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
							} ${ isLocked ? 'opacity-80' : '' }` }
						>
							{ /* Template Preview Mockup Area */ }
							<div className="h-32 bg-slate-50 flex items-center justify-center relative border-b border-slate-100">
								{ /* Display layout representation */ }
								<div className="w-4/5 h-20 bg-white border border-slate-200 rounded shadow-sm flex overflow-hidden">
									{ /* Sidebar representation */ }
									<div
										style={ {
											backgroundColor:
												template.defaultColors
													.background,
											width: '24%',
											borderRight:
												'1px solid rgba(0, 0, 0, 0.05)',
										} }
										className="h-full p-1.5 flex flex-col justify-between"
									>
										<div className="space-y-1">
											<div className="h-2 w-8 bg-slate-300 rounded-sm opacity-50"></div>
											<div className="h-1.5 w-10 bg-slate-300 rounded-sm opacity-30"></div>
											<div className="h-1.5 w-6 bg-slate-300 rounded-sm opacity-30"></div>
										</div>
										<div
											style={ {
												backgroundColor:
													template.defaultColors
														.accent,
											} }
											className="h-2 w-full rounded-sm opacity-70"
										></div>
									</div>
									{ /* Content area representation */ }
									<div className="flex-1 bg-slate-50 flex flex-col">
										<div className="h-4 bg-white border-b border-slate-200 flex items-center px-1">
											<div className="h-1.5 w-6 bg-slate-300 rounded-sm opacity-50"></div>
										</div>
										<div className="p-2 space-y-1">
											<div className="h-2 w-16 bg-slate-200 rounded-sm"></div>
											<div className="h-1.5 w-full bg-slate-100 rounded-sm"></div>
											<div className="h-1.5 w-4/5 bg-slate-100 rounded-sm"></div>
										</div>
									</div>
								</div>

								{ isSelected && (
									<div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 shadow-sm">
										<Check className="h-4 w-4" />
									</div>
								) }

								{ isLocked && (
									<div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center">
										<div className="bg-white/90 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm text-xs font-semibold text-slate-700">
											<Lock className="h-3.5 w-3.5 text-indigo-600" />
											{ __( 'PRO ONLY', 'saasmenu' ) }
										</div>
									</div>
								) }
							</div>

							{ /* Template Meta Info */ }
							<div className="p-4">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
										{ template.name }
									</h3>
									<span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
										{ template.designRef }
									</span>
								</div>
								<div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
									{ /* Default color circles */ }
									<div className="flex items-center gap-1">
										<span className="text-[10px] text-slate-400 mr-1">
											{ __( 'Palette:', 'saasmenu' ) }
										</span>
										<span
											style={ {
												backgroundColor:
													template.defaultColors
														.background,
											} }
											className="w-3.5 h-3.5 rounded-full border border-slate-200 block"
											title={ __(
												'Background',
												'saasmenu'
											) }
										/>
										<span
											style={ {
												backgroundColor:
													template.defaultColors
														.accent,
											} }
											className="w-3.5 h-3.5 rounded-full border border-slate-200 block"
											title={ __( 'Accent', 'saasmenu' ) }
										/>
										<span
											style={ {
												backgroundColor:
													template.defaultColors
														.hover,
											} }
											className="w-3.5 h-3.5 rounded-full border border-slate-200 block"
											title={ __( 'Hover', 'saasmenu' ) }
										/>
									</div>
									<span className="text-xs text-slate-400 capitalize">
										{ template.style === 'both'
											? __( 'Full Theme', 'saasmenu' )
											: __( 'Sidebar Only', 'saasmenu' ) }
									</span>
								</div>
							</div>
						</div>
					);
				} ) }
			</div>
		</div>
	);
};

export default TemplateSelector;
