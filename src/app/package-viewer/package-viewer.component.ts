import { Component, OnInit } from '@angular/core';
import { KnowelApiService } from '../_service/knowel-api.service';
import { Router,ActivatedRoute } from '@angular/router';
import { WindowService } from '../_service/window.service';

@Component({
  selector: 'app-package-viewer',
  templateUrl: './package-viewer.component.html',
  styleUrls: ['./package-viewer.component.css']
})

export class PackageViewerComponent implements OnInit {
  b_flag;libButtonHF;lib_pur_title;
  pkg_id;packName;packDescription;packNotes;
  packID;
  author_name;price;req;orderObj:any=[];
  backTo;
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

constructor(private route: ActivatedRoute,private _routes: Router,private _service: KnowelApiService,private windowRef: WindowService){ }

  ngOnInit() {
    this.route.queryParams
      // .filter(params => params.id)
      .subscribe(params => {
        this.orderObj ={...params.keys, ...params};
        console.log(this.orderObj);
         this.pkg_id = this.orderObj.id;
         console.log(this.pkg_id);
         this.req =this.orderObj.req;
      });
      if(this.req=='lib'){
        this.backTo ="Library";
      }else{
        this.backTo = "Stream";
      }
      this.getPackInfo();
      //this.checkIfPur(this.pkg_id);
  }

 checkIfPur(pkg_id){
   var options = {
    "v_class": "library",
    "v_function": "checkIfPur",
    "value":{
      "package_id": pkg_id,
      "token": localStorage.getItem('token')
    }
  };
  this._service.postRequestWithObservable(options)
     .subscribe(res => {
       console.log(res);
    if(res.response == "false"){
      this.b_flag = true;
      if(this.req == 'lib'){
      this.libButtonHF = true;
      this.lib_pur_title = false;
    }else{
      this.libButtonHF = false;
      this.lib_pur_title = false;
    }
    }else{
      this.b_flag = false;
      if(this.req == 'lib'){
      this.libButtonHF = true;
      this.lib_pur_title = false;
    }else{
      this.libButtonHF = true;
      this.lib_pur_title = true;
    }
    }
  });
 }

 goBackFunction(back){
   if(back =='Library'){
     this._routes.navigate(['/library']);
   }else{
     this._routes.navigate(['/basic']);
   }
 }

 cancel_pack(){
    this.packName = "";
    this.packDescription = "";
    this.packNotes = "";
    this._routes.navigate(['/basic']);
 }

 getPackage(){
   let options = {
       "v_class": "library",
       "v_function": "addPurchasePackage",
       "value": {
         "package_id":this.pkg_id,
         "token": localStorage.getItem('token')
       }
     };
     console.log(options);
     this._service.postRequestWithObservable(options)
        .subscribe(res => {
          console.log(res);
       if(res.response == "true"){
         alert("Content Added to Library");
         //this._routes.refresh();
       }else{
         alert("Sorry: Something went Wrong, Try again later. :|")
       }
       console.log("data >> "+res);
     });
 }

 buyByRazorPay(){
   let options = {
     "v_class": "library",
     "v_function": "getPackageInfo",
     "value" :{
         "package_id" : this.pkg_id,
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
                   this.dataToSendToRazorPay.id = this.pkg_id;
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
     let pay_id = response.razorpay_payment_id;
     let pack_id = options.id;
     this.payemntHandler(pay_id,pack_id)
  });

   this.rzp1 = new this.windowRef.nativeWindow.Razorpay(options);
   this.rzp1.open();
 }

 payemntHandler(razorpay_payment_id,pack_id){
   //console.log('Payment... '+razorpay_payment_id);
   if (typeof razorpay_payment_id == 'undefined' || razorpay_payment_id < 1) {
     alert('Try after a while !');
   }else{
     this.makePur(pack_id,razorpay_payment_id);
     alert('Success !');
   }
 }

    //purchase package function
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


   getPackInfo(){
       this.checkIfPur(this.pkg_id);
       let options = {
         "v_class": "library",
         "v_function": "getPackageInfoStore",
         "value": {
           "packID":this.pkg_id,
           "token": localStorage.getItem('token')
         }
       };
       this._service.postRequestWithObservable(options)
          .subscribe(res => {
            console.log(res);
            if(res.response == 'true'){

              this.author_name = res.result.author_name;
              this.packName = res.result.packName;
              this.packDescription = res.result.description;
              this.price = res.result.price ;
            }else {
              alert(res.errMessage);
            }

       });
     }

}
