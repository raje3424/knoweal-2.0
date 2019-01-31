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
    idAsEmail;

  constructor(private _routes: Router,private _service: KnowelApiService){ }

  ngOnInit() {
     console.log(localStorage.getItem('token'));
    //  this.idAsEmail = this._service.getEmail();

      let options = {
        "v_class": "basic",
        "v_function": "getUserInstanceStatus",
        "value": {
          "token": localStorage.getItem('token')
          }
        };
        console.log(options);
        this._service.postRequestWithObservable(options)
           .subscribe( res => {
          console.log(res.response);

          if (res.response == "true" && res.infoFlag == 0) {
            this.profile_noti = "!";
            this.pro_acriveClass = "_active";
            this.buttonOperation = "Add Info";
            this.lib_activeClass = "";
            this._routes.navigate(['/userpro']);
            let options = {
              "v_class": "basic",
              "v_function": "sessionEmailGetter",
              "value": {
                "token": localStorage.getItem('token')
                }
            };
            console.log(options);
            this._service.postRequestWithObservable(options)
               .subscribe( res => {
                 console.log(res.response);
                 //console.log(res.email);
              if(res.response != ""){
                this.email = res.email;
                this.email_flag = "true";
                this.buttonOperation = "Add Info";
                this.buttonClass = "_blue_back";
              }else{
                alert("Something is Wrong" +res);
              }
             });
          }else{
            let options = {
              "v_class": "basic",
              "v_function": "sessionEmailGetter",
              "value": {
                "token": localStorage.getItem('token')
                }
            };
            this._service.postRequestWithObservable(options)
               .subscribe( res => {
                 console.log(res);
              if(res.response == "true"){
                this.email = res.email;
                this.email_flag = "true";
                this.buttonClass = "_orange_back";
                this.buttonOperation = "Edit";
                this.edit_flag = "true";
                let options = {
                  "v_class": "profile",
                  "v_function": "userProfileGetter",
                  "value" :{
                  "token": localStorage.getItem('token')
                  }
                };
                console.log(options);
                this._service.postRequestWithObservable(options)
                   .subscribe( res => {
                     // console.log(res.fullName);
                     // console.log(res.sex);
                     // console.log(res.dob);
                  this.fullName = res.fullName;
                  if(this.email != res.email){
                    // destroy session and logout
                  }
                  this.gender = res.sex;
                  let dateArray = res.dob.split("/");
                  this.dd = dateArray[0];
                  this.mm = dateArray[1];
                  this.yy = dateArray[2];
                });
              }else{
                alert("Something is Wrong " +res);
              }
            });
          }
      });
  }

  //logout function
  logOut(){
    this._service.logout();
    this._routes.navigate(['/cfindex']);
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
  
  saupData(){
    console.log(this.buttonOperation);

    if(this.buttonOperation == 'Add Info'){
      if((this.fullName == "" || this.fullName == undefined) || (this.email == "" || this.email == undefined) || (this.gender == "" || this.gender == undefined) || (this.dd == "" || this.dd == undefined) || (this.mm == "" || this.mm == undefined) || (this.yy == "" || this.yy == undefined)){
        console.log("something is blank");
        //console.log(this.fullName);
        }else{
        let options = {
          "v_class": "profile",
          "v_function": "userProfileAdder",
          "value":{
            "token": localStorage.getItem('token'),
            "fullName": this.fullName,
            "email": this.email,
            "dob": this.dd+"/"+this.mm+"/"+this.yy,
            "gender": this.gender
          }
        };
        console.log(options);
        this._service.postRequestWithObservable(options)
         .subscribe( res => {
           console.log(res.response);
           if(res.response == "true"){
            let options = {
              "v_class": "basic",
              "v_function": "updateInstanceToO",
              "value":{
                "token": localStorage.getItem('token')
              }
            };
            console.log(options);
            this._service.postRequestWithObservable(options)
             .subscribe( res => {
               console.log(res.result);
               if(res.result == 1){
                this.buttonOperation = "Edit";
                this.buttonClass = "_orange_back";
                this.edit_flag = "true";
                this._routes.navigate(['/userhome']);
                }else{
                alert("There Seems some error in updating profile.. Please Try again");
                }
              });
            }
          });
        }
    }else if(this.buttonOperation == "Edit"){
      this.buttonClass = "_green_back";
      this.buttonOperation = "Save";
      this.edit_flag = "false";
    }else if(this.buttonOperation == "Save"){
      if(this.fullName == "" || this.email == "" || this.gender == "" || this.dd == "" || this.mm == "" || this.yy == ""){
        console.log("something is blank");
      }else{
        let options = {
          "v_class": "profile",
          "v_function": "userProfileUpdater",
          "value":{
            "token": localStorage.getItem('token'),
            "fullName": this.fullName,
            "dob": this.dd+"/"+this.mm+"/"+this.yy,
            "gender": this.gender
          }
        };
        console.log(options);
        this._service.postRequestWithObservable(options)
         .subscribe( res => {
           console.log(res);
           if(res.response == 'true'){
            this.buttonClass = "_orange_back";
            this.buttonOperation = "Edit";

            this.edit_flag = "true";
          }else{
            // give error >>
          }
        });
      }
    }else{
      console.log(">> not a val this.idAsEmail arg for performing operation << ");
    }
   }
 }
