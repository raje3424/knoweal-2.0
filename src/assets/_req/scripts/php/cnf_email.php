<?php
include("sessionConn.php");
include("serverConnector.php");

class email_Confi extends connector{

  public function confermEmail($theCha){
    $value;

    echo"In conf mail";

    if($theCha!=""){
      echo "Email >> ".$_GET['email']." cha >> ".$theCha." ::";
      $query = "UPDATE user_instance SET veri_flag = 1 WHERE veri_id = $theCha";
      //$value['email'] = md5($_SESSION['email']);
      //$value['veri_id'] = $theCha;
      $result = $this->query_db($query, $value);
      echo "Result : ".$result;
      $this->db_close();
      if ($result == 1)
        return "true";
    }else{
     echo " the cha >> ".$theCha." ::";
    }
  }

  public function redir(){
    header('Location: http://www.knoweal.com/');
    exit;
  }
}

$theCha = $_GET['chavi'];
$oE = new email_Confi();
$retVal =  $oE->confermEmail($theCha);
echo $retVal;
if($retVal == "true"){
  $oE->redir();
}else{
  echo "There seems some problem, please retry using the link sent to you on your email.";
}
?>
