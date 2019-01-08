import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-basic-store',
  templateUrl: './basic-store.component.html',
  styleUrls: ['./basic-store.component.css']
})
export class BasicStoreComponent implements OnInit {
//
 constructor(private http: HttpClient){

  }

ngOnInit() {
}
}
//

//
//       getAllPacks();
//       viewPort = "12";
//       b_flag;
//
//       viewChanger(){
//         // changes view of Package List
//         if(viewPort != '12'){
//           viewPort = '12';
//           viewIconF = !viewIconF;
//         }else{
//           viewPort = '6';
//           viewIconF = !viewIconF;
//         }
//       };
//
//       getAllPacks(){
//         var options = {
//           "v_class": "library",
//           "v_function": "viewAllPackages"
//         };
//         this.http.post('/_req/scripts/php/interface.php', options).success((data=>){
//           if(data.trim() == "" || data.trim() == "false"){
//             boughtPackMsg = false;
//           }else{
//             pkgData = data;
//           }
//         });
//       }
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
//       createPackage(){
//         var options = {
//           "v_class": "basic",
//           "v_function": "getIDFromSession"
//         };
//         this.http.post('/_req/scripts/php/interface.php', options).success((data=>){
//           if(data.trim() != ""){
//             window.location.assign("#/createPackage");
//           }else{
//             // create an alert to complete the profile >> ! <<
//             profile_noti = "!";
//             pro_acriveClass = "_active";
//             lib_activeClass = "";
//             window.location.assign("#/profile");
//           }
//         });
//       };
//     }]);
//
//       // viewMode = "6";
//       // var options = {
//       //   "v_class": "library",
//       //   "v_function": "checkIfPur",
//       //   "value":{
//       //     "package_id": pkgs.package_id
//       //   }
//       this.http.post('/_req/scripts/php/interface.php', options).success((data=>){
//         if(data.trim() == false){
//           viewMode = "6";
//           buyHide = false;
//         }else{
//           viewMode = "12";
//           buyHide = true;
//         }
//       });
//     }]);
//   }
// }
