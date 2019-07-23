import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { BoardComponent } from './board/board.component';
import { BoardService } from './board/board.service';

export const componentDeclarations: any[] = [
	BoardComponent
];

export const providerDeclarations: any[] = [
	BoardService
];

export const routes: Routes = [
	// { path: 'g', component: ChannelComponent }
];


@NgModule({
	imports: [NativeScriptRouterModule.forChild(routes)],  // set the lazy loaded routes using forChild
	exports: [NativeScriptRouterModule]
})
export class TictacRoutingModule { }