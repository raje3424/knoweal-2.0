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
include_once ("server.php");
//include_once("serverConnector.php");
//include_once ("sessionConn.php");

class library extends Server{

  public function userAdaptor($operation, $value){
    if($value == "" || $value == " " || $value == NULL){
      return $this->$operation();
    }else{
      return $this->$operation($value);
    }
  }

  //Add,Delete,Update,Select and related dependencies of question_table
  private function addQuestion($value){
    $query = "INSERT INTO question_table (question, opt1, opt2, opt3, opt4, anskey, package_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $result = $this->query_db($query, $value);
    $lID = $this->conn->insert_id;
    $this->db_close();
    if($result == 1){
      return $lID;
    }else{
      return "false";
    }
  }

  private function updateQuestion($value){
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
        return "true";
      }else{
        return "false";
      }
    }else{
      echo "falseCX";
    }
  }

  private function questionGetter($value){ //Here it accepts package_id
    $query = "SELECT `question`, `opt1`, `opt2`, `opt3`, `opt4` FROM `question_table` WHERE package_id = ?";
    $data = array();
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result != ""){
      return json_encode($result);
    }else{
      return "false";
    }
  }

  private function deleteQuestion($value){ //Here it accepts question_id
      $query = "Delete FROM `question_table` WHERE question_id = ?";
      $result = $this->query_db($query,$value);
      $this->db_close();
      if($result){
        return "true";
      }else{
        return "false";
      }
  }

  private function getQuestionVersion($value){
    $query = "SELECT `version` FROM question_table WHERE question_id = ?";
    $result = $this->query_db($query,$value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    return $result['version'];
  }

//Add,Delete,Update,Select and related dependencies of Package
  private function addPackage($value){
    $retVal = $this->insertBeforeKey($value, 'author_id', $_SESSION['id'], 'packNotes');
    $query = "INSERT INTO packages (package_name, package_author, package_note, description) VALUES (?,?,?,?)";
    $result = $this->query_db($query, $retVal);
    $this->db_close();
    //$result = 1;
    if($result == 1){
      return "true";
    }else{
      return "false";
    }
  }

  private function getRecentPackId($value){
    $query = "SELECT `package_id` FROM `packages` WHERE package_name = ? AND package_author = ?";
    $value['authorId'] = $_SESSION['id'];
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    return $result['package_id'];
  }

  private function updatePackage($value){
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
        return "true";
      }else{
        return "false";
      }
    }else{
      echo "falseCX";
    }
  }

  private function deletePackage($value){
    $query = "DELETE FROM packages WHERE package_id = ?";
    $result = $this->query_db($query,$value);
    $this->db_close();
    if($result){
      return "true";
    }else{
      return "false";
    }
  }

  private function viewAllPackages(){
    // works for store >> ! <<
    $retVal = [];
    $query = "SELECT `package_id`, `package_name`, `full_name`, `description` FROM packages a, user_profile b WHERE `package_author` != ? and a.package_author = b.user_id";
    $vals['user_id'] = $_SESSION['id'];
    $vals['user_id_s'] = $_SESSION['id'];
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
      return json_encode($retVal);
    }else{
      return "false";
    }
  }



  private function viewOwnPackages(){
    $retVal = [];
    $query = "SELECT `package_id`, `package_name`, `description` FROM `packages` WHERE `package_author` = ?";
    $result = $this->query_db($query, $_SESSION['id']);
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
      return json_encode($retVal);
    }else{
      return "false";
    }
  }

  private function getPackageVersion($value){
    $query = "SELECT `package_version` FROM packages WHERE package_id = ?";
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    return $result['package_version'];
  }

//Add,Delete,Update,Select and related dependencies of Store

  private function addPurchasePackage($value){
    $newAr = [
      'user_id' => $_SESSION['id'],
      'pkg_id' => $value
    ];
    $query = "INSERT INTO purchase_table(user_id, pack_id)VALUES(?, ?)";
    $result = $this->query_db($query, $newAr);
    $this->db_close();
    if($result == 1){
      return "true";
    }else{
      return "false";
    }

  }

  private function displayPurchasePackage(){
    // lib function to show all the purchased packages >> ! <<
    $retVal = [];
    $res = $this->db_connection();
    if($res){
      $query = "SELECT `package_id`, `package_name`, `full_name`, `description` from packages pkt, user_profile upt, purchase_table put WHERE put.user_id = ? and pkt.package_id = put.pack_id and pkt.package_author = upt.user_id";
      $result = $this->query_db($query, $_SESSION['id']);
      while ($row = mysqli_fetch_array($result)) {
        array_push($retVal, array(
          "package_id" => $row['package_id'],
          "package_name" => $row['package_name'],
          "package_author" => $row['full_name'],
          "description" => $row['description']
        ));
      }
      $this->db_close();
      if($retVal != ""){
        return json_encode($retVal);
      }else{
        return "false";
      }
    }else{
      echo "Db Connection lost";
    }
  }

  private function checkIfPur($value){
    $value['user_id'] = $_SESSION['id'];
    $query = "SELECT `tans_id` FROM `purchase_table` WHERE pack_id = ? and user_id = ?";
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result != ""){
      return $result['tans_id'];
    }else{
      return false;
    }
  }

  private function getPackageInfoStore($value){
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
      return json_encode($retVal);
    }else{
      return "false";
    }
  }

  private function getPur_PackageInfo($value){
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
      return json_encode($retVal);
    }else{
      return "false";
    }
  }

  private function getPackageInfo($value){
    $query = "SELECT `package_name`,`description`,`package_note` FROM packages WHERE package_id = ?";
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result != ""){
      return json_encode($result);
    }else{
      return "false";
    }
  }

  private function getQuestionsToSolve($value){
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
      return json_encode($retVal);
    }else{
      return "false";
    }
  }

  private function getPackageQuestions($value){
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
      return json_encode($retVal);
    }else{
      return "false";
    }
  }

  private function getTheResults($value){
    // complete it >> ! <<
    // work on this >> ! <<
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
      return json_encode($retVal);
    }else{
      return "false";
    }

  }

  private function purchasePackageId($value){
    $query = "SELECT `pack_id` FROM purchase_table WHERE user_id = ?";
    $result = $this->query_db($query,$value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    return $result['pack_id'];
  }

  private function getAllPurchaseList($value){
    $purList = array();
    $query = "SELECT `pack_id` FROM purchase_table WHERE user_id = ?";
    $result = $this->query_db($query,$value);
    $i = 0;
    while($row = mysqli_fetch_array($result)){
      $purList[$i] = $row['pack_id'];
      $i++;
    }
    $this->db_close();
    return $purList;
  }

  //Common dependencies ....
  private function getCurrentTimestamp(){
    date_default_timezone_set('Asia/Calcutta');
    return date("Y-m-d H:i:s",time());
  }

  private function insertBeforeKey($oldArray, $newKey, $newValue, $followingKey) {
      $newArray = array ();
      foreach (array_keys($oldArray) as $k) {
          if ($k == $followingKey)
              $newArray[$newKey] = $newValue;
          $newArray[$k] = $oldArray [$k];
      }
      return $newArray;
  }

  // the function below is a cutya function and to be deleted if found guilty >>
  public function addToArray($index, $value, $targetArray){
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
    return $retVal;
  }

}



/*
echo "Hello library !!<br/>\n";
$oLib = new library;
$arvalue = ['exapmles', 'description', 'notes are here'];
$retval = $oLib->userAdaptor('viewOwnPackages');
echo "retval >> ".$retval." <<::";
*/

?>
