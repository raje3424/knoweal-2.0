<?PHP
/*
**
** <<RDM>> 24 08 2015
** Library functions for CleaverFox
** dependencies :: 16
** |
** |-- serverConnector[.]php for db connection
** |-- sessionConn[.]php for session handling
** ~~~
**
*/
include_once("serverConnector.php");
include_once ("jwtGenerator.php");

class library extends connector{
  protected $response = array();

  public function userAdaptor($operation, $value){
    if($value == "" || $value == " " || $value == NULL){
      return $this->$operation();
    }else{
      return $this->$operation($value);
    }
  }

  //Add,Delete,Update,Select and related dependencies of question_table
  private function addQuestion($value){
    $val = array('question' => $value['question'],'opt1'=>$value['opt1'],'opt2'=>$value['opt2'],'opt3'=>$value['opt3'],'opt4'=>$value['opt4'],'anskey'=>$value['anskey'],'packID'=>$value['packID'] );
    $query = "INSERT INTO question_table (question, opt1, opt2, opt3, opt4, anskey, package_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $result = $this->query_db($query, $val);
    $lID = $this->conn->insert_id;
    $this->db_close();
    if($result == 1){
      $response['response'] = "true";
      $response['errMessage'] = "";
      $response['lid']=$lID;
      return $response;
    //  return $lID;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = "cant add questions";
      return $response;
    }
  }

  private function updateQuestion($value){
    $this->clearOldResponseData();
    $version = $this->getQuestionVersion($value['question_id']);
    $version++;
    //echo "Version >>>>".$version."<<<";
    $value = $this->insertBeforeKey($value, 'version', $version, 'question_id');
    //$value['version']=$version;
    //print_r($value);
    $res = $this->db_connection();
    if(res){
      $query = "UPDATE `question_table` SET `question` = ?, `opt1` = ?, `opt2` = ?, `opt3` = ?, `opt4` = ?, `anskey` = ?, `version` = ? WHERE question_id = ?";
      $result = $this->query_db($query, $value);
      $this->db_close();
      if($result == 1){
        $response['response'] = "true";
        $response['errMessage'] = "";
        return $response;
      }else{
        $response['response'] = "false";
        $response['errMessage'] = "question update failed";
        return $response;
      }
    }else{
      echo "falseCX";
    }
  }

  private function questionGetter($value){ //Here it accepts package_id
    $this->clearOldResponseData();
    $query = "SELECT `question`, `opt1`, `opt2`, `opt3`, `opt4` FROM `question_table` WHERE package_id = ?";
    $data = array();
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result != ""){
      $response['response'] = "true";
      $response['errMessage'] = "";
      $response['result'] = json_encode($result);
      return $response;
    //  return json_encode($result);
    }else{
      $response['response'] = "false";
      $response['errMessage'] = "cant get question";
      return $response;
    }
  }

  private function deleteQuestion($value){ //Here it accepts question_id
     $this->clearOldResponseData();
      $query = "Delete FROM `question_table` WHERE question_id = ?";
      $result = $this->query_db($query,$value);
      $this->db_close();
      if($result){
        $response['response'] = "true";
        $response['errMessage'] = "";
        return $response;
      }else{
        $response['response'] = "false";
        $response['errMessage'] = "can't delete question";
        return $response;
      }
  }

  private function getQuestionVersion($value){
    $this->clearOldResponseData();
    $query = "SELECT `version` FROM question_table WHERE question_id = ?";
    $result = $this->query_db($query,$value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result){
      $response['response'] = "true";
      $response['errMessage'] = "";
      $response['result'] = $result['version'];
      return $response;
    }else{
        $response['response'] = "false";
        $response['errMessage'] = "can't get version";
        return $response;
      }
  }

