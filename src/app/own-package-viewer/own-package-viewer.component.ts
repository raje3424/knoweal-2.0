import { Component, OnInit } from '@angular/core';
import { KnowelApiService } from '../_service/knowel-api.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-own-package-viewer',
  templateUrl: './own-package-viewer.component.html',
  styleUrls: ['./own-package-viewer.component.css']
})

export class OwnPackageViewerComponent implements OnInit {
  theMainQCanvas = true;
  editableCanvas = true;
  q_edit;JSONtheQestionList;
  pkg_edit_flag = true; theQestionList = [];
  packID;packDescription;author_name;packNotes;packName;
  edit_label;questionAddFlag;name_class;
  messages;whichMsg;des_class;
  question_IO;question_IOClass;optionA_IO;optionA_IOClass;
  optionB_IO;optionB_IOClass;optionC_IO;optionC_IOClass;
  optionD_IO;optionD_IOClass;theRightOption;q_whichMsg;
  addQuestionMessage;
  opt1Class;opt2Class;opt3Class;opt4Class;
  info_Desc_class = "_tbloc_point_active";
  notes_class = "";
  questions_class = "";infod_hideFlag = false;
  notes_hideFlag = true;question_hideFlag = true;
  questionAddErrorMsg;
  hideme = {};
  queIdHolder;
  past = "info_Desc_class";

  constructor(private route: ActivatedRoute,private _routes: Router,private _service: KnowelApiService) {
  this.hideme = {};
}

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.id)
      .subscribe(params => {
        //console.log(params);
        this.packID = params.id;
      });

  //  console.log(this.packID);
    this.getAllPackInfo();
    this.q_edit ="Edit";
    this.pkg_edit_flag = true;
    this.edit_label = 'Edit';
  }

  goBackFunction(){
   this._routes.navigate(['/library']);
  }

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
         console.log(res.result);
         this.packName = res.result.packName;
        this.packDescription = res.result.packDescription;
        this.packNotes = res.result.packNotes;
        this.author_name = res.result.author_name;
    });
  }

  kido(present){
      switch (present) {
        case 'info_Desc_class':
          this.info_Desc_class = "_tbloc_point_active";
          this.notes_class = "";
          this.questions_class = "";
          this.infod_hideFlag = false;
          this.notes_hideFlag = true;
          this.question_hideFlag = true;
          break;
        case 'notes_class':
          this.info_Desc_class = "";
          this.notes_class = "_tbloc_point_active";
          this.questions_class = "";
          this.infod_hideFlag = true;
          this.notes_hideFlag = false;
          this.question_hideFlag = true;
          break;
        case 'questions_class':
          this.info_Desc_class = "";
          this.notes_class = "";
          this.questions_class = "_tbloc_point_active";
          this.infod_hideFlag = true;
          this.notes_hideFlag = true;
          this.question_hideFlag = false;
          this.theMainQCanvas = false;
          this.editableCanvas = false;
          break;
        default:
          this.info_Desc_class = "_tbloc_point_active";
          this.notes_class = "";
          this.questions_class = "";
      }
    };

  cancel_pack(){
    // write code to clear / cancle the package making
    this.packName = "";
    this.packDescription = "";
    this.packNotes = "";
    this._routes.navigate(['/library']);
  };

  onClick(item, updateEdit) {
    console.log(item, updateEdit);

    if(updateEdit == "Edit"){
      Object.keys(this.hideme).forEach(h => {
        this.hideme[h] = false;
      });
      this.hideme[item.q_id] = true;
      document.getElementById("btn_"+item.q_id).innerHTML = "Update";
    }else{
      Object.keys(this.hideme).forEach(h => {
        this.hideme[h] = false;
      });
      //this.hideme[item.q_id] = false;
      document.getElementById("btn_"+item.q_id).innerHTML = "Edit";
    }
  }

