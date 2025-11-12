import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ComponenteRaiz } from './app/app.component';

// Inicializa a aplicação com o componente raiz
bootstrapApplication(ComponenteRaiz, appConfig)
  .catch((err) => console.error(err));
