
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIndexedDb, DBConfig } from 'ngx-indexed-db';import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

const dbConfig: DBConfig = {
  name: 'TaskDB',
  version: 1,
  objectStoresMeta: [{
    store: 'tasks',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'title', keypath: 'title', options: { unique: false } },
      { name: 'category', keypath: 'category', options: { unique: false } },
      { name: 'completed', keypath: 'completed', options: { unique: false } }
    ]
  }]
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideIndexedDb(dbConfig)
  ]
};
