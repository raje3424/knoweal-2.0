import { Component, OnInit } from '@angular/core';
import { KnowelApiService } from '../_service/knowel-api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-own-package-viewer',
  templateUrl: './own-package-viewer.component.html',
  styleUrls: ['./own-package-viewer.component.css']
})
export class OwnPackageViewerComponent implements OnInit {

  constructor(private route: ActivatedRoute,private _routes: Router,private _service: KnowelApiService) { }

  ngOnInit() {
  }

  goBackFunction(){
   this._routes.navigate(['/library']);
  }
}
