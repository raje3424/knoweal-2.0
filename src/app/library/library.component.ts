import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KnowelApiService } from '../_service/knowel-api.service';
import { AppRoutingModule } from '../app-routing/app-routing.module';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})

export class LibraryComponent implements OnInit {

pur_conSelect = '_contentSwitchPanel';
purGFlag = false;
ownGFlag = false;
poFlag:any;create_ovp_flag:any;
own_conSelect:string;
profile_noti:string;pro_acriveClass:string;lib_activeClass:string;
boughtPackMsg:any;pur_pkgData:any;
createPackMsg:any;own_pkgData:any;
idAsEmail;
constructor(private _routes: Router,private _service: KnowelApiService){ }

  ngOnInit() {
      this.idAsEmail = this._service.canActivate();
    //  this._service.postRequestWithObservable(Authorization).subscribe(res=>{
    //   console.log(res);
    // });
  }

  createPackage(){
    let options = {
      "v_class": "basic",
      "v_function": "getIDFromSession",
      "value":{
        "email":this.idAsEmail
      }
    };  
    console.log(options);
    this._service.postRequestWithObservable(options)
       .subscribe( res => {
      console.log(res);
      if(res == 1){
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
      "v_function": "displayPurchasePackage"
    };
    this._service.postRequestWithObservable(options)
       .subscribe( res => {
      console.log(res);
      if(res == "" || res == "false"){
        this.boughtPackMsg = false;
      }else{
        this.pur_pkgData = res;
      }
    });
  }


  getAllOwnPacks(){
    let options = {
      "v_class": "library",
      "v_function": "viewOwnPackages"
    };
    this._service.postRequestWithObservable(options)
       .subscribe( res => {
      console.log(res);
      if(res == "" || res == "false"){
        this.createPackMsg = false;
      }else{
        this.own_pkgData = res;
      }
    });
  }

  viewPurPack(){
      this._routes.navigate(['/ownPackageViewer']);
  }

  solveThePack(){
      this._routes.navigate(['/pur_package_viewer']);
  }

  viewOwnPackages(){
      this._routes.navigate(['/pur_package_viewer']);
  }

  navlib(){
    this._routes.navigate(['/library']);
  }

  navpro(){
    this._routes.navigate(['/userpro']);
  }

  //logout function
  logOut(){
    this._service.logout();
    this._routes.navigate(['/cfindex']);
  }
}
