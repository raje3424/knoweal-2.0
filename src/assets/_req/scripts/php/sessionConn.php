<?PHP
/*
**
** <<RDM>> 20 08 2015
** session handler for CleaverFox
** dependencies :: 0
**
*/

session_start();

class sessionExr{

  public function sessionEmailSetter($value){ // email setter
    if(!isset($_SESSION['email'])){
      $_SESSION['email'] = $value;
      if(isset($_SESSION['email'])){
        return "true";
        //return "true : ".$_SESSION['email'];
      }else{
        return "false";
        //return "false : ".$_SESSION['email'];
      }
    }else{
      return "xfalse";
    }
  }

  public function sessionIDSetter($value){ // id setter
    if(!isset($_SESSION['id'])){
      $_SESSION['id'] = $value;
      if(isset($_SESSION['id'])){
        return "true";
        return "true : ".$_SESSION['id'];
      }else{
        return "false";
      }
    }else{
      return "xfalse";
      //return "xfalse : ".$_SESSION['id'];
    }
  }

  public function sessionEmailUpdate($value){ // email updater
    if(isset($_SESSION['email'])){
      session_unset($_SESSION['email']);
      $_SESSION['email'] = $value;
      if($_SESSION['email'] == $value){
        return "true";
        //return "true : ".$_SESSION['email'];
      }else{
        return "false";
      }
    }else{
      return "xfalse";
    }
  }

  public function sessionIDUpdate($value){ // id updater
    if(isset($_SESSION['id'])){
      session_unset($_SESSION['id']);
      $_SESSION['id'] = $value;
      if($_SESSION['id'] == $value){
        return "true";
        //return "true :".$_SESSION['id'];
      }else{
        return "false";
      }
    }else{
      return "xfalse";
    }
  }

  public function getSessionEmail(){
    return $_SESSION['email'];
  }

  public function getSessionID(){
    return $_SESSION['id'];
  }

  public function getSessionEmailID(){
    return array('email' => $_SESSION['email'], 'id' => $_SESSION['id'] );
  }

  public function destroy(){ // session dest
    session_unset();
    session_destroy();
    if(isset($_SESSION['email']) || isset($_SESSION['id'])){
      return "false";
      //return "false e: ".$_SESSION['email']." i: ".$_SESSION['id'];
    }else{
      return "true";
      //return "true e: ".$_SESSION['email']." i: ".$_SESSION['id'];
    }
  }

}

/*
echo "<h2>sessionConn</h2><br/>\n--------------------------<br/>\n";
$osx = new sessionExr;
echo $osx->sessionEmailSetter("rohit@gmail.com") . " <br/>\n";
echo $osx->sessionIDSetter("8") . " <br/>\n";
echo $osx->sessionEmailUpdate("maitre@gmail.com"). " <br/>\n";
echo $osx->sessionIDUpdate("88"). " <br/>\n";
$ei = $osx->getSessionEmailID();
echo " email >> ".$ei['email']." id >> ".$ei['id']." :: <br/>\n";

$asn = $osx->destroy();
echo  "<br/> >> ".$asn." << ";
*/
?>
