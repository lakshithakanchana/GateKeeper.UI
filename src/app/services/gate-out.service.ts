import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GateOut } from '../models/gate-out.class';
import { GateKeeperUrls } from '../models/gatekeeperurls.class';

@Injectable({
  providedIn: 'root'
})
export class GateOutService {

  constructor(private http: HttpClient) {

  }

  get(): Observable<GateOut[]> {
    return this.http.get<GateOut[]>(GateKeeperUrls.gateOutsUrl)
    .pipe(
      map(gateOutList => {
        gateOutList.forEach(gateOut => {
          gateOut.createdDateTime = new Date(gateOut.createdDateTime);
        });
        return gateOutList;
      })
    );
  }

  getOne(gtOutId: number): Observable<GateOut> {
    return this.http.get<GateOut>(`${GateKeeperUrls.gateOutsUrl}/${gtOutId}`)
    .pipe(
      map(gateOut => {
        gateOut.createdDateTime = new Date(gateOut.createdDateTime);
        return gateOut;
      })
    );
  }

  getGateOutFromQrIdIfInTransitUrl(qrId: number) {
    return this.http.get<GateOut>(`${GateKeeperUrls.gateOutFromQrIdIfInTransitUrl}/${qrId}`)
    .pipe(
      map(gateOut => {
        gateOut.createdDateTime = new Date(gateOut.createdDateTime);
        return gateOut;
      })
    );
  }

  uploadAttachment(attachment: Blob): Observable<string> {
    const fd = new FormData();
    fd.append('attachment', attachment);
    return this.http.post(GateKeeperUrls.gateOutAttachmentUploadUrl, fd, {responseType: 'text'});
  }

  createGateOut(model: GateOut): Observable<number> {
    model.vehicleNo = model.vehicleNo.trim().toUpperCase();
    model.driverEpfNo = model.driverEpfNo.trim().toUpperCase();
    model.driverName = model.driverName.trim();
    model.attachedDocumentNo = model.attachedDocumentNo.trim().toUpperCase();

    return this.http.post<number>(GateKeeperUrls.gateOutsUrl, model);
  }

}
