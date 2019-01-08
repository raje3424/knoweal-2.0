<?php


//include("palika.php");
//include("basic.php");

class Books {

     //var $_dump(function_exists('mysqli_connect'));
     /* Member variables */
     var $price;
     var $title;

     /* Member functions */
     function setPrice($par){
        $this->price = $par;
     }

     function getPrice(){
        echo $this->price ."<br/>";
     }

     function setTitle($par){
        $this->title = $par;
     }

     function getTitle(){
        echo $this->title ." <br/>";
     }

     function db_connection(){
       $servername = "localhost";
       $username = "root";
       $password = "root";
       $database = "cathod_db";
       // Create connection
       $conn = new mysqli($servername, $username, $password,$database);

       // Check connection
       if ($conn->connect_error) {
           die("Connection failed: " . $conn->connect_error);
       }
       echo "Connected successfully";

       $sql = "SELECT full_name,email, dob FROM user_profile";
       $result = $conn->query($sql);

       if ($result->num_rows > 0) {
           // output data of each row
           while($row = $result->fetch_assoc()) {
               echo "id: " . $row["full_name"]. " - Name: " . $row["email"]. " " . $row["dob"]. "<br>";
           }
       } else {
           echo "0 results";
       }
       $conn->close();
     }

     function query_db($query,$args){
       $servername = "localhost";
       $username = "root";
       $password = "root";
       $database = "cathod_db";
       // Create connection
       $conn = new mysqli($servername, $username, $password, $database);

       // Check connection
       if ($conn->connect_error) {
           die("Connection failed: " . $conn->connect_error);
       }else{
         if($conn){
           if($args){
             // if(is_array($args)){
             //         foreach ($args as index => value) {
             //           $args[index] = mysqli_real_escape_string(this->$conn, value);
             //         }
             //         $query = vsprintf(str_replace("?","'%s'",$query),$args);
             //         $result = $conn->query($));
             //       }else{
             //         $query = vsprintf(str_replace("?","'%s'",$query),$args);
             //         $result = mysqli_query(this->$conn, query);
             //       }
             //     }else{
             //       $result = mysqli_query(this->$conn, query);
             //     }
             //   }else{
             //     //echo "stil no";
             //   }
             echo $args;
           }
         }
         // echo query;
         // echo args;
         echo"successfully";
       }
     }
  }

  $physics = new Books;
  $maths = new Books;
  $chemistry = new Books;
  $physics->setTitle( "Physics for High School" );
  $chemistry->setTitle( "Advanced Chemistry" );
  $maths->setTitle( "Algebra" );

  $physics->setPrice( 10 );
  $chemistry->setPrice( 15 );
  $maths->setPrice( 7 );

  $physics->getTitle();
  $chemistry->getTitle();
  $maths->getTitle();
  $physics->getPrice();
  $chemistry->getPrice();
  $maths->getPrice();
  $physics->db_connection();
  $physics->query_db($query,$args);
  //print_r($_POST);
  $data = json_decode(file_get_contents("php://input"), true);
  print_r($data);

 ?>
