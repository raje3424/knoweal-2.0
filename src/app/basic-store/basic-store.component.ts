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
profile_noti;
pro_acriveClass:any;
lib_activeClass:any;
store_activeClass:any;
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
  "image": "/assets/_req/fonts_images/images/knoweal.JPG",
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
      }
    });

    this.store_activeClass = '_nav_tile_selected';
  }

  getAllPacks(){
    var options = {
      "v_class": "library",
      "v_function": "viewAllunpurchasedPackages",
      "value" :{
          "token": localStorage.getItem('token')
      }
    };
    console.log(options);
    this._service.postRequestWithObservable(options)
        .subscribe( res => {
          if(res.response == "" || res.response == "false"){
            this.boughtPackMsg = true;
          }else{
            this.boughtPackMsg = false;
            this.pkgData = res.result;
            this.buyHide = true;
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


    buyByRazorPay(pack_id){
      let options = {
        "v_class": "library",
        "v_function": "getPackageInfoStore",
        "value" :{
            "package_id" : pack_id,
            "token": localStorage.getItem('token')
        }
      }
      console.log(options);
      this._service.postRequestWithObservable(options)
          .subscribe( res => {
            console.log(res);
            if(res.response == 'true'){
              let amt = res.result['price'];
              let name = res.result['package_name'];
              let desc = res.result['description'];
              let username = res.result['author_name'];
              let email = res.result['email'];
              console.log(amt);
              amt = amt * 100;
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
                      this.dataToSendToRazorPay.prefill.name = username;
                      this.dataToSendToRazorPay.prefill.email = email;
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
