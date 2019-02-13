import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KnowelApiService } from '../_service/knowel-api.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})

export class LibraryComponent implements OnInit {

pro_acriveClass:any;
lib_activeClass:any;
store_activeClass:any;
pur_conSelect = '_contentSwitchPanel';
purGFlag = false;
ownGFlag = false;
poFlag:any;create_ovp_flag:any;
own_conSelect:string;
profile_noti:string;
boughtPackMsg=true;
pur_pkgData:any = [];
createPackMsg= true;
own_pkgData:any = [];
idAsEmail;solveflag;

constructor(private _routes: Router,private _service: KnowelApiService){ }

  ngOnInit() {
    var options = {
      "v_class": "basic",
      "v_function": "getUserInstanceStatus",
      "value": {
        "token": localStorage.getItem('token')
        }
      };
      console.log(options);
      this._service.postRequestWithObservable(options)
         .subscribe(res => {
           console.log(res);
        if (res.response == "true" && res.infoFlag == "0") {
          this._routes.navigate(['/userpro']);
        }else{
            this.nav('pur');
        }
      //this.idAsEmail = this._service.canActivate();
      this.lib_activeClass = '_nav_tile_selected';
  });
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


    nav(cho){
    if(cho == "pur"){
      this.pur_conSelect = "_contentSwitchPanel_Select";
      this.own_conSelect = "";
      if(this.poFlag != true){
        this.poFlag = !this.poFlag;
      }
    }else if(cho == "own"){
      this.pur_conSelect = "";
      this.own_conSelect = "_contentSwitchPanel_Select";
      this.create_ovp_flag = false;
      if(this.poFlag == true){
        this.poFlag = !this.poFlag;
      }
    }

    if(this.pur_conSelect == "_contentSwitchPanel_Select"){
      if(this.purGFlag == false){
        this.getAllPurchasedPacks();
        this.purGFlag = true;
      }
    }else if (this.own_conSelect == "_contentSwitchPanel_Select") {
      if(this.ownGFlag == false){
        this.getAllOwnPacks();
        this.ownGFlag = true;
      }
    }
  }

  getAllPurchasedPacks(){
    let options = {
      "v_class": "library",
      "v_function": "displayPurchasePackage",
      "value" :{
          "token": localStorage.getItem('token')
      }
    };
    this._service.postRequestWithObservable(options)
       .subscribe( res => {
      console.log(res);
      console.log(res.result);
      if(res.response == "true"){
        if(this.arrayLength(res.result) != 0){
          this.boughtPackMsg = false;
          this.pur_pkgData = res.result;
        }else {
          //  alert('No any purchased package!');
            this.boughtPackMsg = true;
        }
      }else{
        alert(res.errMessage);
      }
    });
  }


  getAllOwnPacks(){
    let options = {
      "v_class": "library",
      "v_function": "viewOwnPackages",
      "value":{
          "token": localStorage.getItem('token')
      }
    };
    this._service.postRequestWithObservable(options)
       .subscribe(res => {
      console.log(res);
      console.log(res.result);
      if(res.response == "true"){
        if(this.arrayLength(res.result) != 0){
        this.createPackMsg = false;
          this.own_pkgData = res.result;
      }else{
        this.createPackMsg = true;
      }
      }else{
        alert(res.errMessage);
      }
    });
  }

  viewPurPack(id){
    this._routes.navigate(['/packview'],{queryParams: {id: id,req:'lib'}});
  }

  solveThePack(id){
      this._routes.navigate(['/purpack'],{queryParams: {id: id}});
    //this._routes.navigate(['/ownpack'],{queryParams: {id: id}});
  }

  viewOwnPackages(id){
      this._routes.navigate(['/ownpack'],{queryParams: {id: id}});
      //this._routes.navigate(['/purpack'],{queryParams: {id: id}});
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

  navMain(present){
    switch (present) {
          case 'lib_activeClass':
              this.pro_acriveClass = "";
              this.lib_activeClass = "_nav_tile_selected";
              this.store_activeClass = "";
            break;
          case 'pro_acriveClass':
            this.pro_acriveClass = "_nav_tile_selected";
            this.lib_activeClass = "";
            this.store_activeClass = "";
            break;
          case 'store_activeClass':
            this.pro_acriveClass = "";
            this.lib_activeClass = "";
            this.store_activeClass = "_nav_tile_selected";
            break;
          default:
            this.pro_acriveClass = "";
            this.lib_activeClass = "_nav_tile_selected";
            this.store_activeClass = "";
        }
  }

  //logout function
  logOut(){
    this._service.logout();
    this._routes.navigate(['/cfindex']);
  }

  arrayLength = function(obj): any {
   var len = 0, key;
   for (key in obj) {
     if (obj.hasOwnProperty(key)) len++;
   }
   return len;
 };

}