// delete // QUESTION:
  delete_question(queData){
    console.log(queData);
    var options ={
        "v_class": "library",
        "v_function": "deleteQuestion",
        "value": {
          "token": localStorage.getItem("token"),
          "question_id": queData.q_id
        }
      };
      this._service.postRequestWithObservable(options)
         .subscribe( res => {
        console.log(res);
        if(res.response == "true"){
          var index = this.theQestionList.findIndex(function(o){
              return o.q_id == queData.q_id;
          })
          if(index !== -1) this.theQestionList.splice(index, 1);
          console.log(this.theQestionList);
          $("#question_"+queData.q_id).css("display", "none");
          $("#questionListCanvas_"+queData.q_id).css("display", "none");
          $("#button_"+queData.q_id).css("display", "none");
          alert("deleted");
        }else{
          alert("Error Deleting Question quesition");
        }
      });
  }

  viewAllQuestion(){
    let options = {
      "v_class": "library",
      "v_function": "getPackageQuestions",
      "value": {
          "packID": this.packID,
          "token": localStorage.getItem('token')
        }
    };
    this._service.postRequestWithObservable(options)
       .subscribe(res => {
      if(res.response != "false"){
        this.theQestionList = res.result;
        $("#showAllAddedQuestions").css("display", "block");
      }else{
        // no questio to show ! <<
      }
    });
  };

  editSave_pack(){
    if(this.edit_label == "Edit"){
      this.pkg_edit_flag = false;
      this.questionAddFlag = "true";
      this.edit_label = "Update";
    }else if (this.edit_label == "Update") {
      this.pkg_edit_flag = true;
      this.edit_label = "Edit";
      this.questionAddFlag = "";

      var blanker = [];
      if(this.packName == ""){
        this.name_class = "_error_input";
        blanker.push("Package Name");
      }
      if(this.packDescription == ""){
        this.des_class = "_error_input";
        blanker.push("Package Description");
      }
      if(this.packNotes == ""){
        this.notes_class = "_error_input";
        blanker.push("Package Notes");
      }

      if(blanker.length > 0){
        this.whichMsg = "_error_msg";
        this.messages = "[ ";
        for(var i = 0; i < blanker.length; i++){
          this.messages += blanker[i];
          if(blanker.length > 1 && i != blanker.length - 1){
            this.messages += ", ";
          }
          this.messages += " ";
        }
        if(blanker.length > 1){
          this.messages += " are blank ]";
        }else {
          this.messages += " is blank ]";
        }
      }else{
        var options = {
          "v_class": "library",
          "v_function": "updatePackage",
          "value":{
            "packName": this.packName,
            "packNotes": this.packNotes,
            "packDescription": this.packDescription,
            "package_id": this.packID,
            "token": localStorage.getItem('token')
          }
        };
        this._service.postRequestWithObservable(options)
           .subscribe(res => {
          if(res.response == "true"){
            this.messages = "[ Package Updated :) ]";
            this.whichMsg = "_success_msg";
            setTimeout(function(){
              this.messages = "";
              this.whichMsg = "";
            }, 1500);
          }else{
            this.messages = "[ ERROR Updating Package :( ]";
            this.whichMsg = "_error_msg";
            setTimeout(function(){
              this.messages = "";
              this.whichMsg = "";
            }, 1500);
          }
        });
      }
    }
  };


  //save question
  saveQuestion(){
    this.questionAddErrorMsg = true;
    if(this.packID != "" || this.packID >= 0){
      var blanker = [];
      if(this.question_IO == ""){
        this.question_IOClass = "_error_input";
        blanker.push("Question");
      }
      if(this.optionA_IO == ""){
        this.optionA_IOClass = "_error_input";
        blanker.push("Option Field One");
      }
      if(this.optionB_IO == ""){
        this.optionB_IOClass = "_error_input";
        blanker.push("Option Field Two");
      }
      if(this.optionC_IO == ""){
        this.optionC_IOClass = "_error_input";
        blanker.push("Option Field Three");
      }
      if(this.optionD_IO == ""){
        this.optionD_IOClass = "_error_input";
        blanker.push("Option Field Four");
      }
      if(this.theRightOption == ""){
        blanker.push("Correcct Options Checkbox");
      }

      if(blanker.length > 0){
        this.q_whichMsg = "_error_msg";
        this.addQuestionMessage = "[ ";
        for(var i = 0; i < blanker.length; i++){
          this.addQuestionMessage += blanker[i];
          if(blanker.length > 1 && i != blanker.length - 1){
            this.addQuestionMessage += ", ";
          }
          this.addQuestionMessage += " ";
        }
        if(blanker.length > 1){
          this.addQuestionMessage += " are blank ]";
        }else {
          this.addQuestionMessage += " is blank ]";
        }
      }else{
        let options = {
          "v_class": "library",
          "v_function": "addQuestion",
          "value":{
              "question": this.question_IO,
              "opt1": this.optionA_IO,
              "opt2": this.optionB_IO,
              "opt3": this.optionC_IO,
              "opt4": this.optionD_IO,
              "anskey": this.theRightOption,
              "packID": this.packID,
              "token": localStorage.getItem('token')
          }
        };
        this._service.postRequestWithObservable(options)
           .subscribe(res => {
          if(res.response == "true"){
            this.theQestionList.push({
              "question": this.question_IO,
              "opt1": this.optionA_IO,
              "opt2": this.optionB_IO,
              "opt3": this.optionC_IO,
              "opt4": this.optionD_IO,
              "anskey": this.theRightOption,
              "q_id": res.lid
            });
            if(this.theQestionList.length > 0){
              $("#showAllAddedQuestions").css("display", "block");
            }else{
              $("#showAllAddedQuestions").css("display", "none");
            }
            this.q_whichMsg = "_success_msg";
            this.addQuestionMessage = "Question Added Succefully :)";
            this.question_IO = "";
            this.optionA_IO = "";
            this.optionB_IO = "";
            this.optionC_IO = "";
            this.optionD_IO = "";
            this.theRightOption = "";
            setTimeout(function(){
              $("#theQestionMessage").html("Add new Question :)");
            },1000)
          }else{
            this.q_whichMsg = "_error_msg";
            this.addQuestionMessage = "Error in adding question, try again :(";
          }
        });
      }
    }
  };

