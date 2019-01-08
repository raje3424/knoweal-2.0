package sessionPkg

import (
	"fmt"
	"net/http"
	//"os"
	"github.com/gorilla/sessions"
	//"strings"
	//"path/filepath"
)

var store = sessions.NewCookieStore([]byte("something-very-secret"))
var sessionValues map[string]interface{}

func SetSession(w http.ResponseWriter, r *http.Request, retMap map[string]interface{}) {
	fmt.Println("In SetSession ... ")
	session, err := store.Get(r, "session-name")
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	// Set some session values.
	session.Values["retMap"] = retMap
	sessionValues = session.Values["retMap"].(map[string]interface{})
	fmt.Println(session.Values["retMap"])
	// Save it before we write to the response/return from the handler.
	session.Save(r, w)

}

func IsSessionActive(w http.ResponseWriter, r *http.Request) string {
	// Get a session (existing/new)

	/*session, err := store.Get(r, "session-name")
	if err != nil {
		http.Error(w, err.Error(), 500)
		fmt.Println(err)
		return "Error"
	}*/
	//fmt.Println(session.Values["retMap"])

	// Type assert our userDetails map out of the session's map[string]interface{}
	if len(sessionValues) == 0 {
		fmt.Println("length is zero")
		return "false"
	}
	/*userDetails, ok := sessionValues
	if !ok {
		// User does not have an existing session - treat them as not logged in and/or re-direct them to your login page.
		fmt.Println(ok)
		return "EmptySession"
	} else {
		fmt.Println("Session active ", userDetails["lvl"])
	}*/
	//fmt.Println(sessionValues["email"])
	return "true"
}

func GetSessionMap() map[string]interface{} {
	if len(sessionValues) != 0 {
		return sessionValues
	}
	return sessionValues
}

func AddToSession(key string,val string){
	sessionValues[key] = val
}

func SessionDestroy(w http.ResponseWriter, r *http.Request) string {
	//var path string = ""
	for k := range sessionValues {
		/*if k == "uploadedPath" {
			path = sessionValues[k]
		}*/
		delete(sessionValues, k)
	}
	if len(sessionValues) == 0 {
		fmt.Println("length is zero")
		return "true"
		//os.Exit(1);
	}
	return "false"
}
