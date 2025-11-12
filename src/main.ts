import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ComponenteRaiz } from './app/app.component';

// basicamente iniciar o angular
bootstrapApplication(ComponenteRaiz, appConfig)
  .catch((err) => console.error(err));
