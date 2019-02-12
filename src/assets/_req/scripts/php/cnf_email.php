<?php
include("serverConnector.php");
class email_Confi extends connector{

  public function confermEmail($theCha){
    if($theCha!= ""){
    //  echo  "cha >> ".$theCha." ::";
      $query = "UPDATE user_instance SET veri_flag = 1 WHERE veri_id = ?";
      $result = $this->query_db($query,  $theCha);
      //echo "Result : ".$result;
      $this->db_close();
      if ($result == 1){
          return "true";
          alert("Verification Success please login");
      }
    }else{
     //echo " the cha >> ".$theCha." ::";
    }
  }

  public function redir(){
    header('Location: http://localhost:4200');
    exit;
  }
}

$theCha = $_GET['chavi'];
$oE = new email_Confi();
$retVal =  $oE->confermEmail($theCha);
//echo $retVal;
if($retVal == "true"){
  $oE->redir();
}else{
  echo "There seems some problem, please retry using the link sent to you on your email.";
}
?>
