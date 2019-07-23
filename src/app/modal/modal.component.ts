import { Component, OnInit, Input, OnDestroy, ViewChildren, Output } from '@angular/core';
import { SharedService } from '../shared/shared-service';
import { EventEmitter } from '@angular/core';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

	@Input() modalTypeRecieved;
	@Output() closeModalEvent = new EventEmitter();
	@ViewChildren('instuctList') instuctList: any;

	message: string;
	type: string;
	instructions: Array<string> = [];
	current: number = 0;
	tictacInstructions: Array<string> = [
		'there\'s 9 boards and 9 cells per board',
		'selecting a cell will send you\'re opponent to the corresponding board',
		'you can\'t send opponent back to the board they were just on',
		'the goal is win three boards in a row',
		'be strategic and plan ahead'
	];

	constructor(private _sharedService: SharedService) { 
		
	}

	ngOnInit() {

		if (this._sharedService.isServer) return;

		if (this.modalTypeRecieved === 'tictac') {

			this.instructions = this.tictacInstructions;

		}

	}

	close(): void {
		
		this.closeModalEvent.emit('closeModal');

	}

	prev() {

		if (this.current === 0) {
			// close modal
			return;
		}

		this.helper(() => this.current--);

	}

	next() {
		
		if (this.current === this.instuctList._results.length -1) {
			// close modal
			return this.close();
		}

		this.helper(() => this.current++);

	}

	helper(cb: Function): void {

		let r = this.instuctList._results[this.current];

		r['nativeElement']['className'] = 'hide';

		cb();

		r = this.instuctList._results[this.current];

		r['nativeElement']['className'] = 'active';		

	}

	ngOnDestroy() {
		
		if (this._sharedService.isServer) return;

		console.log('ModalComponent destroyed')
	}

}
