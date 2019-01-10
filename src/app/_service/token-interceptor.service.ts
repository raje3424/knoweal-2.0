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
   token:string= "abcd";
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authService = this.injector.get(AuthGuard);

    let tokenizedReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`
      }
    })

    return next.handle(tokenizedReq);
  }
}
