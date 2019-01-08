<?php
/*
**
** <<RDM>> 20 08 2015
** login/signup/change function for CleaverFox
** dependencies :: 2
** |
** |-- serverConnector[.]php for db connection
** |-- sessionConn[.]php for session handling
** ~~~
**
*/

 //include ("serverConnector.php");
 //include("hello.php");

 include_once ("serverConnector.php");
 include_once ("sessionConn.php");
 require 'vendor/autoload.php';

use SparkPost\SparkPost;
use GuzzleHttp\Client;
use Http\Adapter\Guzzle6\Client as GuzzleAdapter;

//include("PHPMailer-master/PHPMailerAutoload.php");
//echo"palika";
class palika extends connector{

  public function userAdaptor($operation, $value){
    if($value == "" || $value == "" || $value == NULL){
      return $this->$operation();
    }else{
      return $this->$operation($value);
    }
  }
    public function hello($value){
      echo "Hello from palika";
      $result= $this->db_connection();
      echo "result:".$result;
    }

  public function signup($value){
    $oBasic = new basic();
    $ifUser = $oBasic->userAdaptor('checkIfEmailExists', md5($value['email']));
    echo "ifUser >> ".$ifUser."::";
    if($ifUser == "false"){
      $result = "";
      $simple_email = $value['email'];
      echo "Simple email >> ".$simple_email." ::";
      $value['email'] = md5($value['email']);
      $value['password'] = md5($value['password']);
      //echo $value['password'];
      $unq = uniqid();
      $value['veri_id'] = $unq;

      if($value['email'] != "" && $value['password'] != ""){
        $query = "INSERT INTO user_instance (email, pass, veri_id) VALUES(?, ?, ?)";
        echo vsprintf( str_replace("?","'%s'",$query),$value);
        $result = $this->query_db($query, $value);
        //echo"query executed";
        echo "Result :".$result;
        if($result == 1){
          $oSession = new sessionExr();
          $ans = $oSession->sessionEmailSetter($simple_email);
          echo $ans;
          //return $ans;
          //echo "ANS >> ".$ans."::";
          if($ans == "true"){
            //echo"if executed";
            $this->spark($simple_email);
            // $file_con = file_get_contents("../../../conf_email.html");
            // $file_con = str_replace("sent", $unq, $file_con);
            // echo $this->spark($simple_email,$file_con);
            //echo $this->sendVEmail($simple_email, $file_con);
          }else{
            echo "Ans  >> ".$ans." ::";
            //echo $ans;
            return $ans;
          }
        }else{
          return "efalse";
        }
        $this->db_close();
      }else{
        return "bfalse";
      }
    }else{
      return "rfalse";
    }
  }

  public function login($value){
    //$this->db_connection();
    //echo "in login function";
    $oBasic = new basic();
    $ifUser = $oBasic->userAdaptor('checkIfEmailExists', md5($value['email']));
    if($ifUser == "true"){
      $query = "SELECT `pass` FROM `user_instance` WHERE `email` = ?";
      $email = md5($value['email']);
      $result = $this->query_db($query, $email);
      $result = mysqli_fetch_array($result);
      if($result['pass'] == substr(md5($value['password']), 0, 50)){
        $oSession = new sessionExr();
        $ans = $oSession->sessionEmailSetter($value['email']);
        $this->db_close();
        return $ans;
      }else{
        //return "pfalse >> ".md5($value['password'])." :: ".$result['pass'];
        return "pfalse";
      }
    }else {
      return "ufalse";
    }
  }

  // $email = strval($value['email']);
  //echo gettype($abc);
 //
 //  public function spark($simple_email){
 //  $httpClient = new GuzzleAdapter(new Client());
 //  $sparky = new SparkPost($httpClient, ['key'=>'c78d2fed5e21260e3007da448c7a5d0f14b03688']);
 //  $sparky->setOptions(['async' => false]);
 //  //$email= "$value['email']";
 //  echo $unq;
 //  $results = $sparky->transmissions->post([
 //    'options' => [
 //      'sandbox' => false
 //    ],
 //    'content' => [
 //      'from' => 'newsletters@mail.vidaa.in',
 //      'subject' => 'Oh hey',
 //      'html' => '<html><body><p>Testing SparkPost - the most awesomest email service!</p><p>Please verify your email using following link <a href="http://localhost:8888/conf_email.html?chavi=">link</a></p></body></html>'
 //    ],
 //    'recipients' => [
 //      ['address' => ['email'=>$simple_email]]
 //    ]
 //  ]);
 // }
}

  error_reporting( E_ALL );
?>