//Add,Delete,Update,Select and related dependencies of Package
  private function addPackage($value){
    $this->clearOldResponseData();
    $jwtObj = new jwtGenerator();
    $jwt = json_decode(json_encode($jwtObj->DecodeToken(json_decode($value['token']))),true);

    $end_date = date('Y-m-d H:i:s',strtotime('+1 years'));
    $package_author = $jwt['data']['userid'];
    //print_r($package_author);
    //$retVal = $this->insertBeforeKey($value, 'author_id', 'packNotes');
    $retVal = array('packName'=>$value['packName'],'packNotes'=>$value['packNotes'],'packDescription'=>$value['packDescription'],'package_author'=>$package_author,'valid_till'=>$end_date);
    $query = "INSERT INTO packages (package_name, package_note, description,package_author,valid_till) VALUES (?,?,?,?,?)";
    $result = $this->query_db($query, $retVal);
    $this->db_close();
    //echo $result;
    if($result == 1){
      $response['response'] = "true";
      $response['errMessage'] = "";
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = "Something is wrong";
      return $response;
    }
  }

  private function getRecentPackId($value){
    $this->clearOldResponseData();
    $jwtObj = new jwtGenerator();
    $jwt = json_decode(json_encode($jwtObj->DecodeToken(json_decode($value['token']))),true);
    $val = array('package_name' =>$value['packName'] ,'package_author'=> $jwt['data']['userid'] );
    $query = "SELECT `package_id` FROM `packages` WHERE package_name = ? AND package_author = ?";
    //$value['authorId'] = $jwt['data']['userid'];
    $result = $this->query_db($query, $val);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result != ""){
    $response['response'] = "true";
    $response['packID'] =$result['package_id'];
    return $response;
  }else{
    $response['response'] = "false";
    $response['errMessage'] = "Something is wrong";
    return $response;
  }
}

  private function updatePackage($value){
    $this->clearOldResponseData();
    $version = $this->getPackageVersion($value['package_id']);
    $version++;
    $value = $this->insertBeforeKey($value, 'package_version', $version, 'packNotes');
    $time = $this->getCurrentTimestamp();
    $value = $this->insertBeforeKey($value, 'last_edit_on',$time , 'packNotes');
    $res = $this->db_connection();
    if($res){
      $query = "UPDATE `packages` SET `package_name` = ?, `package_version` = ?,`last_edit_on` = ?, `package_note` = ?, `description` = ? WHERE `package_id` = ?";
      $result = $this->query_db($query, $value);
      $this->db_close();
      if($result == 1){
        $response['response'] = "true";
        $response['errMessage'] = "";
        return $response;
      }else{
        $response['response'] = "false";
        $response['errMessage'] = "package not updated";
        return $response;
      }
    }else{
      echo "falseCX";
    }
  }

  private function deletePackage($value){
    $this->clearOldResponseData();
    $query = "DELETE FROM packages WHERE package_id = ?";
    $result = $this->query_db($query,$value);
    $this->db_close();
    if($result){
      $response['response'] = "true";
      $response['errMessage'] = "";
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = "Something is wrong";
      return $response;
    }
  }

  private function viewAllPackages(){
    // works for store >> ! <<
    $this->clearOldResponseData();
    $retVal = [];
    $query = "SELECT `package_id`, `package_name`, `full_name`, `description` FROM packages a, user_profile b WHERE `package_author` != ? and a.package_author = b.user_id";
    $jwtObj = new jwtGenerator();
    $jwt = json_decode(json_encode($jwtObj->DecodeToken(json_decode($value['token']))),true);
    $vals['user_id'] = $jwt['data']['userid'];
    // $vals['user_id_s'] = $_SESSION['id'];
    $result = $this->query_db($query, $vals);
    while($row = mysqli_fetch_array($result)){
      array_push($retVal, array(
        "package_id" => $row['package_id'],
        "package_name" => $row['package_name'],
        "author_name" => $row['full_name'],
        "description" => $row['description'],
      ));
    }
    $this->db_close();
    if($retVal != ""){
      $response['response'] = "true";
      $response['errMessage'] = "";
      //  $response['result'] = $retVal;
     $response['result'] = json_encode($retVal);
    }else{
      $response['response'] = "false";
      $response['errMessage'] = "Something is wrong";
      return $response;
    }
  }

  private function viewOwnPackages($value){
    $this->clearOldResponseData();
    $jwtObj = new jwtGenerator();
    $jwt = json_decode(json_encode($jwtObj->DecodeToken(json_decode($value['token']))),true);
    $vals['user_id'] = $jwt['data']['userid'];
    $retVal = [];
    $query = "SELECT `package_id`, `package_name`, `description` FROM `packages` WHERE `package_author` = ?";
    $result = $this->query_db($query, $vals['user_id']);
    $i = 0;
    while($row = mysqli_fetch_array($result)){
      array_push($retVal, array(
        "package_id" => $row['package_id'],
        "package_name" => $row['package_name'],
        "description" => $row['description']
      ));
    }
    $this->db_close();
    if($result != ""){
      $response['response'] = "true";
      $response['errMessage'] = "";
      $response['result'] = $retVal;
    //  $response['result'] = json_encode($retVal);
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = "Something is wrong";
      return $response;
    }
  }

  private function getPackageVersion($value){
    $this->clearOldResponseData();
    $query = "SELECT `package_version` FROM packages WHERE package_id = ?";
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
      if($result != ""){
    $response['response'] = "true";
    $response['errMessage'] = "";
    $response['result'] = $result['package_version'];
    return $response;
  }
  else{
    $response['response'] = "false";
    $response['errMessage'] = "Something is wrong";
    return $response;
  }
}

