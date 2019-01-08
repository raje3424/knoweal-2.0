package loginPkg

  import (
    "fmt"
    "net/http"
    "gopkg.in/mgo.v2"
    "gopkg.in/mgo.v2/bson"
    "encoding/json"
    "os"
    //"log"
    "io"
    "path/filepath"
    "io/ioutil"
    //"bytes"
    //"strconv"
    "strings"
    //"reflect"
    //"time"
    "packages/commonPkg"
    //"packages/loginPkg"/*signing in*/
    "packages/sessionPkg"
    //"html"
    //"golang.org/x/text/unicode/norm"

  )

  var sess *mgo.Session;
  var collection *mgo.Collection;
  var session map[string]interface{}

  type data struct {
    Id bson.ObjectId  `bson:"_id"`
    Vaparkarta string  `bson:"vaparkarta"`
    Killi string      `bson:"killi"`
    Pohoch string  `bson:"pohoch"`
  }

  /*type profile struct {
    Id bson.ObjectId  `bson:"_id"`
    Name  string  `bson:"name"`
    Uname string  `bson:"uname"`
    TagLine string  `bson:"tagLine"`
    Designation string  `bson:"designation"`
    FbLink  string  `bson:"fbLink"`
    TwtLink string  `bson:twtLink`
    Email string  `bson:"email"`
    Bio string  `bson:"bio"`
    ProfilePic  []byte  `bson:"profilePic"`
  }*/

  var funcMap = map[string]func(w http.ResponseWriter, r *http.Request){
  	/*"Pravesham":   Pravesham,
    "Bahirgaman" : Bahirgaman,
    "Check_Session" : Check_Session,
    "ProfileInfo" : ProfileInfo,
    "ProfileDisplay" : ProfileDisplay,
    "CoverPhotoUpload" : CoverPhotoUpload,*/
  }

  func LogAdaptor(w http.ResponseWriter, r *http.Request){
    fmt.Println("In LogAdaptor")
    sess = commonPkg.GetConnected();
    session = sessionPkg.GetSessionMap();
  	r.ParseForm()
  	fmt.Println("Function Name : ",r.FormValue("v_function"))
    var fun func(http.ResponseWriter, *http.Request)
  	fun = funcMap[r.FormValue("v_function")]
  	fun(w, r)
  }

  func setCollection(dbName string, collectionName string) *mgo.Collection{
    collection = sess.DB(dbName).C(collectionName)
    return collection
  }

  func Check_Session(w http.ResponseWriter, r *http.Request){
    defer func() {
          if err := recover(); err != nil {
              fmt.Println("Exception: ", err)
          }
    }()
    if sessionPkg.IsSessionActive(w,r) == "true" {
      //fmt.Fprintf(w,"%s","true")
      commonPkg.DisplayMsgs(session["pohoch"].(string),"",w);
    }else{
      //fmt.Fprintf(w,"%s","false")
      commonPkg.DisplayMsgs("","true",w);
    }
  }
