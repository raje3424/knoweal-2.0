<?PHP

//include("hello.php");
//include_once ("server.php");

include_once ("serverConnector.php");
//include_once ("sessionConn.php");
include_once ("jwtGenerator.php");

class basic extends connector{

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
    echo $value['token'];
     $jwtObj = new jwtGenerator();
     $jwt = $jwtObj->DecodeToken($value['token']);
     return $jwt;
     //print_r($jwt);
    // print_r($jwtObj.$jwttoken);
    // $query = "SELECT `info_flag` FROM `user_instance` WHERE `email` = ?";
    // $result = $this->query_db($query, md5($_SESSION['email']));
    // $result = mysqli_fetch_array($result);
    // $this->db_close();
    // return $result['info_flag'];
  }

  /* from here >> ! if want to cut ! << */

  private function userProfileAdder($value){
    $query = "INSERT INTO user_profile (full_name, email, dob, sex) VALUES(?, ?, ?, ?)";
    $result = $this->query_db($query, $value);
    $this->db_close();
    if($result == 1){
      return "true";
    }else{
      return "false";
    }
  }

  private function updateInstanceToO(){
    $query = "UPDATE `user_instance` SET `info_flag` = 1 WHERE `email` = ?";
    $result = $this->query_db($query, md5($_SESSION['email']));
    $this->db_close();
    return $result;
  }

  private function updateInstanceToX(){
    $query = "UPDATE `user_instance` SET `info_flag` = 0 WHERE `email` = ?";
    $result = $this->query_db($query, md5($_SESSION['email']));
    $this->db_close();
    return $result;
  }

  private function sessionEmailGetter(){
    $osx = new sessionExr();
    return $osx->getSessionEmail();
  }

  private function getOuter(){
    //console.log("getouter");
    $osx = new sessionExr;
    $ret = $osx->destroy();
    return $ret;
  }

  private function isEmailSessionValid(){
    if(isset($_SESSION['email'])){ //Here code Updated
      if($_SESSION['email'] != null || $_SESSION['email'] != "" || $_SESSION['email'] != " "){
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

  private function getUserId(){
    console.log("getUserId");
    if($this->isEmailSessionValid()){
      if($this->db_connection() == "true"){
        $query = "SELECT `user_id` FROM `user_profile` WHERE `email`= ?";
        $result = $this->query_db($query, $_SESSION['email']);
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

  private function setIDToSession($value){
    $osx = new sessionExr;
    $ret = $osx->sessionIDSetter($value);
    return $ret;
  }

  private function getIDFromSession(){
    $osx = new sessionExr;
    $ret = $osx->getSessionID();
    return $ret;
  }

}

?>
