<?PHP

include_once ("serverConnector.php");
//include_once ("sessionConn.php");
include_once ("jwtGenerator.php");

class basic extends connector{

  protected $response = array();

  public function userAdaptor($operation, $value){
    //echo "\nOperation >> ".$operation." << value >> ".$value['email'];
    if($value == "" || $value == " " || $value == NULL){
      return $this->$operation();
    }else{
      return $this->$operation($value);
    }
  }

  private function checkIfEmailExists($value){
    // get email from user instance where email == $value
    $query = "SELECT `email` FROM `user_instance` WHERE `email`= ?";
    //echo vsprintf( str_replace("?","'%s'",$query),$value);
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    //echo "email : ".$result['email'];
    $this->db_close();
    if(!isset($result['email'])){
      return "false";
    }else{
      return "true";
    }
  }

  private function getUserInstanceStatus($value){
    $this->clearOldResponseData();
    //echo $value['token'];
    $jwtObj = new jwtGenerator();
    $jwt = json_decode(json_encode($jwtObj->DecodeToken(json_decode($value['token']))),true);
    //print_r($jwt);
    //echo $jwt['data']['email']; // working
    if (isset($jwt)) {
      $query = "SELECT `info_flag` FROM `user_instance` WHERE `email` = ?";
      $result = $this->query_db($query, md5($jwt['data']['email']));
      $result = mysqli_fetch_array($result);
      $this->db_close();
      //return $result['info_flag'];
      $response['response'] = "true";
      $response['errMessage'] = "";
      $response['infoFlag'] = $result['info_flag'];
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = "Token is empty";
      return $response;
    }


  }

  /* from here >> ! if want to cut ! << */

  private function userProfileAdder($value){
    $this->clearOldResponseData();
    $query = "INSERT INTO user_profile (full_name, email, dob, sex) VALUES(?, ?, ?, ?)";
    $result = $this->query_db($query, $value);
    $this->db_close();
    if($result == 1){
      return "true";
    }else{
      return "false";
    }
  }

  private function updateInstanceToO($value){
    $this->clearOldResponseData();
    $query = "UPDATE `user_instance` SET `info_flag` = 1 WHERE `email` = ?";
    $result = $this->query_db($query, md5($value['email']));
    $this->db_close();
    return $result;
  }

  private function updateInstanceToX($value){
    $this->clearOldResponseData();
    $query = "UPDATE `user_instance` SET `info_flag` = 0 WHERE `email` = ?";
    $result = $this->query_db($query, md5($value['email']));
    $this->db_close();
    return $result;
  }

  private function sessionEmailGetter($value){
    $this->clearOldResponseData();
    $jwtObj = new jwtGenerator();
    $jwt = $jwtObj->DecodeToken($value['token']);
    echo $jwt;

    if ($value['email']!=""){
      return true;
    }else{
      return false;
    }
    // $osx = new sessionExr();

  }

  private function getOuter(){
    //console.log("getouter");
    // $osx = new sessionExr;
    // $ret = $osx->destroy();
    // return $ret;
  }

  private function isEmailSessionValid($value){
    if(isset($value['email'])){ //Here code Updated
      if($value['email'] != null || $value['email'] != ""){
      return "true";
      }else{
        return "false";
      }
    }else{
      return "false";
    }
  }

  private function isIDSessionValid(){
    if(isset($_SESSION['id']) && $_SESSION['id'] != "" && $_SESSION['id'] != " "){
      return "true";
    }else{
      return "false";
    }
  }

  private function getUserId($value){
    if($this->isEmailSessionValid()){
      if($this->db_connection() == "true"){
        $query = "SELECT `user_id` FROM `user_profile` WHERE `email`= ?";
        $result = $this->query_db($query, $value['email']);
        $result = mysqli_fetch_array($result);
        $this->db_close();
        $result = $result['user_id'];
      }else{
        $result = "false";
      }
    }else{
      $result = "false";
    }
    return $result;
  }

  // private function setIDToSession($value){
  //   $osx = new sessionExr;
  //   $ret = $osx->sessionIDSetter($value);
  //   return $ret;
  // }
  //

  private function getIDFromSession($value){
    $this->clearOldResponseData();

    if($value['email']!=""){
      return true;
    }else{
      return false;
    }
    // $osx = new sessionExr;
    // $ret = $osx->getSessionID();
    // return $ret;
  }

  public function clearOldResponseData(){
    unset($response);
    $response = array();
  }

}
error_reporting( E_ALL );
ini_set('display_errors', 1);

?>
