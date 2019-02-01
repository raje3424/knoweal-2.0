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
b_flag;viewPort= "12";viewIconF;viewMode;

 constructor(private _routes: Router,private _service: KnowelApiService){ }

ngOnInit() {
  this.getAllPacks();
  console.log(this.pkgData);

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
                      console.log(this.pkgData[0]);
                      this.boughtPackMsg = true;
                      this.buyHide = true;

                      // this.viewMode = "6";
                      // var options = {
                      //   "v_class": "library",
                      //   "v_function": "checkIfPur",
                      //   "value":{
                      //     "package_id": this.pkgData.package_id,
                      //     "token": localStorage.getItem('token')
                      //   }
                      // };
                      // console.log(options);
                      // this._service.postRequestWithObservable(options)
                      //    .subscribe( res => {
                      //      console.log(res);
                      //   if(res.response == "false"){
                      //     this.viewMode = "6";
                      //     this.buyHide = false;
                      //   }else{
                      //     this.viewMode = "12";
                      //     this.buyHide = true;
                      //   }
                      // });
                      // this.buyHide=true;
                      // this.boughtPackMsg = false;
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

      viewChanger(){
          // changes view of Package List
          if(this.viewPort != '12'){
            this.viewPort = '12';
            this.viewIconF = !this.viewIconF;
          }else{
            this.viewPort = '6';
            this.viewIconF = !this.viewIconF;
          }
        };


       getPackage(pack_id){
        this.checkIfPur_Su(pack_id);
        if(this.makePur(pack_id)){
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
           "pkg_id":pack_id,
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
          console.log(pack_id);
          let options = {
            "v_class": "library",
            "v_function": "checkIfPur",
            "value":{
              "pkg_id":pack_id,
              "token": localStorage.getItem('token')
            }
          };
          console.log(options);
          this._service.postRequestWithObservable(options)
             .subscribe( res => {
            if(res.response == "true"){
              alert("Sorry Can't be Baught");
             console.log("cant be "+res.tans_id+ " ::");
             this.buyHide= true;
            }else{
                alert("Can be Baught ");
                console.log("can be bought "+res.tans_id+" ::");
                this.makePur(pack_id);
            }
          });
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
