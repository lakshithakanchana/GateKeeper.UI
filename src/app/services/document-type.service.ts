import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GateKeeperUrls } from '../models/gatekeeperurls.class';
import { DocumentType } from '../models/document-type.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {

  constructor(private http: HttpClient) { }

  getDocumentTypes(): Observable<DocumentType[]> {
    return this.http.get<DocumentType[]>(GateKeeperUrls.documentTypesUrl);
  }

}
