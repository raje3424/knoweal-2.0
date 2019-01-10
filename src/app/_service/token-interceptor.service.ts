import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGuard } from '../_guards/index';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private injector: Injector, private authGuard: AuthGuard) {

  }
  // token:string= "abcd";
  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   let authService = this.injector.get(AuthGuard);

  //   let tokenizedReq = request.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${this.token}`
  //     }
  //   })

  //   return next.handle(tokenizedReq);
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.authGuard.getToken();
 
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', '1234567890')
    });
 
    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
