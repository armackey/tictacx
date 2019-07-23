import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board/board.component';
import { BoardService } from './board/board.service';
import { Routes, RouterModule } from '@angular/router';
import { TictacComponent } from './tictac.component';
import { TicTacResolver } from './tictac-resolver.service';

const routes: Routes = [
    { path: "", component: BoardComponent},
	{ path: ":id", component: TictacComponent, 
		resolve: { 
			resolvedData: TicTacResolver 
		} 
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],  // set the lazy loaded routes using forChild
	exports: [RouterModule]
})
export class TictacRoutingModule { }

@NgModule({
	declarations: [
		BoardComponent,
		TictacComponent
	],
	imports: [
		CommonModule,
		TictacRoutingModule
	],
	providers: [
		BoardService
	],
	// entryComponents: [
	// 	TictacComponent
	// ],
})
export class TictacModule { }
