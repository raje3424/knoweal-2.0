import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KnowelApiService } from '../_service/knowel-api.service';
import { AppRoutingModule } from '../app-routing/app-routing.module';


@Component({
  selector: 'app-basic-store',
  templateUrl: './basic-store.component.html',
  styleUrls: ['./basic-store.component.css']
})
export class BasicStoreComponent implements OnInit {
profile_noti;pro_acriveClass;lib_activeClass;
boughtPackMsg;pkgData:any=[];
buyHide;packID;
b_flag;
 constructor(private _routes: Router,private _service: KnowelApiService){ }

ngOnInit() {
  this.getAllPacks();
}

      getAllPacks(){
        var options = {
          "v_class": "library",
          "v_function": "viewAllPackages",
          "value" :{
              "token": localStorage.getItem('token')
          }
        };
        console.log(options);
        this._service.postRequestWithObservable(options)
           .subscribe( res => {
          console.log(res.result);
                    if(res.response == "" || res.response == "false"){
                      this.boughtPackMsg = false;
                    }else{
                      this.pkgData = res.result;
                      this.buyHide=true;
                    }
                  });
      }

      goBackFunction(){
       this._routes.navigate(['/library']);
      }

      navlib(){
        this._routes.navigate(['/library']);
      }

      navpro(){
        this._routes.navigate(['/userpro']);
      }

      navstream(){
        this._routes.navigate(['/basic']);
      }


       getPackage(pack_id){
        this.checkIfPur_Su(this.packID);
        if(this.makePur(this.packID)){
          this.ngOnInit();
        }else{
              alert("Sorry Could not add it library now. Try again. :| ");
        }
      }

      makePur(pack_id){
       console.log("into make pur");
       let options = {
         "v_class": "library",
         "v_function": "addPurchasePackage",
         "value":{
           "pkg_id":this.packID,
           "token": localStorage.getItem('token')
         }
       };
       this._service.postRequestWithObservable(options)
          .subscribe( res => {
         if(res.response == "true"){
           // take out the realod and add some message ;
           this.ngOnInit();
         //  window.location.reload();
         }
       });
     }


        checkIfPur_Su(pack_id){
          let options = {
            "v_class": "library",
            "v_function": "checkIfPur",
            "value":{
              "package_id":this.packID,
              "token": localStorage.getItem('token')
            }
          };
          this._service.postRequestWithObservable(options)
             .subscribe( res => {
            if(res.response == "false"){
              console.log("can be bought "+res+" ::");
              //this.makePur(pack_id);
            }else{
              console.log("cant be "+res+ " ::");
            }
          });
        }



       checkIfPur(pkg_id){
        var flag;
        var options = {
          "v_class": "library",
          "v_function": "checkIfPur",
          "value":{
            "package_id":this.packID,
            "token": localStorage.getItem('token')
          }
        };
        this._service.postRequestWithObservable(options)
           .subscribe( res => {
          if(res.response == "false"){
            flag = true;
            this.b_flag = true;
            console.log("can be bought"+flag);
          }else{
            flag = false;
            this.b_flag = false;
            console.log("cant be "+flag);
          }
        });
       //return flag;
      }

      viewPackages(id){
        this._routes.navigate(['/purpack'],{ queryParams: { id: id}});
      }

  logOut(){
    this._service.logout();
    this._routes.navigate(['/cfindex']);
  }

  createPackage(){
    let options = {
      "v_class": "basic",
      "v_function": "sessionEmailGetter",
      "value":{
        "token": localStorage.getItem('token')
      }
    };
    console.log(options);
    this._service.postRequestWithObservable(options)
       .subscribe( res => {
      console.log(res);
      if(res.response == 'true'){
        this._routes.navigate(['/packman']);
      }else{
        // create an alert to complete the profile >> ! <<
        this.profile_noti = "!";
        this.pro_acriveClass = "_active";
        this.lib_activeClass = "";
        this._routes.navigate(['/userpro']);
      }
    });
  }

}
