import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ModalComponent } from './modal/modal.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './shared/user/user.service';
import { SharedService } from './shared/shared-service';
// import { TictacComponent } from './tictac/tictac.component';
// import { TictacModule } from './tictac/tictac.module';
import { NotifyBarComponent } from './notify-bar/notify-bar.component';
import { User } from './shared/interfaces';
import { NavBarComponent } from './nav-bar/nav-bar.component';

const APP_ID = 'tictacx';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		ModalComponent,
		LoginScreenComponent,
		NotifyBarComponent,
		NavBarComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		FormsModule,
		HttpClientModule,
		BrowserTransferStateModule,
		BrowserModule.withServerTransition({ appId: APP_ID }),
		// TictacModule,
	],
	providers: [
		UserService,
		SharedService,
	],
	// entryComponents: [
	// 	TictacComponent
	// ],
	bootstrap: [AppComponent]
})
export class AppModule { }
