import { Component, OnInit } from '@angular/core';
import { KnowelApiService } from '../_service/knowel-api.service';
import { Router,ActivatedRoute } from '@angular/router';
import { AppRoutingModule } from '../app-routing/app-routing.module';

@Component({
  selector: 'app-package-viewer',
  templateUrl: './package-viewer.component.html',
  styleUrls: ['./package-viewer.component.css']
})

export class PackageViewerComponent implements OnInit {
  b_flag;libButtonHF;lib_pur_title;
  pkg_id;packName;packDescription;packNotes;
  packID;
  author_name;

constructor(private route: ActivatedRoute,private _routes: Router,private _service: KnowelApiService){ }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.id)
      .subscribe(params => {
        //console.log(params);
        this.pkg_id = params.id;
      });

      this.getPackInfo();
  }

 checkIfPur(pkg_id){
   var options = {
    "v_class": "library",
    "v_function": "checkIfPur",
    "value":{
      "package_id": this.pkg_id,
      "token": localStorage.getItem('token')
    }
  };
  this._service.postRequestWithObservable(options)
     .subscribe(res => {
       console.log(res);
    if(res == false){
      this.b_flag = true;
      this.libButtonHF = false;
      this.lib_pur_title = true;
    }else{
      this.b_flag = false;
      this.libButtonHF = true;
      this.lib_pur_title = false;
    }
  });
 }

 goBackFunction(){
   this._routes.navigate(['/library']);
 }

 cancel_pack(){
    this.packName = "";
    this.packDescription = "";
    this.packNotes = "";
    this._routes.navigate(['/basic']);
 }

 getPackage(pkg_id){
   let options = {
       "v_class": "library",
       "v_function": "addPurchasePackage",
       "value": {
         "packID":this.pkg_id,
         "token": localStorage.getItem('token')
       }
     };
     this._service.postRequestWithObservable(options)
        .subscribe(res => {
          console.log(res);
       if(res == "true"){
         alert("Content Added to Library");
         //this._routes.refresh();
       }else{
         alert("Sorry: Something went Wrong, Try again later. :|")
       }
       console.log("data >> "+res);
     });
 }

   getPackInfo(){
       let options = {
         "v_class": "library",
         "v_function": "getPackageInfoStore",
         "value": {
           "packID":this.pkg_id,
           "token": localStorage.getItem('token')
         }
       };
       this._service.postRequestWithObservable(options)
          .subscribe(res => {
            console.log(res);
         this.author_name = res.result.author_name;
         this.packName = res.result.packName;
         this.packDescription = res.result.description;
       });
     }

}
