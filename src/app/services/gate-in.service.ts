import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { GateIn } from '../models/gate-in.class';
import { GateKeeperUrls } from '../models/gatekeeperurls.class';

@Injectable({
  providedIn: 'root'
})
export class GateInService {

  constructor(private http: HttpClient) {

  }

  get(): Observable<GateIn[]> {
    return this.http.get<GateIn[]>(GateKeeperUrls.gateInsUrl)
    .pipe(
      map(gateInList => {
        gateInList.forEach(gateIn => {
          gateIn.createdDateTime = new Date(gateIn.createdDateTime);
          if(gateIn.gateOut !== null)
            gateIn.gateOut.createdDateTime = new Date(gateIn.gateOut.createdDateTime);
        });
        return gateInList;
      })
    );
  }

  getOne(gtInId: number): Observable<GateIn> {
    return this.http.get<GateIn>(`${GateKeeperUrls.gateInsUrl}/${gtInId}`)
    .pipe(
      map(gateIn => {
        gateIn.createdDateTime = new Date(gateIn.createdDateTime);
        if(gateIn.gateOut !== null)
            gateIn.gateOut.createdDateTime = new Date(gateIn.gateOut.createdDateTime);
        return gateIn;
      })
    );
  }

  createGateIn(model: GateIn): Observable<number> {
    if(model.remarks !== null && model.remarks !== undefined) {
      model.remarks = model.remarks.trim();
    }
    return this.http.post<number>(GateKeeperUrls.gateInsUrl, model);
  }

}
