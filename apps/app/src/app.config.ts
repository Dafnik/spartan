import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { PreloadAllModules, withInMemoryScrolling, withNavigationErrorHandler, withPreloading } from '@angular/router';
import { StyleAwareOverlayContainer } from './app/shared/style-aware-overlay-container';
import { provideTrpcClient } from './trpc-client';

export const appConfig: ApplicationConfig = {
	providers: [
		provideFileRouter(
			withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
			withNavigationErrorHandler(console.log),
			// Preloading every lazy page in dev makes Vite compile all ~140 pages (and every example they
			// import) on both the server and the client right after the first navigation, which stalls
			// the dev server for many seconds. Production chunks are prebuilt, so keep it there.
			...(import.meta.env.DEV ? [] : [withPreloading(PreloadAllModules)]),
		),
		provideClientHydration(),
		provideTrpcClient(),
		provideHttpClient(withFetch(), withInterceptors([requestContextInterceptor])),
		// Overlays inherit the style of their trigger's island instead of one global value (see the class).
		{ provide: OverlayContainer, useClass: StyleAwareOverlayContainer },
	],
};