//Add,Delete,Update,Select and related dependencies of Store

  private function addPurchasePackage($value){
    $this->clearOldResponseData();
    $jwtObj = new jwtGenerator();
    $jwt = json_decode(json_encode($jwtObj->DecodeToken(json_decode($value['token']))),true);
    $vals['user_id'] = $jwt['data']['userid'];

    $newAr = [
      'user_id' => $vals['user_id'],
      'pkg_id' => $value['pkg_id']
    ];
    $query = "INSERT INTO purchase_table(user_id, pack_id)VALUES(?, ?)";
    $result = $this->query_db($query, $newAr);
    $this->db_close();
    if($result == 1){
      $response['response'] = "true";
      $response['errMessage'] = '';
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = 'Something is wrong';
      return $response;
    }
  }

  private function displayPurchasePackage($value){
    // lib function to show all the purchased packages >> ! <<
    $this->clearOldResponseData();
    $jwtObj = new jwtGenerator();
    $jwt = json_decode(json_encode($jwtObj->DecodeToken(json_decode($value['token']))),true);
    $vals['user_id'] = $jwt['data']['userid'];
    $retVal = [];
    $res = $this->db_connection();
    if($res){
      $query = "SELECT `package_id`, `package_name`, `full_name`, `description` from packages pkt, user_profile upt, purchase_table put WHERE put.user_id = ? and pkt.package_id = put.pack_id and pkt.package_author = upt.user_id";
      $result = $this->query_db($query, $vals['user_id']);
      while ($row = mysqli_fetch_array($result)) {
        array_push($retVal, array(
          "package_id" => $row['package_id'],
          "package_name" => $row['package_name'],
          "package_author" => $row['full_name'],
          "description" => $row['description']
        ));
      }
      $this->db_close();
      if($row == 1){
        $response['response'] = "true";
        $response['errMessage'] = '';
        //$response['result'] = $retVal;
        $response['result']= json_encode($retVal);
        return $response;
        //return json_encode($retVal);
      }else{
        $response['response'] = "false";
        $response['errMessage'] = 'Something is wrong';
        return $response;
      }
    }else{
      echo "Db Connection lost";
    }
  }

  private function checkIfPur($value){
    $this->clearOldResponseData();
    $jwtObj = new jwtGenerator();
    $jwt = json_decode(json_encode($jwtObj->DecodeToken(json_decode($value['token']))),true);
    $value['user_id'] = $jwt['data']['userid'];
    //$value['user_id'] = $_SESSION['id'];
    $query = "SELECT `tans_id` FROM `purchase_table` WHERE pack_id = ? and user_id = ?";
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result != ""){
      $response['response'] = "true";
      $response['errMessage'] = '';
      $response['tans_id'] = $result['tans_id'];
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = 'Something is wrong';
      return $response;
    }
  }

  private function getPackageInfoStore($value){
    $this->clearOldResponseData();
    // store function to browse the package in detail
    $query = "SELECT `package_name`,`description`, `full_name` FROM packages a, user_profile b WHERE package_id = ? and a.package_author = b.user_id";
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result != ""){
      $retVal = [
        "author_name" => $result['full_name'],
        "packName" => $result['package_name'],
        "description" => $result['description']
      ];
      $response['response'] = "true";
      $response['errMessage'] = '';
      $response['result'] = json_encode($retVal);
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = 'Something is wrong';
      return $response;
    }
  }

  private function getPur_PackageInfo($value){
    $this->clearOldResponseData();
    $query = "SELECT `package_name`,`description`, `package_note`, `full_name` FROM packages a, user_profile b WHERE package_id = ? and a.package_author = b.user_id";
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result != ""){
      $retVal = [
        "author_name" => $result['full_name'],
        "packName" => $result['package_name'],
        "packDescription" => $result['description'],
        "packNotes" => $result['package_note']
      ];
      $response['response'] = "true";
      $response['errMessage'] = '';
      $response['result'] = json_encode($retVal);
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = 'Something is wrong';
      return $response;
    }
  }

  private function getPackageInfo($value){
    $this->clearOldResponseData();
    $query = "SELECT `package_name`,`description`,`package_note` FROM packages WHERE package_id = ?";
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result != ""){
      $response['response'] = "true";
      $response['errMessage'] = '';
      $response['result'] = json_encode($result);
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = 'Something is wrong';
      return $response;
    }
  }

  private function getQuestionsToSolve($value){
      $this->clearOldResponseData();
    // get questions to solve >>
    $retVal = [];
    $query = "SELECT `question_id`,`question`,`opt1`,`opt2`,`opt3`,`opt4` FROM question_table WHERE package_id = ?";
    $result = $this->query_db($query, $value);
    while($row = mysqli_fetch_array($result)){
        array_push($retVal, array(
            "q_id" => $row['question_id'],
            "question" => $row['question'],
            "opt1" => $row['opt1'],
            "opt2" => $row['opt2'],
            "opt3" => $row['opt3'],
            "opt4" => $row['opt4'],
            "rkie" => " "
          ));
    }
    $this->db_close();
    if($retVal != ""){
      $response['response'] = "true";
      $response['errMessage'] = '';
      $response['result'] = json_encode($retVal);
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = 'Something is wrong';
      return $response;
    }
  }

  private function getPackageQuestions($value){
    $this->clearOldResponseData();
    $retVal = [];
    $query = "SELECT `question_id`,`question`,`opt1`,`opt2`,`opt3`,`opt4`,`anskey` FROM question_table WHERE package_id = ?";
    $result = $this->query_db($query, $value);
    while($row = mysqli_fetch_array($result)){
        array_push($retVal, array(
            "q_id" => $row['question_id'],
            "question" => $row['question'],
            "opt1" => $row['opt1'],
            "opt2" => $row['opt2'],
            "opt3" => $row['opt3'],
            "opt4" => $row['opt4'],
            "anskey" => $row['anskey']
          ));
    }
    $this->db_close();
    if($retVal != ""){
      $response['response'] = "true";
      $response['errMessage'] = '';
      $response['result'] = json_encode($retVal);
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = 'Something is wrong';
      return $response;
    }
  }

  private function getTheResults($value){
    $this->clearOldResponseData();
    $checkAgainst = [];
    $retVal = [];
    $query = "SELECT `question_id`, `anskey` FROM question_table WHERE package_id = ?";
    $result = $this->query_db($query, $value[sizeof($value) - 1]['pkg_id']);
    while ($row = mysqli_fetch_array($result)) {
      array_push($checkAgainst, array(
        "q_id" => $row['question_id'],
        "anskey" => $row['anskey']
      ));
    }

    for($i = 0; $i < sizeof($value) - 1; $i++){
      for($j = 0; $j < sizeof($checkAgainst); $j++){
        if($checkAgainst[$j]['q_id'] === $value[$i]['q_id']){
          if($value[$i]['anskey'] === $checkAgainst[$j]['anskey']){
            array_push($retVal, array(
              "q_id" => $value[$i]['q_id'],
              "rkie" => "true"
            ));
          }else{
            array_push($retVal, array(
              "q_id" => $value[$i]['q_id'],
              "rkie" => $checkAgainst[$j]['anskey']
            ));
          }
          break;
        }else{
          continue;
        }
      }
    }

    if(sizeof($retVal) > 0){
      $response['response'] = "true";
      $response['errMessage'] = '';
      $response['result'] = json_encode($retVal);
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = 'Something is wrong';
      return $response;
    }

  }

  private function purchasePackageId($value){
    $this->clearOldResponseData();
    $query = "SELECT `pack_id` FROM purchase_table WHERE user_id = ?";
    $result = $this->query_db($query,$value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    $response['response'] = "true";
    $response['errMessage'] = '';
    $response['result'] = $result['pack_id'];
    return $response;
    //return $result['pack_id'];
  }

  private function getAllPurchaseList($value){
    $this->clearOldResponseData();
    $purList = array();
    $query = "SELECT `pack_id` FROM purchase_table WHERE user_id = ?";
    $result = $this->query_db($query,$value);
    $i = 0;
    while($row = mysqli_fetch_array($result)){
      $purList[$i] = $row['pack_id'];
      $i++;
    }
    $this->db_close();
    $response['response'] = "true";
    $response['errMessage'] = '';
    $response['result'] = $purList;
    return $response;
  }

  //Common dependencies ....
  private function getCurrentTimestamp(){
    date_default_timezone_set('Asia/Calcutta');
    return date("Y-m-d H:i:s",time());
  }

  private function insertBeforeKey($oldArray, $newKey, $newValue, $followingKey) {
    $this->clearOldResponseData();
      $newArray = array ();
      foreach (array_keys($oldArray) as $k) {
          if ($k == $followingKey)
              $newArray[$newKey] = $newValue;
          $newArray[$k] = $oldArray [$k];
      }
      $response['response'] = "true";
      $response['errMessage'] = '';
      $response['result'] = $newArray;
      return $response;
  }

  public function addToArray($index, $value, $targetArray){
    $this->clearOldResponseData();
    //echo "index >> ".$index." | value >> ".$value." <br/>\n<br/>\n";
    $retVal;
    for($i = 0, $j = 0; $i < sizeof($targetArray) + 1; $i++, $j++){
      if($i == $index){
        $retVal[$i] = $value;
        $j = $i - 1;
      }else{
        $retVal[$i] = $targetArray[$j];
      }
    }
    $response['response'] = "true";
    $response['errMessage'] = '';
    $response['result'] = $retVal;
    return $response;
  }

  public function clearOldResponseData(){
    unset($response);
    $response = array();
  }
}

error_reporting( E_ALL );

?>
