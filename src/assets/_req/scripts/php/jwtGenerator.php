<?php
  include_once ("php-jwt-master/src/BeforeValidException.php");
  include_once ("php-jwt-master/src/ExpiredException.php");
  include_once ("php-jwt-master/src/SignatureInvalidException.php");
  include_once ("php-jwt-master/src/JWT.php");

  use \Firebase\JWT\JWT;

  class jwtGenerator{
    private $key = "8WggZQNvUX6YTDBr3b2UhoGtsdaSCGqlAlGIi4l08mE";

    public function EncodeToken($data){
      //echo "In jwtTokenSetter";

      $token = array(
        "iat" => strtotime(date("Y-m-d H:i:s",time())),
        "data" => $data
      );
      //echo "\nKey is : ".$this->key."\n";
      $jwt = JWT::encode($token, $this->key);
      return $jwt;

    }

    public function IsTokenValid($jwt){
      // if jwt is not empty
      if($jwt){
         // if decode succeed, show user details
        try {
             // decode jwt
            $decoded = JWT::decode($jwt, $this->key, array('HS256'));
            //print_r($decoded);
            return true;
            // set user property values here
        }
        // catch failed decoding will be here
        // if decode fails, it means jwt is invalid
        catch (Exception $e){
             // set response code
          //echo "Token is invalid : ".$e->getMessage();
          return false;
            // show error message
            /*echo json_encode(array(
                "message" => "Access denied.",
                "error" => $e->getMessage()
            ));*/
        }
      }
    // error message if jwt is empty will be here
    }

    public function DecodeToken($token){
      // get posted data
    //  $data = json_decode(file_get_contents("php://input"));
      $jwt = isset($token) ? $token : "";
      if ($jwt) {
        try {
          $decoded = JWT::decode($jwt, $this->key, array('HS256'));
          print_r($decoded);
        }catch (Exception $e){
          echo "Token is invalid : ".$e->getMessage();
        }
      }else{
        echo "Token is empty";
      }
    }

    public function destroy(){

    }

  }

?>
