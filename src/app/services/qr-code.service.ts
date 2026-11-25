import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { QrCode } from '../models/qr-code.class';
import { GateKeeperUrls } from '../models/gatekeeperurls.class';
import { GateOutQrCodeBridge } from '../models/gate-out-qr-code-bridge.interface';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor(private http: HttpClient) {

  }

  getIdFromQrCodeText(qrcText: string): Number {
    let qrcId = Number(
      qrcText.substring(
        qrcText.indexOf('/') + 1,
        qrcText.indexOf('/', qrcText.indexOf('/') + 1)
      )
    );
    if(Number.isNaN(qrcId))
      qrcId = Number(0);
    return qrcId;
  }

  // To fine tune more
  getQrCode(qrcText: string): Observable<QrCode> {
    let id = this.getIdFromQrCodeText(qrcText);
    return this.http.get<QrCode>(`${GateKeeperUrls.qrCodesUrl}/${id}`)
    .pipe(
      map(qrc => {
        qrc.createdDateTime = new Date(qrc.createdDateTime);
        return qrc;
      })
    );
  }

  get(): Observable<QrCode[]> {
    return this.http.get<QrCode[]>(GateKeeperUrls.qrCodesUrl)
    .pipe(
      map(qrcList => {
        qrcList.forEach(qrc => {
          qrc.createdDateTime = new Date(qrc.createdDateTime);
        });
        return qrcList;
      })
    );
  }

  getOne(qrcId: number): Observable<QrCode> {
    return this.http.get<QrCode>(`${GateKeeperUrls.qrCodesUrl}/${qrcId}`)
    .pipe(
      map(qrc => {
        qrc.createdDateTime = new Date(qrc.createdDateTime);
        return qrc;
      })
    );
  }

  create(model: QrCode): Observable<number> {
    model.itemRefNo = model.itemRefNo.trim().toUpperCase();
    model.itemSpecs = model.itemSpecs.trim();
    return this.http.post<number>(GateKeeperUrls.qrCodesUrl, model);
  }

  getInTransits(): Observable<GateOutQrCodeBridge[]> {
    return this.http.get<GateOutQrCodeBridge[]>(GateKeeperUrls.inTransitsUrl)
    .pipe(
      map(goQrcBList => {
        goQrcBList.forEach(goQrcB => {
          if(goQrcB.gateOut !== null)
            goQrcB.gateOut.createdDateTime = new Date(goQrcB.gateOut.createdDateTime);
          if(goQrcB.qrCode !== null)
            goQrcB.qrCode.createdDateTime = new Date(goQrcB.qrCode.createdDateTime);
        });
        return goQrcBList;
      })
    );
  }

}
