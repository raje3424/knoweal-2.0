package main

  import (
    "fmt"
    "net/http"
    "packages/loginPkg"
    "os"
    "packages/dataHandlingPkg"
    "reflect"
    //"encoding/json"
  )
  func userAdaptor(w http.ResponseWriter, r *http.Request){
    fmt.Println("In userAdaptor")
    if origin := r.Header.Get("Origin"); origin != "" {
        fmt.Println("Origin : ",origin)
        w.Header().Set("Access-Control-Allow-Origin", origin)
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers",
            "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
    }
    r.ParseMultipartForm(32 << 20)
    r.ParseForm()
    fmt.Println("Type of r.form : ",reflect.TypeOf(r.Form))
    if r.FormValue("v_package") == "loginPkg" {
      loginPkg.LogAdaptor(w,r);
    }else if r.FormValue("v_package") == "dataHandlingPkg"{
      dataHandlingPkg.DataAdaptor(w,r);
    }else {
      fmt.Fprintf(w, "%s", "Galat Package diye re ... Pura Baigan me mila diye ...")
    }
  }
func main() {
  fmt.Println(os.Setenv("MONGOHQ_URL","root:root@localhost:27017/cathod_db"))
  fmt.Println(os.LookupEnv("MONGOHQ_URL"))
  http.HandleFunc("/", userAdaptor);
  http.ListenAndServe(":7289", nil);
}
