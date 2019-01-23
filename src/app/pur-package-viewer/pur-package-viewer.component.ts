import { Component, OnInit } from '@angular/core';
import { KnowelApiService } from '../_service/knowel-api.service';
import { Router } from '@angular/router';
import { AppRoutingModule } from '../app-routing/app-routing.module';

@Component({
  selector: 'app-pur-package-viewer',
  templateUrl: './pur-package-viewer.component.html',
  styleUrls: ['./pur-package-viewer.component.css']
})

export class PurPackageViewerComponent implements OnInit {
submitFlag = false;
totalSolved = 0;
theQestionList:any = [];
packName;packDescription;packID;
totalQuestions;packNotes;
theAnsList:any = [];
theGlassFlag = true;
author_name;

  constructor(private _routes: Router,private _service: KnowelApiService){ }

  ngOnInit() {
    this.getAllPackInfo();
    // toc_nav('info_Desc_class');
    // toc_nav('notes_class');
    // toc_nav('questions_class');

  }

  cancel_pack(){
    this.packName = "";
    this.packDescription = "";
    this.packNotes = "";
    this._routes.navigate['/library'];
  }

  // goBackFunction(){
  //   this._routes.navigate['/library'];
  // }

  solveTheQuestion(){
    let options ={
      "v_class": "library",
      "v_function": "getQuestionsToSolve",
      "value": {
          "token": localStorage.getItem('token'),
          "packID":this.packID
        }
    };
    console.log(options);
    this._service.postRequestWithObservable(options)
       .subscribe(res => {
         console.log(res);
      this.theQestionList = res;
      this.totalQuestions = this.theQestionList.length;
    });
  }

  getTheResults(q_id, anskey){
    this.theAnsList = [];
    for(var i = 0; i < this.theQestionList.length; i++){
      if(this.theQestionList[i].anskey != ""){
        this.theAnsList.push({
          'q_id': this.theQestionList[i].q_id,
          'anskey': this.theQestionList[i].anskey});
      }
    }
    this.theAnsList.push({
      'pkg_id': this.packID,
      'anskey': ''
    });
    if(this.theAnsList.length > 0){
      let options ={
        "v_class": "library",
        "v_function": "getTheResults",
        "value": {
          "token": localStorage.getItem('token'),
          "theAnsList":this.theAnsList
        }
      };
      this._service.postRequestWithObservable(options)
         .subscribe(res => {
           console.log(res);
        if(res != "false"){
          for (var i = 0; i < res.length; i++) {
            if(res[i]['q_id'] == this.theQestionList[i]['q_id']){
              if(res[i]['rkie'] != "true"){
                this.theQestionList[i]['rkie'] = "Correct answer is [ "+res[i]['rkie']+" ]";
                //$("#question_"+res[i]['q_id']).addClass("_solver_wrong"); sarita
              }else{
                //$("#question_"+res[i]['q_id']).addClass("_solved_correct");sarita
                this.theQestionList[i]['rkie'] = "Correct";
              }
            }
          }
          this.submitFlag = true;
          this.theGlassFlag = false;
        }else{
          //alert("You havent solved anything !!!");
          this.submitFlag = true;
          this.theGlassFlag = false;
        }

      });
    }else{
      // error >> ! <<
      alert("He he he, solve atleast 1 question ... ");
    }
}

getAnsCount(){
    //var ansCount = this.totalSolved;
    this.totalSolved = 0;
    for(var i = 0; i < this.theQestionList.length; i++){
      if(this.theQestionList[i].anskey!= ""){
        this.totalSolved = this.totalSolved + 1;
      }
    }
  };

  getAllPackInfo(){
    var options ={
      "v_class": "library",
      "v_function": "getPur_PackageInfo",
      "value": {
          "token": localStorage.getItem('token'),
          "packID": this.packID
        },
    };
    this._service.postRequestWithObservable(options)
       .subscribe(res => {
         console.log(res.result);
        this.packName = res.result.packName;
        this.packDescription = res.result['packDescription'];
        this.packNotes = res.result['packNotes'];
        this.author_name = res.result['full_name'];
    });
  }

  goBackFunction(){
   this._routes.navigate(['/library']);
  }

}
