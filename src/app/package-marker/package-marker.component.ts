import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { KnowelApiService } from '../_service/knowel-api.service';
//import * from 'jquery';
declare var $: any;

@Component({
  selector: 'app-package-marker',
  templateUrl: './package-marker.component.html',
  styleUrls: ['./package-marker.component.css']
})
export class PackageMarkerComponent implements OnInit {
  theMainQCanvas = true;
  editableCanvas = false;
  q_edit = "Edit";
  opt1Class:any;opt2Class:any;opt3Class:any;opt4Class:any;
  x:any;
  q_id:any;
  theQestionList = []; JSONtheQestionList;
  editPackFlag = "true";
  questionAddFlag = "true";
  pkgCreateButtonFlag: boolean = true;
   packID:string = "";
   packName:any;packNotes;packDescription;
   name_class;des_class;whichMsg;note_class;
   messages;pkg_edit_flag;
   edit_label;
   questionAddErrorMsg;question_IO;question_IOClass;
   optionA_IO;optionA_IOClass;optionB_IO;optionB_IOClass;
   optionC_IO;optionC_IOClass;optionD_IO;optionD_IOClass;
   theRightOption;addQuestionMessage;q_whichMsg;

   past = "info_Desc_class";
   step_count = '1';
   step_info = 'Basic Package Information';
   info_Desc_class = "_tbloc_point_active";
   notes_class = "";
   questions_class = "";

   infod_hideFlag = true;
   notes_hideFlag = false;
   question_hideFlag = false;

   public invoiceForm: FormGroup;
   hideme = {};

  constructor(private _routes: Router,private _service: KnowelApiService, private _fb: FormBuilder){ 
    this.hideme = {}; // init is required
  }


  ngOnInit() {
     this.edit_label='Edit';
    //  this.invoiceForm = this._fb.group({
    //   itemRows: this._fb.array([this.initItemRows()])
    // });
  }

  initItemRows() {
    return this._fb.group({
        itemname: this.theQestionList
    });
}

addNewRow() {
    const control = <FormArray>this.invoiceForm.controls['itemRows'];
    control.push(this.initItemRows());
}

deleteRow(index: number) {
    const control = <FormArray>this.invoiceForm.controls['itemRows'];
    control.removeAt(index);
}

  goBackFunction(){
   this._routes.navigate(['/library']);
  }

