package commonPkg

  import (
    "fmt"
    "net/http"
    "encoding/json"
    "gopkg.in/mgo.v2"
    //"gopkg.in/mgo.v2/bson"
    "os"
    //"errors"
    //"log"
    "time"
    "reflect"
    //"strconv"
    //"strings"
    "packages/sessionPkg"
  )

  var sess *mgo.Session;
  //var collection *mgo.Collection;
  //type String string
  func GetConnected() *mgo.Session{
    uri := os.Getenv("MONGOHQ_URL")
    fmt.Println("URI : ",uri," And its type : ",reflect.TypeOf(uri));
    if uri == "" {
      fmt.Println("no connection string provided")
      os.Exit(1)
    }else{
      sess, err := mgo.Dial(uri)
      if err != nil {
        fmt.Println("Can't connect to mongo, go error %v\n", err)
        os.Exit(1)
      }else{
        fmt.Println("Connected ...",reflect.TypeOf(sess))
        return sess
      }
      defer sess.Close()
    }
    return sess
  }

  /*func SetCollection(dbName string, collectionName string) *mgo.Collection{
    collection := sess.DB(dbName).C(collectionName)
    fmt.Println("collection : ",collection)
    return collection
  }*/

  func ToJSON(retMap map[string]string)[]uint8{
    b, err := json.Marshal(retMap)
    if err != nil {
      fmt.Println(err,b)
      //fmt.Fprintf(w, "%s", b)
    }else {
      return b;
    }
    return b;
  }

  func DisplayMsgs(response string, errMsg string, w http.ResponseWriter){
    retMap := make(map[string]string)
    if response == "" {
      retMap["error"] = errMsg
      fmt.Fprintf(w,"%s", ToJSON(retMap))
    }else{
      retMap["response"] = response
      retMap["error"] = "false"
      fmt.Println(retMap)
      fmt.Fprintf(w,"%s", ToJSON(retMap))
    }
  }
/*
  type String string
func (str String) GetInnerSubstring(begin string, end string) string {
    workingString := string(str)
    var beginIndex, endIndex int
    beginIndex = strings.Index(workingString, begin)

    if (beginIndex == -1) {
        beginIndex = 0
        endIndex = 0
    } else if (len(begin) == 0) {
        beginIndex = 0
        endIndex = strings.Index(workingString, end)
        if (endIndex == -1 || len(end) == 0) {
            endIndex = len(workingString)
        }
    } else {
        beginIndex += len(begin)
        endIndex = strings.Index(workingString[beginIndex:], end)
        if (endIndex == -1) {
            if (strings.Index(workingString, end) < beginIndex) {
                endIndex = beginIndex
            } else {
                endIndex = len(workingString)
            }
        } else {
            if (len(end) == 0) {
                endIndex = len(workingString)
            } else {
                endIndex += beginIndex
            }
        }
    }
    return workingString[beginIndex:endIndex]
}

func SameElementDestroyer(rcvdMap map[string]interface{})map[string]interface{}{
  newMap := make(map[string]interface{})
  s := make([]int,len(rcvdMap)+1)
  a := 1
  the_flag := 0
  //fmt.Println("SameElementDestroyer : ",rcvdMap)
  //fmt.Println("a : ",a," : ",rcvdMap[strconv.Itoa(a)])
  for i := 1; i <= len(rcvdMap); i++ {
    if the_flag == 1 {
      if a > 1 {
        i = a
        the_flag = 0
      }
    }
    j := i + 1
    if j < len(rcvdMap) {
      if rcvdMap[strconv.Itoa(a)] == rcvdMap[strconv.Itoa(j)] {
        s[i-1] = j
      }
    }else {
      if j == len(rcvdMap) {
        if rcvdMap[strconv.Itoa(a)] == rcvdMap[strconv.Itoa(len(rcvdMap))] {
          s[len(rcvdMap)-1] = len(rcvdMap)
        }
        length := len(rcvdMap)
        for z := 0; z < len(s); z++ {
          if s[z] != 0 {
            delete(rcvdMap,strconv.Itoa(s[z]));
          }
        }
        //fmt.Println("After Delete : ",rcvdMap)
        y := 1
        for p := 1; p <= length; p++ {
          if _, ok := rcvdMap[strconv.Itoa(p)]; ok {
            newMap[strconv.Itoa(y)] = rcvdMap[strconv.Itoa(p)]
            if p < length {
              y++
            }
          }
        }
        if a <= len(newMap) {
          a = a + 1
          the_flag = 1
          i = 1
          s = nil
          //fmt.Println("Into newMap",newMap)
          rcvdMap = make(map[string]interface{})
          //fmt.Println("reinitialized : ",rcvdMap)
          //rcvdMap = newMap
          for key,val := range newMap {
            rcvdMap[key] = val
          }
          newMap = make(map[string]interface{})
          //fmt.Println("After Clear ",rcvdMap)
          s = make([]int,len(rcvdMap)+1)
        }
        //fmt.Println("Rearranged  : ",rcvdMap)
      }
    }
  }
  return rcvdMap
}

func PanicHandler(){
  fmt.Println("In PanicHandler")
  defer func() { //catch or finally
        if err := recover(); err != nil { //catch
            fmt.Println(os.Stderr, "Exception: ", err)
            //os.Exit(1)
        }
    }()
}
*/
func LoggerDetails(funName string){
  sessionValues := sessionPkg.GetSessionMap();
  uName,ok := sessionValues["user_name"]
  if ok{
    fmt.Println("========================================================================")
    t := time.Now()
    fmt.Println("UserName >> "+uName.(string),"Time >> ",t.Day(),t.Month(),t.Year(),t.Hour(),":",t.Minute(),"Function Name >> "+funName)
  }
}
