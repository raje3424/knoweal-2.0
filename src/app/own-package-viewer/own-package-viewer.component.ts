import { Component, OnInit } from '@angular/core';
import { KnowelApiService } from '../_service/knowel-api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-own-package-viewer',
  templateUrl: './own-package-viewer.component.html',
  styleUrls: ['./own-package-viewer.component.css']
})
export class OwnPackageViewerComponent implements OnInit {
  theMainQCanvas = false;
  editableCanvas = true;
  q_edit = "Edit";
  pkg_edit_flag = true;theQestionList = [];
  packID;packDescription;author_name;packNotes;packName;
  
  constructor(private route: ActivatedRoute,private _routes: Router,private _service: KnowelApiService) { }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.id)
      .subscribe(params => {
        //console.log(params);
        this.packID = params.id;
      });

  //  console.log(this.packID);
    this.getAllPackInfo();
  }

  goBackFunction(){
   this._routes.navigate(['/library']);
  }

  getAllPackInfo(){
    var options ={
      "v_class": "library",
      "v_function": "getPur_PackageInfo",
      "value": {
          "packID": this.packID,
          "token": localStorage.getItem('token')
        }
    };
    this._service.postRequestWithObservable(options)
       .subscribe(res => {
         console.log(res.result);
         //console.log(res.result.packNotes);
        // console.log(":: pack notes >>  "+res.result.packNotes);
        // console.log(res.result['packName']);
         this.packName = res.result.packName;
         //console.log(this.packName);
        this.packDescription = res.result.packDescription;
        this.packNotes = res.result.packNotes;
        this.author_name = res.result.author_name;
    });
  }

}
