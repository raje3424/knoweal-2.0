import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KnowelApiService } from '../_service/knowel-api.service';
import { AppRoutingModule } from '../app-routing/app-routing.module';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {

    buttonOperation:string;
    fullName:string;
    gender:string;
    email:any;
    dd:any;
    mm:any;
    yy:any;
    buttonClass:any;pro_acriveClass:string;lib_activeClass:string;
    edit_flag:any;profile_noti:string;email_flag:any;

  constructor(private _routes: Router,private _service: KnowelApiService){ }

  ngOnInit() {
     //console.log("ngOnit executed");

      let options = {
        "v_class": "basic",
        "v_function": "getUserInstanceStatus"
        };
        console.log(options);
        this._service.postRequestWithObservable(options)
           .subscribe( res => {
          console.log(res);
        });
      //     if (res == 'false') {
      //       this.profile_noti = "!";
      //       this.pro_acriveClass = "_active";
      //       this.lib_activeClass = "";
      //       //this._routes.navigate(['#/profile']);
      //       this._routes.navigate(['/userpro']);
      //       let options = {
      //         "v_class": "basic",
      //         "v_function": "sessionEmailGetter"
      //       };
      //       console.log(options);
      //       this._service.postRequestWithObservable(options)
      //          .subscribe( res => {
      //            console.log(res);
      //         if(res != ""){
      //           this.email = res;
      //           this.email_flag = "true";
      //           this.buttonOperation = "Add Info";
      //           this.buttonClass = "_blue_back";
      //         }else{
      //           alert("Something is Wrong" +res);
      //         }
      //        });
      //     }else{
      //       let options = {
      //         "v_class": "basic",
      //         "v_function": "sessionEmailGetter"
      //       }
      //       this._service.postRequestWithObservable(options)
      //          .subscribe( res => {
      //            console.log(res);
      //         if(res = "true"){
      //           this.email = res;
      //           this.email_flag = "true";
      //           this.buttonClass = "_orange_back";
      //           this.buttonOperation = "Edit";
      //           this.edit_flag = "true";
      //           let options = {
      //             "v_class": "profile",
      //             "v_function": "userProfileGetter"
      //           };
      //           this._service.postRequestWithObservable(options)
      //              .subscribe( res => {
      //                console.log(res);
      //             this.fullName = res['full_name'];
      //             if(this.email != res['email']){
      //               // destroy session and logout
      //             }
      //             this.gender = res['sex'];
      //             let dateArray = res['dob'].split("/");
      //             this.dd = dateArray[0];
      //             this.mm = dateArray[1];
      //             this.yy = dateArray[2];
      //           });
      //         }else{
      //           alert("Something is Wrong " +res);
      //         }
      //       });
      //     }
      // });
  }

  saupData(){
    console.log("saupData called");
    console.log(this.buttonOperation);

    if(this.buttonOperation == "Add Info"){
      if(this.fullName == "" || this.email == "" || this.gender == "" || this.dd == "" || this.mm == "" || this.yy == ""){
        console.log("something is blank");
        console.log(this.fullName);
      // }else{
      //   let options = {
      //     "v_class": "profile",
      //     "v_function": "userProfileAdder",
      //     "value":{
      //       "fullName": this.fullName,
      //       "email": this.email,
      //       "dob": this.dd+"/"+this.mm+"/"+this.yy,
      //       "gender": this.gender
      //     }
      //   };
      //   this._service.postRequestWithObservable(options)
      //    .subscribe( res => {
      //      console.log(res);
      //      if(res == 'true'){
      //       let options = {
      //         "v_class": "basic",
      //         "v_function": "updateInstanceToO"
      //       };
      //       this._service.postRequestWithObservable(options)
      //        .subscribe( res => {
      //          console.log(res);
      //          if(res == 1){
      //           this.buttonOperation = "Edit";
      //           this.buttonClass = "_orange_back";
      //           this.edit_flag = "true";
      //           // get the user id and set it to session >>
      //           let options = {
      //             "v_class": "basic",
      //             "v_function": "getUserId"
      //           };
      //           this._service.postRequestWithObservable(options)
      //            .subscribe( res => {
      //              console.log(res);
      //              if(res != ""){
      //               var options = {
      //                 "v_class": "basic",
      //                 "v_function": "setIDToSession",
      //                 "value": res
      //               };
      //               this._service.postRequestWithObservable(options)
      //                .subscribe( res => {
      //                  console.log(res);
      //                  if(res == 'true'){
      //                   this._routes.navigate(['/userhome']);
      //                 }else{
      //                   alert("There Seems some error in updating profile.. Please Try again");
      //                 }
      //               });
      //             }
      //           });
      //         }
      //       });
      //     }else{
      //       // error
      //     }
      //   });
      //   //console.log("it's add info ");
      // }
   //  }else if(this.buttonOperation == "Edit"){
   //    this.buttonClass = "_green_back";
   //    this.buttonOperation = "Save";
   //    this.edit_flag = "";
   //  }else if(this.buttonOperation == "Save"){
   //    if(this.fullName == "" || this.email == "" || this.gender == "" || this.dd == "" || this.mm == "" || this.yy == ""){
   //      console.log("something is blank");
   //    }else{
   //      let options = {
   //        "v_class": "profile",
   //        "v_function": "userProfileUpdater",
   //        "value":{
   //          "fullName": this.fullName,
   //          "dob": this.dd+"/"+this.mm+"/"+this.yy,
   //          "gender": this.gender
   //        }
   //      };
   //      this._service.postRequestWithObservable(options)
   //       .subscribe( res => {
   //         console.log(res);
   //         if(res == 'true'){
   //          this.buttonClass = "_orange_back";
   //          this.buttonOperation = "Edit";
   //          this.edit_flag = "true";
   //        }else{
   //          // give error >>
   //        }
   //      });
   //    }
   //  }else{
   //    console.log(">> not a valid arg for performing operation << ");
    }
   }
 }
}
