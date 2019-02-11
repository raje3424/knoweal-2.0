import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KnowelApiService } from '../_service/knowel-api.service';
import { WindowService } from '../_service/window.service';


@Component({
  selector: 'app-basic-store',
  templateUrl: './basic-store.component.html',
  styleUrls: ['./basic-store.component.css']
})
export class BasicStoreComponent implements OnInit {
profile_noti;pro_acriveClass;lib_activeClass;
boughtPackMsg= true;
pkgData:any=[];
buyHide;packID;
b_flag;viewPort= "12";viewIconF;viewMode;


private dataToSendToRazorPay = {
  "id":"",
  "key": "",
  "amount": "",
  "name": "",
  "description": "",
  "image": "/assets/_req/fonts_images/images/landin_page/vidaa_logo.PNG",
  "prefill": {
      "name": "",
      "email": ""
  },
  "theme": {
      "color": "#2AC671"
  }
};

protected rzp1:any;

 constructor(private _routes: Router,private _service: KnowelApiService, private windowRef: WindowService){ }

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
        this.getAllPacks();
        //console.log(this.pkgData);
      }
    });
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
    //console.log(res.result);
        if(res.response == "" || res.response == "false"){
          this.boughtPackMsg = true;
        }else{
          this.pkgData = res.result;
          // console.log(this.pkgData[0].package_id);
          // console.log(this.pkgData.length);
          for(let i=0;i<this.pkgData.length;i++)
          {
            //console.log(this.pkgData[i].package_id);
            var options = {
              "v_class": "library",
              "v_function": "checkIfPur",
              "value":{
                "package_id": this.pkgData[i].package_id,
                "token": localStorage.getItem('token')
              }
            };
            console.log(options);
            this._service.postRequestWithObservable(options)
                .subscribe( res => {
                  console.log(res);
                  console.log(res.result);
              if(res.response == 'true'){
                  if(this.arrayLength(res.result) != 0){
                    this.boughtPackMsg = false;
                    this.buyHide = false;
                  }
                  else{
                    this.boughtPackMsg = true;
                  }
              }else{
                alert(res.errMessage);
                  this.buyHide = true;
              }
            });
          }
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

      //  getPackage(pack_id){
      //     this.makePur(pack_id);
      //     this.ngOnInit();
      // }

    buyByRazorPay(pack_id){
      let options = {
        "v_class": "library",
        "v_function": "getPackageInfo",
        "value" :{
            "package_id" : pack_id,
            "token": localStorage.getItem('token')
        }
      }
      console.log(options);
      this._service.postRequestWithObservable(options)
          .subscribe( res => {
            if(res.response == 'true'){
              let amt = res.result['pack_price'];
              let name = res.result['package_name'];
              let desc = res.result['description'];
              //console.log(amt);
              //amt = amt * 100;
              //getting key of razorpay
              let options={
                "v_class":"config",
                "v_function":"setkey",
                "value" :{
                    "token": localStorage.getItem('token')
                }
              }
              console.log(options);
              this._service.postRequestWithObservable(options)
                  .subscribe( res => {
                    if(res.response == 'true'){
                      this.dataToSendToRazorPay.id = pack_id;
                      this.dataToSendToRazorPay.key = res.key;
                      this.dataToSendToRazorPay.amount = amt;
                      this.dataToSendToRazorPay.name = name;
                      this.dataToSendToRazorPay.description = desc;
                      this.dataToSendToRazorPay.prefill.name = "Rdm";
                      this.dataToSendToRazorPay.prefill.email = "rdm@rdm.com";
                      this.payWithRazorPay(this.dataToSendToRazorPay);
                    }
                  });
            }else{
              alert("didn't get package info");
            }
          });
    }

    payWithRazorPay(options){
      options.handler = ((response) => {
        console.log(response);
        console.log(options);
        let pay_id = response.razorpay_payment_id;
        let pack_id = options.id;
        // console.log(pack_id);
        // console.log(pay_id);
        this.payemntHandler(pay_id,pack_id);
     });
      this.rzp1 = new this.windowRef.nativeWindow.Razorpay(options);
      this.rzp1.open();
    }

    payemntHandler(razorpay_payment_id,pack_id){
      console.log('Payment... '+razorpay_payment_id);
      if (typeof razorpay_payment_id == 'undefined' || razorpay_payment_id < 1) {
        alert('Try after a while !');
      }else{
        this.makePur(pack_id,razorpay_payment_id);
        alert('Success !');
      }
    }

      makePur(pack_id,razorpay_payment_id){
       // console.log("into make pur");
       // console.log(razorpay_payment_id);
       let options = {
         "v_class": "library",
         "v_function": "addPurchasePackage",
         "value":{
           "pkg_id":pack_id,
           "payment_id":razorpay_payment_id,
           "token": localStorage.getItem('token')
         }
       };
       this._service.postRequestWithObservable(options)
          .subscribe( res => {
         if(res.response == "true"){
           alert("package baught");
         }else{
            alert("package baught failed");
         }
       });
     }


        checkIfPur_Su(pack_id){
          console.log(pack_id);
          let options = {
            "v_class": "library",
            "v_function": "checkIfPur",
            "value":{
              "package_id":pack_id,
              "token": localStorage.getItem('token')
            }
          };
          console.log(options);
          this._service.postRequestWithObservable(options)
             .subscribe( res => {
            if(res.response == "true"){
              alert("Sorry Can't be Baught");
             console.log("cant be "+res.tans_id+ " ::");
            // this.buyHide= true;
            }else{
                //this.buyHide= true;
                alert("Can be Baught ");
                console.log("can be bought "+res.tans_id+" ::");
                //this.makePur(pack_id);
            }
          });
        }

      viewPackages(id){
        this._routes.navigate(['/packview'],{ queryParams: {id:id}});
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

  arrayLength = function(obj): any {
   var len = 0, key;
   for (key in obj) {
     if (obj.hasOwnProperty(key)) len++;
   }
   return len;
 };

}