  addPackage(){
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
          this.note_class = "_error_input";
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
          let options = {
            "v_class": "library",
            "v_function": "addPackage",
            "value":{
              "token": localStorage.getItem('token'),
              "packName": this.packName,
              "packNotes": this.packNotes,
              "packDescription": this.packDescription
            }
          };
          console.log(options);
          this._service.postRequestWithObservable(options)
             .subscribe( res => {
            console.log(res);
            this.name_class = "";
            this.des_class = "";
            this.note_class = "";
            if(res.response == "true"){
              this.pkg_edit_flag = "true";
              this.pkgCreateButtonFlag = false;
              this.messages = "Package Added, Now you can add question to your package :)";
              this.whichMsg = "_success_msg";
              this.questionAddFlag = "";
              this.editPackFlag = ""
              var options = {
                "v_class": "library",
                "v_function": "getRecentPackId",
                "value":{
                  "token": localStorage.getItem('token'),
                  "packName": this.packName
                }
              };
              this._service.postRequestWithObservable(options)
                 .subscribe( res => {
                console.log(res.response);
                // set this data to some global variable ...
                this.packID = res.packID;
              });

            }else{
              this.messages = "Something seems wrong, please try again :(";
              this.whichMsg = "_warning_msg";
            }
          });
        }
  }


  editSave_pack(){
    if(this.edit_label == "Edit"){
          this.pkg_edit_flag = "";
          this.questionAddFlag = "true";
          this.edit_label = "Update";
        }else if (this.edit_label == "Update") {
          this.pkg_edit_flag = true;
          this.edit_label = "Edit";
          this.questionAddFlag = "";

          let blanker = [];
          if(this.packName == ""){
            this.name_class = "_error_input";
            blanker.push("Package Name");
          }
          if(this.packDescription == ""){
            this.des_class = "_error_input";
            blanker.push("Package Description");
          }
          if(this.packNotes == ""){
            this.note_class = "_error_input";
            blanker.push("Package Notes");
          }

          if(blanker.length > 0){
            this.whichMsg = "_error_msg";
            this.messages = "[ ";
            for(var i = 0; i < blanker.length; i++){
              this.messages += blanker[i];
              if(blanker.length > 1 && i != blanker.length - 1){
                this.messages == ", ";
              }
              this.messages = " ";
            }
            if(blanker.length > 1){
              this.messages == " are blank ]";
            }else {
              this.messages == " is blank ]";
            }
          }else{
            let options = {
              "v_class": "library",
              "v_function": "updatePackage",
              "value":{
                "token": localStorage.getItem('token'),
                "packName": this.packName,
                "packNotes": this.packNotes,
                "packDescription": this.packDescription,
                "package_id": this.packID
              }
            };
          console.log(options);
            this._service.postRequestWithObservable(options)
               .subscribe( res => {
              console.log(res);
              if(res == "true"){
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
  }


  saveQuestion(){
    this.questionAddErrorMsg = true;
        if(this.packID != ""  ){//||this.packID >= 0
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
            blanker.push("Correct Options Checkbox");
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
                "token": localStorage.getItem('token'),
                  "question": this.question_IO,
                  "opt1": this.optionA_IO,
                  "opt2": this.optionB_IO,
                  "opt3": this.optionC_IO,
                  "opt4": this.optionD_IO,
                  "anskey": this.theRightOption,
                  "packID": this.packID
              }
            };
            this._service.postRequestWithObservable(options)
               .subscribe( res => {
              if(res.response == "true"){
                if(res.lid != "" && res.lid > 0){
                  //var question = {};
                  this.theQestionList.push({
                    "question": this.question_IO,
                    "opt1": this.optionA_IO,
                    "opt2": this.optionB_IO,
                    "opt3": this.optionC_IO,
                    "opt4": this.optionD_IO,
                    "anskey": this.theRightOption,
                    "q_id": res.lid
                  });
                  console.log(this.theQestionList)
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
              }else{
                this.q_whichMsg = "_error_msg";
                this.addQuestionMessage = "Error in adding question, try again :(";
              }
            });
          }
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
  }

  edit_question(queData, i){
    console.log(queData);
    if(this.q_edit == "Edit"){
      //this.hideme[i] = !this.hideme[i]
      this.theMainQCanvas = false;
      this.editableCanvas = true;
      this.q_edit = "Update";
    }else if(this.q_edit == "Update"){
      this.theMainQCanvas = false;
      this.editableCanvas = true;
      this.q_edit = "Edit";
      console.log("Question >> "+queData.question);
      console.log("Option 1 >> "+queData.opt1);
      console.log("Option 2 >> "+queData.opt2);
      console.log("Option 3 >> "+queData.opt3);
      console.log("Option 4 >> "+queData.opt4);
      console.log("anskey : >> "+queData.anskey);
      this.opt1Class = "";
      this.opt2Class = "";
      this.opt3Class = "";
      this.opt4Class = "";
      if(queData.anskey == queData.opt1){
        this.opt1Class = "_correct_ans";
      }else if (queData.anskey == queData.opt2) {
        this.opt2Class = "_correct_ans";
      }else if (queData.anskey == queData.opt3){
        this.opt3Class = "_correct_ans";
      }else if (queData.anskey == queData.opt4){
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
            "anskey": queData.anskey,
            "question_id": queData.q_id
          }
        };
        this._service.postRequestWithObservable(options)
           .subscribe( res => {
          console.log(res);
          // if(res == "true"){
          //   this.q_edit == "Question Update :)";
          //   setTimeout(function(){
          //     this.q_edit = "Edit";
          //   }, 1500);
          // }else{
          //   // give an error !!
          //   alert("Error Updating quesition");
          // }
        });
      }
    }
  }


  delete_question(queData){
    console.log(queData);
    // var options ={
    //     "v_class": "library",
    //     "v_function": "deleteQuestion",
    //     "value": this.q_id
    //   };
    //   this._service.postRequestWithObservable(options)
    //      .subscribe( res => {
    //     console.log(res);
    //     if(res == "true"){
    //       //("#question_"+this.q_id).css("display", "none");
    //       alert("deleted");
    //     }else{
    //       alert("Error Deleting Question quesition");
    //     }
    //   });
  }

  addQuestions(){
    if(this.questionAddFlag != ""){
        //this.kido('info_Desc_class');
        this.messages = "Please create a Package first... :)";
        this.whichMsg = "_warning_msg";
        setTimeout(function () {
          this.messages = "";
          this.whichMsg = "";
        }, 2000);
      }else{

        if(this.packID == "" ){
          this.messages = "There seems an Internal Error, please add question to package from library...";
          this.whichMsg = "_warning_msg";
          setTimeout(function(){
              this._routes.navigate(['/library']);
          }, 1500);
        }
      }
  }



  kido(present){
    console.log(present);
    switch (present) {
      case 'info_Desc_class':
        this.info_Desc_class = "_tbloc_point_active";
        this.notes_class = "";
        this.questions_class = "";
        this.infod_hideFlag = true;
        this.notes_hideFlag = false;
        this.question_hideFlag = false;
        this.step_count = '1';
        this.step_info = 'Basic Package Information';
        break;
      case 'notes_class':
        this.info_Desc_class = "";
        this.notes_class = "_tbloc_point_active";
        this.questions_class = "";
        this.infod_hideFlag = false;
        this.notes_hideFlag = true;
        this.question_hideFlag = false;
        this.step_count = '2';
        this.step_info = 'Add Notes & Save Package';
        break;
      case 'questions_class':
        this.info_Desc_class = "";
        this.notes_class = "";
        this.questions_class = "_tbloc_point_active";
        this.infod_hideFlag = false;
        this.notes_hideFlag = false;
        this.question_hideFlag = true;
        this.step_count = '3';
        this.step_info = 'Add Questions to Package';
        break;
      default:
        this.info_Desc_class = "_tbloc_point_active";
        this.notes_class = "";
        this.questions_class = "";
    }
  };
}
