import { Component, OnInit } from '@angular/core';
import { KnowelApiService } from '../_service/knowel-api.service';
import { Router } from '@angular/router';
import { AppRoutingModule } from '../app-routing/app-routing.module';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})

export class UserHomeComponent implements OnInit {

profile_noti:any;
pro_acriveClass:any;
lib_activeClass:any;
store_activeClass:any;
//profile_ec_noti_flag:any;
profile_ec_noti_flag = false;

constructor(private _routes: Router,private _service: KnowelApiService){ }

  ngOnInit() {
    //let id = this._service.getEmail();
    //console.log(id);
    //let token = localStorage.getItem('token');

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
         this.profile_noti = "!";
         this.pro_acriveClass = "_nav_tile_selected";
         this.lib_activeClass = "";
         this.store_activeClass = "";
         this.profile_ec_noti_flag = true;
         this._routes.navigate(['/userpro']);
        }else{
         this.profile_noti = "";
         this.pro_acriveClass = "";
         this.lib_activeClass = "_nav_tile_selected";
         this.store_activeClass = "";
         this.profile_ec_noti_flag = false;
         this._routes.navigate(['/library']);
        }
    });
  }

    navlib(){
      this._routes.navigate(['/library']);
    }

    navpro(){
      this._routes.navigate(['/userpro']);
    }

     nav(present){
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

}
