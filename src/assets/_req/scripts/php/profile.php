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

include_once ("serverConnector.php");
include_once ("jwtGenerator.php");

class profile extends connector{
  protected $response = array();

  public function userAdaptor($operation, $value){
    if($value == "" || $value == "" || $value == NULL){
      return $this->$operation();
    }else{
      return $this->$operation($value);
    }
  }

  private function userProfileAdder($value){
    $this->clearOldResponseData();
    $val = array('fullName' =>$value['fullName'] ,'email'=>$value['email'],'dob'=>$value['dob'],'sex'=>$value['gender'] );
    $this->clearOldResponseData();
    $query = "INSERT INTO user_profile (full_name, email, dob, sex) VALUES(?, ?, ?, ?)";
    $result = $this->query_db($query, $val);
    $this->db_close();
    //print_r($result);
    //echo "result : " .$result;
    if($result == 1){
      $response['response'] = "true";
      $response['errMessage'] = "Profile updated successfully";
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = "Cant update Profile";
      return $response;
    }
  }

  private function userProfileGetter($value){
    $this->clearOldResponseData();
    $jwtObj = new jwtGenerator();
    $jwt = json_decode(json_encode($jwtObj->DecodeToken(json_decode($value['token']))),true);

    $query = "SELECT `full_name`, `email`, `dob`, `sex` FROM `user_profile` WHERE `email` = ?";
    $result = $this->query_db($query, $jwt['data']['email']);
    $result = mysqli_fetch_array($result);
    $this->db_close();
    //print_r($result);
    if($result != ""){
      $response['fullName']=$result[0];
      $response['email']=$result[1];
      $response['sex']=$result[3];
      $response['dob']=$result[2];
      $response['response'] = "true";
      $response['errMessage'] = "Got User profile ";
      //return json_encode($result);
      return $response;
    }else{
      $response['response'] = "false";
      $response['errMessage'] = "Cant get user profile";
      return $response;
    }
  }

  private function userProfileUpdater($value){
    $this->clearOldResponseData();
    $jwtObj = new jwtGenerator();
    $jwt = json_decode(json_encode($jwtObj->DecodeToken(json_decode($value['token']))),true);
    $value['email'] = $jwt['data']['email'];
    $val = array('fullName' =>$value['fullName'] ,'dob'=>$value['dob'],'sex'=>$value['gender'],'email'=>$value['email'] );
    $query = "UPDATE `user_profile` SET full_name = ?, dob = ?, sex = ? WHERE email = ?";
    //echo "value size before >> ".sizeof($value)."<< \n";
  //  $value['email'] = $jwt['data']['email'];
    //echo "value size after >> ".sizeof($value)."<< \n";
    $result = $this->query_db($query, $val);
    $this->db_close();

    if($result == 1){
        $response['response']="true";
        $response['errMessage'] = "User profile Updated successfully";
        return $response;
    }else{
        $response['response']="false";
        $response['errMessage'] = "User profile update failed";
        return $response;
    }
  }

  public function clearOldResponseData(){
    unset($response);
    $response = array();
  }

}
error_reporting( E_ALL );
?>
