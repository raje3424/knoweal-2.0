<?PHP
// all info getter >>
class infoGetter{

  // user adaptor and it's fucntions >>
  public function userAdaptor($case,$val){
    switch($case){
      case "getUserInstanceStatus":
        $query = $this->getUserInstanceStatus($val);
        break;
    }
    return $query;
  }

  private function getUserInstanceStatus($val){
    $query = "SELECT * FROM user_instance WHERE email = '".md5($val)."'";
    return $query;
  }

  public function sanatize($vals){
    return mysqli_real_escape_string($vals);
  }

}

?>
