<?PHP

/*
**
** << interface for saving questions and quiz >>
**
*/

$opts = json_decode(file_get_contents("php://input"));

include("serverConnector.php");
include("sessionConn.php");
include("infoGetter.php");
include("infoSetter.php");

$operation = $opts->opt;
if($operation == ""){
  $kalu = $opts->opt;
  $operation = $kalu;
}
$os = new sessionConn;

switch ($operation) {

  case "getSessionUserId":
    echo $_SESSION['id'];
    $_POST['id']=$_SESSION['id'];
    break;

  case "saveQuestion":
    $questionData = array( 'question' => $_POST['question'],
                           'option1' => $_POST['option1'],
                           'option2' => $_POST['option2'],
                           'option3' => $_POST['option3'],
                           'option4' => $_POST['option4'],
                           'anskey' => $_POST['anskey'],
                           'package_id' => $_POST['package_id']
                         );

    $oInfoG = new infoSetter;
    $query = $oInfoG->userAdaptor("saveQuestion", $questionData);
    $osCon = new serverConn;
    $osCon->connect();
    $return = $osCon->query_db($query);
    $osCon->closer();
    echo $return;
    break;
    //here create package and its information

    case "pack_creator":
      $data = array(
        'q_name'=> $_POST['quiz_name'],
        'userid'=> $_SESSION['id'],
        'q_info'=> $_POST['quiz_info'],
        'notes'=> $_POST['notes']
      );
      $oInfoSet = new infoSetter;
      $query = $oInfoSet->userAdaptor("pack_creator", $data);
      $oScon = new serverConn;
      $oScon->connect();
      $result = $oScon->query_db($query);
      $oScon->closer();
      echo $result;
      break;

    // here fetch package id of current login user
    case "getPackId":
      $oInfo = new infoGetter;
      $query = $oInfo->userAdaptor("getLastPackId", $_SESSION['id']);
      $dbCon = new serverConn;
      $dbCon->connect();
      $result = $dbCon->query_db($query);
      $dbCon->closer();
      $row = mysql_fetch_array($result);
      $result = $row['package_id'];
      echo $result;
      break;

    case "getLastQuestionId":
      $oInfo = new infoGetter;
      $query = $oInfo->userAdaptor("getLastQuestionId", $_POST['package_id']);
      $dbCon = new serverConn;
      $dbCon->connect();
      $result = $dbCon->query_db($query);
      $dbCon->closer();
      $row = mysql_fetch_array($result);
      $result = $row["question_id"];
      echo $result;
      break;

    case "updateQuestion":
      $questionData = array( 'question' => $_POST['question'],
                             'option1' => $_POST['option1'],
                             'option2' => $_POST['option2'],
                             'option3' => $_POST['option3'],
                             'option4' => $_POST['option4'],
                             'anskey' => $_POST['anskey'],
                             'version' => $_POST['version'],
                             'package_id' => $_POST['package_id'],
                             'questionID' => $_POST['questionID']
                           );
      $oInfo = new infoSetter;
      $query = $oInfo->userAdaptor("updateQuestion", $questionData);
      $dbCon = new serverConn;
      $dbCon->connect();
      $result = $dbCon->query_db($query);
      $dbCon->closer();
      //$row = mysql_fetch_array($result);
      //$result = $row["question_id"];
      echo $result;
      break;

    case "getOnlyQuestion":
      $oInfo = new infoGetter;
      $query = $oInfo->userAdaptor("getOnlyQuestion", $_GET['question_id']);
      $dbCon = new serverConn;
      $dbCon->connect();
      $result = $dbCon->query_db($query);
      $dbCon->closer();
      $row = mysql_fetch_array($result);
      $result = $row["question"];
      echo $result;
      break;

    case "getCompleteQuestion":
      $oInfo = new infoGetter;
      $query = $oInfo->userAdaptor("getCompleteQuestion", $_GET['question_id']);
      $dbCon = new serverConn;
      $dbCon->connect();
      $result = $dbCon->query_db($query);
      $dbCon->closer();
      $row = mysql_fetch_array($result);
      $data = array(
        'question'=> $row['question'],
        'option1'=> $row['opt1'],
        'option2'=> $row['opt2'],
        'option3'=> $row['opt3'],
        'option4'=> $row['opt4'],
        'anskey'=> $row['anskey'],
        'version'=> $row['version'],
        'pack_id'=> $row['package_id']
      );

      $jdata = json_encode($data);
      echo $jdata;
      break;

    case "getAllOwnPacks":
      $oInfoG = new infoGetter;
      $query =  $oInfoG->userAdaptor("getAllOwnPacks", $_SESSION['id']);
      $dbCon = new serverConn;
      $dbCon->connect();
      $result = $dbCon->query_db($query);
      $dbCon->closer();

      //$row_cnt = mysql_num_rows($result);
      $data = array();
      while($row = mysql_fetch_array($result)){
        array_push($data, array(
          "id"=>$row['package_id'],
          "title"=>$row['package_name']
        ));
      }
      $jdata = json_encode($data);
      echo $jdata;
      break;

    case "getAllPurcases":
      $oInfoG = new infoGetter;
      $query = $oInfoG->userAdaptor("getAllPurcases", $_SESSION['id']);
      $con = new serverConn;
      $con->connect();
      $result = $con->query_db($query);
      $con->closer();
      $data = array();
      while($row = mysql_fetch_array($result)){
        array_push($data, array(
          "id"=>$row['package_id'],
          "title"=>$row['package_name']
        ));
      }
      $jdata = json_encode($data);
      echo $jdata;
      //echo $query;
      break;

    case "getBaiscQuizInfo":
      $oInfoG = new infoGetter;
      $query = $oInfoG->userAdaptor("getBasicQuizInfo", $_SESSION['pkg_id']);
      $con = new serverConn;
      $con->connect();
      $result = $con->query_db($query);
      $con->closer();
      $row = mysql_fetch_array($result);
      $data = array(
        'package_name'=> $row['package_name'],
        'package_note'=> $row['package_note'],
        'description'=> $row['description']
      );

      $jdata = json_encode($data);
      echo $jdata;
      break;

    case "saveBasicQuizInfo":
      $oInfoS = new infoSetter;
      $packBasicData = array( 'package_name' => $_POST['package_name'],
                              'description' => $_POST['description'],
                              'package_note' => $_POST['package_note'],
                              'package_id' => $_POST['package_id']
                            );
      $query = $oInfoS->userAdaptor("saveBasicQuizInfo", $packBasicData);
      $con = new serverConn;
      $con->connect();
      $result = $con->query_db($query);
      $con->closer();
      echo $result;
      break;

    case "getAllPackageQSet":
      $oInfoG = new infoGetter;
      $query = $oInfoG->userAdaptor("getAllPackageQSet", $_SESSION['pkg_id']);
      $con = new serverConn;
      $con->connect();
      $result = $con->query_db($query);
      $con->closer();
      $data = array();
      while($row = mysql_fetch_array($result)){
        array_push($data, array(
          "question_id"=>$row['question_id'],
          "question"=>$row['question'],
          "opt1"=>$row['opt1'],
          "opt2"=>$row['opt2'],
          "opt3"=>$row['opt3'],
          "opt4"=>$row['opt4'],
          "anskey"=>$row['anskey']
        ));
      }
      $jdata = json_encode($data);
      echo $jdata;
      break;

      case "getAllQuestionToSolve":
        $oInfoG = new infoGetter;
        $query = $oInfoG->userAdaptor("getAllQuestionToSolve", $_SESSION['pkg_id']);
        $con = new serverConn;
        $con->connect();
        $result = $con->query_db($query);
        $con->closer();
        $data = array();
        while($row = mysql_fetch_array($result)){
          array_push($data, array(
            "question_id"=>$row['question_id'],
            "question"=>$row['question'],
            "opt1"=>$row['opt1'],
            "opt2"=>$row['opt2'],
            "opt3"=>$row['opt3'],
            "opt4"=>$row['opt4'],
          ));
        }
        $jdata = json_encode($data);
        echo $jdata;
        break;

    case "deleteSelectedQuestion":
      $oInfoS = new infoSetter;
      $con = new serverConn;
      $con->connect();
      if($con->query_db($oInfoS->userAdaptor("deleteSelectedQuestion", $_POST['question_id'])) == 1){
        echo "true";
      }else{
        echo "false";
      }
      $con->closer();
      break;

    case "getQuestionById":
      $oInfoG = new infoGetter;
      $query = $oInfoG->userAdaptor("getQuestionById", $_POST['question_id']);
      $con = new serverConn;
      $con->connect();
      $result = $con->query_db($query);
      $con->closer();
      if($row = mysql_fetch_array($result)){
        $data = array(
          "question_id"=>$row['question_id'],
          "question"=>$row['question'],
          "opt1"=>$row['opt1'],
          "opt2"=>$row['opt2'],
          "opt3"=>$row['opt3'],
          "opt4"=>$row['opt4'],
          "anskey"=>$row['anskey']
        );
        $jdata = json_encode($data);
        echo $jdata;
      }else{
        echo "false";
      }
      break;

    case "getQuestionVersion":
      $oInfoG = new infoGetter;
      $query = $oInfoG->userAdaptor("getQuestionVersion", $_POST['question_id']);
      $con = new serverConn;
      $con->connect();
      $result = $con->query_db($query);
      $con->closer();
      $row = mysql_fetch_array($result);
      echo  $row['version'];
      break;

    case "deletePacknQs":
      $oInfoS = new infoSetter;
      $query = $oInfoS->userAdaptor("deletePacknQs", $_POST['package_id']);
      $con = new serverConn;
      $con->connect();
      $result = $con->query_db($query);
      $con->closer();
      echo $result;
      break;

    case "unsetPackIDfromSession":
      $os->unsetPkgID();
      break;

    case "getPackNameBySPId":
      $oInfoG = new infoGetter;
      $query = $oInfoG->userAdaptor("getPackNameBySPId", $_SESSION['pkg_id']);
      $con = new serverConn;
      $con->connect();
      $result = $con->query_db($query);
      $con->closer();
      $row = mysql_fetch_array($result);
      echo $row['package_name'];
      break;

    case "getTotalQsGivenPack":
      $oInfoG = new infoGetter;
      $query = $oInfoG->userAdaptor("getTotalQsGivenPack", $_SESSION['pkg_id']);
      $con = new serverConn;
      $con->connect();
      $result = $con->query_db($query);
      $con->closer();
      $row = mysql_fetch_array($result);
      echo $row['TotalQs'];
      break;

    //case for result >>
    case "getTheResults":
      $oInfoG = new infoGetter;
      if ($_POST['the_sheet'] != ""){
        $query = $oInfoG->userAdaptor("getTheResults", $_POST['the_sheet']);
        $con = new serverConn;
        $con->connect();
        $result = $con->query_db($query);
        $con->closer();
        $i = 0;
        $row = mysql_fetch_array($result);
        //$k = count($row);
        $ans_sheet = array();
        for(;$i < count($row)-1; $i++){
          if($_POST['the_sheet'][$i][ans] == $row[$i]){
            //echo $_POST['the_sheet'][$i][q_id]." : True  >| ";
            array_push($ans_sheet, array(
              "question_id"=>$_POST['the_sheet'][$i][q_id],
              "result"=>"true",
              "correct"=>$_POST['the_sheet'][$i][ans]
            ));
          }else{
            //echo $_POST['the_sheet'][$i][q_id]." : False >| ";
            array_push($ans_sheet, array(
              "question_id"=>$_POST['the_sheet'][$i][q_id],
              "result"=>"false",
              "correct"=>$row[$i]
            ));
          }
        }

        if(count($ans_sheet) > 0){
          $j_ans_sheet = json_encode($ans_sheet);
          echo $j_ans_sheet;
        }else{
          echo "false";
        }
      }else{
        echo "null";
      }
      break;

}
