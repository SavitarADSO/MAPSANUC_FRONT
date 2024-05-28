import { Routes } from '@angular/router';
import { BodyComponent } from './inicio/body/body.component';

import { AnucComponent } from './mapa/anuc/anuc.component';
import { AsociadoComponent} from './mapa/asociado/asociado.component';
import { AdministradorComponent} from './mapa/administrador/administrador.component';

export const routes: Routes = [
    {path: '', redirectTo:'inicio/body',pathMatch:'full'},
    {path: 'inicio/body', component: BodyComponent },

    {path: 'mapa/anuc', component: AnucComponent },

    {path: 'mapa/asociado', component: AsociadoComponent },

    {path: 'mapa/administrador', component: AdministradorComponent }, 

];
