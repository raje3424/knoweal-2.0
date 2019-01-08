<?PHP
/*
**
** <<RDM>> 20 08 2015
** profile function for CleaverFox
** dependencies :: 2
** |
** |-- serverConnector[.]php for db connection
** |-- sessionConn[.]php for session handling
** ~~~
**
*/

//include_once ("server.php");
include_once ("serverConnector.php");
include_once ("sessionConn.php");

class profile extends connector{

  public function userAdaptor($operation, $value){
    if($value == "" || $value == "" || $value == NULL){
      return $this->$operation();
    }else{
      return $this->$operation($value);
    }
  }

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

  private function userProfileGetter(){
    $query = "SELECT `full_name`, `email`, `dob`, `sex` FROM `user_profile` WHERE `email` = ?";
    $result = $this->query_db($query, $_SESSION['email']);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    if($result != ""){
      return json_encode($result);
    }else{
      return "false";
    }
  }

  private function userProfileUpdater($value){
    $query = "UPDATE `user_profile` SET full_name = ?, dob = ?, sex = ? WHERE email = ?";
    //echo "value size before >> ".sizeof($value)."<< \n";
    $value['email'] = $_SESSION['email'];
    //echo "value size after >> ".sizeof($value)."<< \n";
    $result = $this->query_db($query, $value);
    $this->db_close();
    if($result == 1){
      return "true";
    }else{
      return "false";
    }
  }

}
?>
