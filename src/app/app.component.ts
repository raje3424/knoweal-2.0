
import { Component } from '@angular/core';
import { KnowelApiService } from './_service/knowel-api.service';
import { Router } from '@angular/router';
import { AppRoutingModule } from './app-routing/app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'knowel';
  errorMessage: any;
  logSi: string;
  //logSiFlag:any;
  logSiFlag = 'login';
  email:any;
  pass:any;
  data:any;
  logEmail:string;
  logPass:string;
  loginMsg:string;

  constructor(private _service: KnowelApiService, private _routes: Router){}

    // let value = {
    //         "v_class": "palika",
    //         "v_function": "login",
    //         "value": { // make this work in php >> ! <<
    //           "email": 'abc',
    //           "password": 'abcd'
    //         }
    //    };
   //  this._service.postRequestWithObservable(value)
   //   .subscribe( res => {
   //     console.log(res);
   //
   //     if(res.response == 'true'){
   //       alert("true");
   //     }
   //   },
   //     error => this.errorMessage = <any>error);
   // }
   // 
   // logSiFunc(logSi){
   //   if(logSi == 'register'){
   //     this.logSiFlag = "signup";
   //     console.log('signup');
   //   }else if(logSi == "login"){
   //     this.logSiFlag = "login";
   //     console.log('login');
   //   }
   // }


  }
   //
   // ngOnInit(): void {
   //     this.http.get('https://api.github.com/users/seeschweiler').subscribe(data => {
   //       console.log(data);
   //     });
   //   }

//
// loginFunc(logEmail,logPass){
//   //alert("login function");
//
//   console.log("email : "+this.email+" | pass : "+this.pass);
//       var options = {
//         "v_class": "palika",
//         "v_function": "login",
//         "value": { // make this work in php >> ! <<
//           "email": this.email.trim(),
//           "password": this.pass.trim()
//           }
//         };
//       this.http.post('/_req/scripts/php/interface.php', options).success(data=>{
//         console.log(data);
// 				if(data == "true"){
//           loginMsg = "Loading profile...";
//           logInmsg_class = "_info_msg";
// 					function setTimeout(){
//             var options = {
//               "v_class": "basic",
//               "v_function": "getUserId"
//             };
//             this.http.post('/_req/scripts/php/interface.php', options).success((data=>){
//               if(data.trim() != ""){
//                 var options = {
//                   "v_class": "basic",
//                   "v_function": "setIDToSession",
//                   "value": data.trim()
//                 )};
//                 this.http.post('/_req/scripts/php/interface.php', options).success((data=>){
//                   if(data == "true" || data == "xfalse"){
//                     window.location.href("/app/user-home/user-home.component.html");
//                   }else{
//                     loginMsg = "Profile Error ... Login again...";
//                     logInmsg_class = "_error_msg";
//                     username_io = "";
//                     password_io = "";
//                   }
//                 });
//               }else{
//                 window.location.assign("/app/user-home/user-home.component.html#/profile");
//               }
//             };
// 					};
// 				}else {
// 					///console.log("login >> "+data);
//           if(data.trim() == "ufalse"){
//             loginMsg = "Unregistered Email...";
//             logInmsg_class = "_error_msg";
//             username_io = "";
//             password_io = "";
//           }else  if(data.trim() == "pfalse"){
//             loginMsg = "Username Password Missmatch...";
//             logInmsg_class = "_warning_msg";
//             username_io = "";
//             password_io = "";
//           }else{
//             loginMsg = "Something is wrong.. Please try again...";
//             logInmsg_class = "_red_msg";
//             username_io = "";
//             password_io = "";
//           }
// 				}
// 			});
//   }
// }
