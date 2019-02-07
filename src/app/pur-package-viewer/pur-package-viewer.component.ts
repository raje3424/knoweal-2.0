import { Component, OnInit } from '@angular/core';
import { KnowelApiService } from '../_service/knowel-api.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

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
author_name;notes_class;questions_class;
info_Desc_class = "_tbloc_point_active";
content_view_switch;

queIdHolder;
queOptHolder;

  constructor(private route: ActivatedRoute,private _routes: Router,private _service: KnowelApiService){ }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.id)
      .subscribe(params => {
        //console.log(params);
        this.packID = params.id;
      });

  //  console.log(this.packID);
    this.getAllPackInfo();

    if(this.packID){

      let options ={
      "v_class": "library",
      "v_function": "getQuestionsToSolve",
      "value":{
        "packID":this.packID,
        "token": localStorage.getItem('token')
      }
    };
    //console.log(options);
    this._service.postRequestWithObservable(options)
       .subscribe(res => {
         //console.log(res);
         //console.log(res.result);
         if (res.response == "true"){
           if(this.arrayLength(res.result) != 0){
            this.content_view_switch = "content_questoin";
            this.theQestionList = res.result;
            this.totalQuestions = this.theQestionList.length;
            this.submitFlag = true;
            this.toc_nav('questions_class');
           }else {
             alert(res.errMessage);
           }
         }else{
           this.content_view_switch = "packDInfo";
           //this.content_view_switch = 'content_notes';
           this.toc_nav('info_Desc_class');
         }
       })
    }
     this.toc_nav('info_Desc_class');
    // this.toc_nav('notes_class');
    // this.toc_nav('questions_class');
  }
  demo(qId,whichOpt){
    console.log(this.queIdHolder);
    // deselect prev option >>>
    if(this.queIdHolder == "questionListCanvas_"+qId){
      if(this.queOptHolder){
        $("#"+this.queOptHolder).removeClass("_correct_ans");
      }
    }

    // deselect prev option <<<
    $("#ansOpt_"+qId+"_"+whichOpt).addClass("_correct_ans");

    this.queIdHolder = $("#questionListCanvas_"+qId).attr('id');
    this.queOptHolder = $("#ansOpt_"+qId+"_"+whichOpt).attr('id'); // hold prv opt class <<<
  }

  cancel_pack(){
    this.packName = "";
    this.packDescription = "";
    this.packNotes = "";
    this._routes.navigate['/library'];
  }


  solveTheQuestion(){
    let options ={
      "v_class": "library",
      "v_function": "getQuestionsToSolve",
      "value": {
          "packID":this.packID,
          "token": localStorage.getItem('token')
        }
    };
    console.log(options);
    this._service.postRequestWithObservable(options)
       .subscribe(res => {
      //console.log(res);
      if(res.response == 'true'){
        if(this.arrayLength(res.result) != 0){
          this.theQestionList = res.result;
          this.totalQuestions = this.theQestionList.length;
        }else {
          alert(res.errMessage);
        }
      }
    });
  }

  getTheResults(q_id, anskey){
    this.theAnsList = [];
    for(var i = 0; i < this.theQestionList.length; i++){
      //console.log("anskey",this.theQestionList[i].anskey)
      if(this.theQestionList[i].anskey != "" && this.theQestionList[i].anskey!=undefined){
        this.theAnsList.push({
          'q_id': this.theQestionList[i].q_id,
          'anskey': this.theQestionList[i].anskey});
          //console.log("in if");
      }else{
        this.theAnsList.push({
          'q_id': this.theQestionList[i].q_id,
          'anskey': ""});
          //console.log("in else");
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
           //console.log(res);
        if(res.response != "false"){
          var lenArray = this.arrayLength(res.result);
          for (var i = 0; i < lenArray; i++) {
            //console.log(this.arrayLength(res.result),res.result[0].q_id, this.theQestionList[0]['q_id']);
            if(res.result[i].q_id == this.theQestionList[i]['q_id']){
              //console.log(res.result[i]['rkie']);
              if(res.result[i]['rkie'] != "true" && res.result[i]['rkie'] != "Notsolved"){
                //console.log(res.result[i]['rkie']);
                this.theQestionList[i]['rkie'] = 'Correct answer is [   '+res.result[i]['rkie']+' ]';
                $("#question_"+res.result[i]['q_id']).addClass("_solver_wrong");
              }else if(res.result[i]['rkie'] == "Notsolved"){
                this.theQestionList[i]['rkie'] = "This question is not solved!";
              }else {
                $("#question_"+res.result[i]['q_id']).addClass("_solved_correct");
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
          "packID": this.packID,
          "token": localStorage.getItem('token')
        }
    };
    this._service.postRequestWithObservable(options)
       .subscribe(res => {
         //console.log(res.result);
         if(res.response == 'true'){;
          if(this.arrayLength(res.result) != 0){
            this.packName = res.result.packName;
            this.packDescription = res.result.packDescription;
            this.packNotes = res.result.packNotes;
            this.author_name = res.result.author_name;
          }else {
            alert(res.errMessage);
          }
         }

    });
  }

  goBackFunction(){
   this._routes.navigate(['/library']);
  }

  toc_nav(present){
    switch (present) {
      case 'info_Desc_class':
        this.info_Desc_class = "_tbloc_point_active";
        this.notes_class = "";
        this.questions_class = "";
        break;
      case 'notes_class':
        this.info_Desc_class = "";
        this.notes_class = "_tbloc_point_active";
        this.questions_class = "";
        break;
      case 'questions_class':
        this.info_Desc_class = "";
        this.notes_class = "";
        this.questions_class = "_tbloc_point_active";
        this.submitFlag = true;
        break;
      default :
        this.info_Desc_class = "_tbloc_point_active";
        this.notes_class = "";
        this.questions_class = "";
    }
  };

  notes(){
    console.log("in notes");
    this.content_view_switch = 'content_notes';
    this.toc_nav('notes_class');
  }

  info(){
    console.log("in info");
    this.content_view_switch = 'packDInfo';
    this.toc_nav('info_Desc_class');
  }

  question(){
    console.log("in question");
    this.content_view_switch = 'content_questoin';
    this.toc_nav('questions_class');
  }

  arrayLength = function(obj): any {
    var len = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) len++;
    }
    return len;
  };
}
