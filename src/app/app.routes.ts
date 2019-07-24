import { Routes, CanActivate } from '@angular/router';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
	{
		path: 'login',
		component: LoginScreenComponent
	},
	{
		path: 'home',
		component: HomeComponent,
	},	
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
	{
		path: 'tictac',
		loadChildren: './tictac/tictac.module#TictacModule'
		// loadChildren: () => import('./tictac/tictac.module').then(m => m.TictacModule)
	}
];
