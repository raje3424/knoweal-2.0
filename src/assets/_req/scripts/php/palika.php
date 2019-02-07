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

 include_once ("serverConnector.php");
 //include_once ("sessionConn.php");
 include_once ("jwtGenerator.php");

 require 'vendor/autoload.php';

use SparkPost\SparkPost;
use GuzzleHttp\Client;
use Http\Adapter\Guzzle6\Client as GuzzleAdapter;

//include("PHPMailer-master/PHPMailerAutoload.php");

class palika extends connector {

  protected $response = array();

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
    $this->clearOldResponseData();
    $oBasic = new basic();
    $ifUser = $oBasic->userAdaptor('checkIfEmailExists', md5($value['email']));
    //echo "ifUser >> ".$ifUser."::";
    if($ifUser == "false"){
      $result = "";
      $simple_email = $value['email'];
      $value['email'] = md5($value['email']);
      $value['password'] = md5($value['password']);
      //echo $value['password'];
      $unq = uniqid();
      $value['veri_id'] = $unq;
      $unic= $value['veri_id'];
      if($value['email'] != "" && $value['password'] != ""){
        $query = "INSERT INTO user_instance (email, pass, veri_id) VALUES(?, ?, ?)";
        //echo vsprintf( str_replace("?","'%s'",$query),$value);
        $result = $this->query_db($query, $value);
        if($result == 1){
          //getting user id
          // $query="SELECT user_id from user_profile WHERE email= $simple_email";
          // $result = $this->query_db($query);
          // echo $result;
          // $jwtObj = new jwtGenerator();
          // $jwt = $jwtObj->EncodeToken(array('email'=>$simple_email));
          //$this->spark($simple_email,$unic);
          $this->db_close();
          $response['response'] = "true";
          $response['errMessage'] = "new user added";
          // $response['token'] = $jwt;
          return $response;
        }else{
          //return "efalse";
          $response['response'] = "efalse";
          $response['errMessage'] = "Error inserting user.";
          return $response;
        }
      }else{
        $response['response'] = "bfalse";
        $response['errMessage'] = "Blank Username or Password";
        return $response;
      }
    }else{
      $response['response'] = "rfalse";
      $response['errMessage'] = "User already exist.";
      return $response;
    }
  }

  public function login($value){
    //$this->db_connection();
    $this->clearOldResponseData();
    $oBasic = new basic();
    $ifUser = $oBasic->userAdaptor('checkIfEmailExists', md5($value['email']));
    if($ifUser == "true"){
      $query = "SELECT `pass` FROM `user_instance` WHERE `email` = ?";
      $email = md5($value['email']);
      $result = $this->query_db($query, $email);
      $result = mysqli_fetch_array($result);
      if($result['pass'] == substr(md5($value['password']), 0, 50)){
        //getting user id
        $query = "SELECT `user_id` from `user_profile` WHERE `email` = ?";
        $getid = $this->query_db($query,$value['email']);
        $getid=mysqli_fetch_array($getid);
        //print_r($getid);
        //echo $getid;
        $jwtObj = new jwtGenerator();
        $jwt = $jwtObj->EncodeToken(array('email'=>$value['email'],'userid'=>$getid['user_id']));
        //print_r($jwtObj.jwttoken);
        //print_r($jwt);
        /*echo "\nToken is : ".$jwtObj->IsTokenValid($jwt)."\n";
        $jwtObj->DecodeToken($jwt);*/
        $this->db_close();
        $response['response'] = "true";
        $response['errMessage'] = "Login Success";
        $response['token'] = $jwt;
        //return $ans;
        return $response;
      }else{
        $response['response'] = "pfalse";
        $response['errMessage'] = "Password mismatch.";
        return $response;
      }
    }else {
      //return "ufalse";
      $response['response'] = "ufalse";
      $response['errMessage'] = "Invalid Username !!!";
      return $response;
    }
  }

  public function clearOldResponseData(){
    unset($response);
    $response = array();
  }


  public function spark($simple_email,$unic){
  $httpClient = new GuzzleAdapter(new Client());
  $sparky = new SparkPost($httpClient, ['key'=>'c78d2fed5e21260e3007da448c7a5d0f14b03688']);
  $sparky->setOptions(['async' => false]);
  //$email= "$value['email']";
  //echo $unic;
  $results = $sparky->transmissions->post([
    'options' => [
      'sandbox' => false
    ],
    'content' => [
      'from' => 'newsletters@mail.vidaa.in',
      'subject' => 'Oh hey',
      'html' => '<html><body><p>Testing SparkPost - the most awesomest email service!</p><p>Please verify your email using following link <a href="http://localhost:8888/conf_email.html?chavi="$unic>link</a></p></body></html>'
    ],
    'recipients' => [
      ['address' => ['email'=>$simple_email]]
    ]
  ]);
 }

}

  error_reporting( E_ALL );
?>
