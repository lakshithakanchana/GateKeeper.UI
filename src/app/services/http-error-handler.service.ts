import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorsSummary } from '../models/errors-summary.class';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor() { }

  handle(httpError: HttpErrorResponse): ErrorsSummary {
    
    if(httpError.error?.status === 'Error') {

      if(httpError.status === 401) {
        return new ErrorsSummary(httpError.status, 'Unauthorized', httpError.error.messages)
      }
      if(httpError.status === 422) {
        return new ErrorsSummary(httpError.status, 'Unprocessable Entity', httpError.error.messages)
      }
      if(httpError.status === 500) {
        return new ErrorsSummary(httpError.status, 'Internal Server Error', httpError.error.messages)
      }
      if(httpError.status === 503) {
        return new ErrorsSummary(httpError.status, 'Service Unavailable', httpError.error.messages)
      }

    }

    if(httpError.status === 400) {
      return new ErrorsSummary(httpError.status, 'Bad Request', ["Server can't process the request you made! Please, Contact IT Department!", httpError.message])
    }
    if(httpError.status === 401) {
      return new ErrorsSummary(httpError.status, 'Unauthorized', ['You are not authorized! Please, sign in first!'])
    }
    if(httpError.status === 422) {
      return new ErrorsSummary(httpError.status, 'Unprocessable Entity', ['Credentials you entered are invalid!'])
    }
    if(httpError.status === 500) {
      return new ErrorsSummary(httpError.status, 'Internal Server Error', ['Server error! Please, try again later!'])
    }
    if(httpError.status === 503) {
      return new ErrorsSummary(httpError.status, 'Service Unavailable', ["Server offline! Please, contact IT Department!"])
    }

    if (httpError.status === 0) {
      return new ErrorsSummary();
    }

    return new ErrorsSummary(httpError.status, httpError.statusText, ['Unknown error occured! Please, Contact IT Department!', httpError.message]);
  }

}
