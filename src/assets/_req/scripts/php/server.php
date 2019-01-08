 <?php
error_reporting( E_ALL );
ini_set('display_errors', 1);

class Server{

  function db_connection(){
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $database = "cathod_db";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    echo "Connected successfully";
    $conn->close();
  }

  function display_data(){
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $database = "cathod_db";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    //echo "Connected successfully";

    $sql = "SELECT full_name,email,dob FROM user_profile";
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

         $this->publisher = $par;
        // Create connection
        $conn = new mysqli($servername, $username, $password, $database);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }else{
        if($conn){
          if($args){
             echo $args;
          }
        }
      }
    }

}

// $obj= new Server;
// $obj->db_connection();
// $obj->display_data();
// $obj->query_db($query,$args);

?>
