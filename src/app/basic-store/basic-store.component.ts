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
boughtPackMsg;pkgData;


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
        this._service.postRequestWithObservable(options)
           .subscribe( res => {
          console.log(res.result);
                    if(res.response == "" || res.response == "false"){
                      this.boughtPackMsg = false;
                    }else{
                      this.pkgData = res;
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
//
//       function getPackage(pkg_id){
//         checkIfPur_Su(pkg_id);
//
//          makePur(pack_id){
//           console.log("into make pur");
//           var options = {
//             "v_class": "library",
//             "v_function": "addPurchasePackage",
//             "value": pkg_id
//           };
//           this.http.post('/_req/scripts/php/interface.php', options).success((data=>){
//             if(data.trim() == "true"){
//               // take out the realod and add some message ;
//               window.location.reload();
//             }else{
//               alert("Sorry Could not add it library now. Try again. :| ");
//             }
//           });
//         };
//
//         checkIfPur_Su(pack_id){
//           var options = {
//             "v_class": "library",
//             "v_function": "checkIfPur",
//             "value":{
//               "package_id": pkg_id
//             }
//           };
//           this.http.post('/_req/scripts/php/interface.php', options).success((data=>){
//             if(data.trim() == false){
//               console.log("can be bought "+data+" ::");
//               makePur(pack_id);
//             }else{
//               console.log("cant be "+data+ " ::");
//             }
//           });
//         };
//       };
//
//       function checkIfPur(pkg_id){
//         var flag;
//         var options = {
//           "v_class": "library",
//           "v_function": "checkIfPur",
//           "value":{
//             "package_id": pkg_id
//           }
//         };
//         this.http.post('/_req/scripts/php/interface.php', options).success((data=>){
//           if(data.trim() == false){
//             flag = true;
//             b_flag = true;
//             console.log("can be bought"+flag);
//           }else{
//             flag = false;
//             b_flag = false;
//             console.log("cant be "+flag);
//           }
//         });
//       //  return flag;
//       };
//
//       viewPackages(pkg_id){
//         window.location.assign("#/package_viewer/"+pkg_id);
//       }
//

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
