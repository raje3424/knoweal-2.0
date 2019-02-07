import { Component, OnInit } from '@angular/core';
import { KnowelApiService } from '../_service/knowel-api.service';
import { Router,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-package-viewer',
  templateUrl: './package-viewer.component.html',
  styleUrls: ['./package-viewer.component.css']
})

export class PackageViewerComponent implements OnInit {
  b_flag;libButtonHF;lib_pur_title;
  pkg_id;packName;packDescription;packNotes;
  packID;
  author_name;price;req;orderObj:any=[];
  backTo;

constructor(private route: ActivatedRoute,private _routes: Router,private _service: KnowelApiService){ }

  ngOnInit() {
    this.route.queryParams
      // .filter(params => params.id)
      .subscribe(params => {
        this.orderObj ={...params.keys, ...params};
        console.log(this.orderObj);
         this.pkg_id = this.orderObj.id;
         console.log(this.pkg_id);
         this.req =this.orderObj.req;
      });
      if(this.req=='lib'){
        this.backTo ="Library";
      }else{
        this.backTo = "Stream";
      }
      this.getPackInfo();
      //this.checkIfPur(this.pkg_id);
  }

 checkIfPur(pkg_id){
   var options = {
    "v_class": "library",
    "v_function": "checkIfPur",
    "value":{
      "package_id": pkg_id,
      "token": localStorage.getItem('token')
    }
  };
  this._service.postRequestWithObservable(options)
     .subscribe(res => {
       console.log(res);
    if(res.response == "false"){
      this.b_flag = true;
      if(this.req == 'lib'){
      this.libButtonHF = true;
      this.lib_pur_title = false;
    }else{
      this.libButtonHF = false;
      this.lib_pur_title = false;
    }
    }else{
      this.b_flag = false;
      if(this.req == 'lib'){
      this.libButtonHF = true;
      this.lib_pur_title = false;
    }else{
      this.libButtonHF = true;
      this.lib_pur_title = true;
    }
    }
  });
 }

 goBackFunction(back){
   if(back =='Library'){
     this._routes.navigate(['/library']);
   }else{
     this._routes.navigate(['/basic']);
   }
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
     console.log(options);
     this._service.postRequestWithObservable(options)
        .subscribe(res => {
          console.log(res);
       if(res.response == "true"){
         alert("Content Added to Library");
         //this._routes.refresh();
       }else{
         alert("Sorry: Something went Wrong, Try again later. :|")
       }
       console.log("data >> "+res);
     });
 }

   getPackInfo(){
       this.checkIfPur(this.pkg_id);
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
            if(res.response == 'true'){

              this.author_name = res.result.author_name;
              this.packName = res.result.packName;
              this.packDescription = res.result.description;
              this.price = res.result.price ;
            }else {
              alert(res.errMessage);
            }

       });
     }

}