//edit // QUESTION:
edit_question(queData, i, anskey){
  console.log(queData, anskey, $.trim(document.getElementById("btn_"+queData.q_id).innerHTML));
  if($.trim(document.getElementById("btn_"+queData.q_id).innerHTML) == "Edit"){
    console.log('In Edit block....!');
    if(this.queIdHolder){
      document.getElementById("btn_"+this.queIdHolder).innerHTML = "Edit";
     }
    this.onClick(queData, "Edit");
    //this.q_edit = "Update";
  }else if($.trim(document.getElementById("btn_"+queData.q_id).innerHTML) == "Update"){

    console.log('In Update block....!');

    // console.log("Question >> "+queData.question);
    // console.log("Option 1 >> "+queData.opt1);
    // console.log("Option 2 >> "+queData.opt2);
    // console.log("Option 3 >> "+queData.opt3);
    // console.log("Option 4 >> "+queData.opt4);
    // console.log("anskey : >> "+queData.anskey);
    this.opt1Class = "";
    this.opt2Class = "";
    this.opt3Class = "";
    this.opt4Class = "";
    if(anskey == queData.opt1){
      this.opt1Class = "_correct_ans";
    }else if (anskey == queData.opt2) {
      this.opt2Class = "_correct_ans";
    }else if (anskey == queData.opt3){
      this.opt3Class = "_correct_ans";
    }else if (anskey == queData.opt4){
      this.opt4Class = "_correct_ans";
    }

    var blanker = [];
    if(queData.question == ""){
      // give an error message here >> ! <<
      blanker.push("Question");
    }
    if(queData.opt1 == ""){
      // give an error message here >> ! <<
      blanker.push("Option Field One");
    }
    if(queData.opt2 == ""){
      // give an error message here >> ! <<
      blanker.push("Option Field Two");
    }
    if(queData.opt3 == ""){
      // give an error message here >> ! <<
      blanker.push("Option Field Three");
    }
    if(queData.opt == ""){
      // give an error message here >> ! <<
      blanker.push("Option Field Four");
    }
    if(queData.anskey == ""){
      blanker.push("Correcct Options Checkbox");
    }
    if(blanker.length > 0){
      alert("Please Fill the complete form");
    }else{
      var options ={
        "v_class": "library",
        "v_function": "updateQuestion",
        "value": {
          "token": localStorage.getItem('token'),
          "question": queData.question,
          "opt1": queData.opt1,
          "opt2": queData.opt2,
          "opt3": queData.opt3,
          "opt4": queData.opt4,
          "anskey": anskey,
          "question_id": queData.q_id
        }
      };
      this._service.postRequestWithObservable(options)
         .subscribe( res => {
        console.log(res);
        if(res.response == "true"){
          this.q_edit == "Question Update :)";
          this.theMainQCanvas = false;
          this.editableCanvas = true;
          var updatedQuestion: any = [{
            "question": queData.question,
            "opt1": queData.opt1,
            "opt2": queData.opt2,
            "opt3": queData.opt3,
            "opt4": queData.opt4,
            "anskey": anskey,
            "q_id": queData.q_id
          }];

          this.theQestionList = this.theQestionList.map(obj => updatedQuestion.find(o => o.q_id === obj.q_id) || obj);
          this.theMainQCanvas = true;
          this.editableCanvas = false;
          this.onClick(queData, "Update");
          console.log(this.theQestionList);
        }else{
          // give an error !!
          alert("Error Updating quesition");
        }
      });
    }
  }
  this.queIdHolder = queData.q_id;
}

isSelected(opt, anskey){
  if(opt === anskey){
    return true;
  }else{
    return false;
  }
}

  cancelQuestion(){
  this.questionAddErrorMsg = "";
  this.question_IO = "";
  this.optionA_IO = "";
  this.optionB_IO = "";
  this.optionC_IO = "";
  this.optionD_IO = "";
  this.theRightOption = "";
  };
}
