import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared-service';

@Component({
	selector: 'app-notify-bar',
	templateUrl: './notify-bar.component.html',
	styleUrls: ['./notify-bar.component.css']
})
export class NotifyBarComponent implements OnInit {

	constructor(
		public sharedService: SharedService
	) { }

	ngOnInit() {
	}

}
