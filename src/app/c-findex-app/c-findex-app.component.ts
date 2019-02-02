import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { KnowelApiService } from '../_service/knowel-api.service';

@Component({
  selector: 'app-c-findex-app',
  templateUrl: './c-findex-app.component.html',
  styleUrls: ['./c-findex-app.component.css']
})

export class CFIndexAppComponent implements OnInit {
 data: Object;
response:any;
  errorMessage: any;
  logSi: string;
  logSiFlag = 'login';
  email:any;
  pass:any;

  logEmail:string;
  logPass:string;
  loginMsg:string;
  siEmail:string;
  siPass:string;
  siCoPass:string;
  signMsg:string;
  logInmsg_class:string;
  password_io:string;
  username_io:string;
  s_email_ioClass:string;
  s_pass_ioClass:string;
  email_jio:string;
  email_cnf_jio:string;
  pass_jio:string;
  pass_cnf_jio:string;
  signmsg_class:string;

  loading = false;
  returnUrl: string;
  error = '';

  emailPattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private _routes: Router, private activateRoute: ActivatedRoute, private _service: KnowelApiService) { }

  ngOnInit() {
    // reset login status
    //this._service.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.activateRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  logSiFunc(logSi){
    console.log('In logSiFunc');
   if(logSi == 'register'){
     this.logSiFlag = "signup";
      this.logEmail = '';
      this.logPass = '';
      this.loginMsg = '';
   }else if(logSi == "login"){
     this.logSiFlag = "login";
      this.siEmail = '';
      this.siPass = '';
      this.siCoPass = '';
      this.signMsg = '';
   }
  }

  loginFunc(logEmail,logPass){
    console.log("email : "+logEmail+" | pass : "+logPass);
    if(this.logEmail && this.emailPattern.test(this.logEmail)){
      if(this.logPass){
        let options = {
          "v_class": "palika",
          "v_function": "login",
          "value": {
            "email": this.logEmail,
            "password": this.logPass
          }
        };
        console.log(options);
        this._service.postRequestWithObservable(options)
          .subscribe( res => {
            console.log(res);
              if(res.response == 'ufalse'){
                this.loginMsg = res.errMessage;
                this.logInmsg_class = "_error_msg";
              }else if(res.response == 'pfalse'){
                this.loginMsg = res.errMessage;
                this.logInmsg_class = "_error_msg";
              }else if(res.response == 'true'){
                  localStorage.setItem('token', JSON.stringify(res.token));
                  this.loginMsg = "Loading profile...";
                  this.logInmsg_class = "_info_msg";
                  setTimeout(function(){
                  },"10000");
                  this._routes.navigate(['/userhome']);
              }else {
                this._routes.navigate(['/cfindex']);
              }
            });
          }else{
            this.logInmsg_class = "_error_msg"
            this.loginMsg = "Password is blank!";
          }
        }else{
          this.logInmsg_class = "_error_msg"
          this.loginMsg = "Enter valid email!";
        }
    }

  register(siEmail, siPass, siCoPass){
    if(this.siEmail && this.emailPattern.test(this.siEmail)){
      if((this.siPass!="" && this.siPass != undefined) || (this.siCoPass!="" && this.siCoPass != undefined)){
        if(this.siPass == this.siCoPass){
          let options = {
            "v_class": "palika",
            "v_function": "signup",
            "value": {
              "email": this.siEmail,
              "password": this.siPass
              }
            };
          console.log("Signup options : ", options);
            this._service.postRequestWithObservable(options)
            .subscribe( res => {
               // this.data = res.json();
              console.log(res.response);
              console.log(res.token);
              if(res.response == 'true'){
                //localStorage.setItem('token', JSON.stringify(res.token));
                this.s_email_ioClass = "";
                this.s_pass_ioClass = "";
                this.siEmail = "";
                this.siPass = "";
                this.siCoPass = "";
                // this.loginMsg = "Preparing profile...";
                this.signmsg_class = "_success_msg";
                alert('Registration successfull, Login now!!!');
                this.logSiFunc("login");
              }else{
                if(res.response == "rfalse"){
                  this.s_email_ioClass = "_error_input";
                  this.signMsg = res.errMessage;
                  this.signmsg_class = "_error_msg";
                }else if(res.response == "efalse"){
                  this.s_email_ioClass = "_error_input";
                  this.signMsg = res.errMessage;
                  this.signmsg_class = "_error_msg";
                }else if(res.response == "bfalse"){
                  this.s_email_ioClass = "_error_input";
                  this.signMsg = res.errMessage;
                  this.signmsg_class = "_error_msg";
                }else{
                  this.s_email_ioClass = "_error_input";
                  this.s_pass_ioClass = "_error_input";
                  this.email_jio = "";
                  this.email_cnf_jio = "";
                  this.pass_jio = "";
                  this.pass_cnf_jio = "";
                  this.signMsg = "Error, please register again :| ";
                  this.signmsg_class = "_warning_msg";
                }
            }
          });
          //this._routes.navigate(['/userpro']);
        }else{
          this.signMsg = "Password mismatch :( ";
          this.pass_jio = "";
          this.pass_cnf_jio = "";
          this.s_pass_ioClass = "_warning_input";
          this.signmsg_class = "_warning_msg";
        }
          // this.signMsg = "password do not match";
      }else{
        console.log("Password is Blank !!! ");
        this.signMsg = "Enter Password :| ";
        this.s_pass_ioClass = "_error_input";
        this.signmsg_class = "_warning_msg";
      }
    }else{
      console.log("Something is Blank !!! ");
      this.signMsg = "Enter valid email :| ";
      this.s_pass_ioClass = "_error_input";
      this.signmsg_class = "_warning_msg";
    }
  }

}
