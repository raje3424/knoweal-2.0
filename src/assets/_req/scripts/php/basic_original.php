<?PHP
/*
**
** <<RDM>> 20 08 2015
** basic function for CleaverFox
** dependencies :: 2
** |
** |-- serverConnector[.]php for db connection
** |-- sessionConn[.]php for session handling
** ~~~
**
*/

include("serverConnector.php");
include("sessionConn.php");
class basic extends connector{

  private function sayHI(){
    echo "HI";
  }

  public function userAdaptor($operation, $value){
    echo "User adaptor <br/>\nsize ".sizeof($value)." operation >> ".$operation."<< ";
    if($value == "" || $value == " " || $value == NULL){
      return $this->$operation();
    }else{
      return $this->$operation($value);
    }
  }

  private function checkIfEmailExists($value){
    // get email from user instance where email == $value
    $query = "SELECT `email` FROM `user_instance` WHERE `email`= ?";
    $result = $this->query_db($query, $value);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result == ""){
      return "false";
    }else{
      return "true";
    }
  }

  private function getUserInstanceStatus(){
    $query = "SELECT `info_flag` FROM `user_instance` WHERE `email` = ?";
    $result = $this->query_db($query, md5($_SESSION['email']));
    $result = mysqli_fetch_array($result);
    $this->db_close();
    return $result['info_flag'];
  }

  private function saveUserProfile($value){
    $query = "INSERT INTO user_profile (full_name, email, dob, sex) VALUES(?, ?, ?, ?)";
    $result = $this->query_db($query, $value);
    if($result == 1){
      return "true";
    }else{
      return "false";
    }
  }

  private function updateInstanceToO(){
    $query = "UPDATE user_instance SET info_flag = 1 WHERE email = ?";
    $result = $this->query_db($query, md5($_SESSION['email']));
    return $result;
  }

  private function updateInstanceToX(){
    $query = "UPDATE user_instance SET info_flag = 0 WHERE email = ?";
    $result = $this->query_db($query, md5($_SESSION['email']));
    return $result;
  }

  private function sessionEmailSetter($value){
    $osx = new sessionExr();
    return $osx->sessionEmailSetter($value);
  }

  private function emailSessionUpdate($value){
    $osx = new sessionExr();
    return $osx->sessionEmailUpdate($value);
  }

  private function sessionEmailGetter(){
    $osx = new sessionExr();
    return $osx->getSessionEmail();
  }

  private function sessionIDSetter($value){
    $osx = new sessionExr();
    return $osx->sessionIDSetter($value);
  }

  private function sessionIDUpdater($value){
    $osx = new sessionExr();
    return $osx->sessionIDUpdate($value);
  }

  private function sessionIDGetter(){
    $osx = new sessionExr();
    return $osx->getSessionID();
  }

  private function session_destroy(){
    $osx = new sessionExr();
    return $osx->destroy();
  }

}

/*echo "<h2>basic</h2><br/>\n--------------------------<br/>\n";
$ob = new basic();
$result = $ob->userAdaptor("sessionIDSetter","12");
echo "Result >> ".$result." << <br/>\n";
$result = $ob->userAdaptor('sessionIDGetter');
echo "Result >> ".$result." << <br/>\n";
$result = $ob->userAdaptor('sessionIDUpdater', '8');
echo "Result >> ".$result." << <br/>\n";
$result = $ob->userAdaptor('sessionIDGetter');
echo "Result >> ".$result." << <br/>\n";

$result = $ob->userAdaptor('session_destroy');
echo "Result >> ".$result." !!! e: ".$_SESSION['email']."| i: ".$_SESSION['id']."| ";*/
?>
