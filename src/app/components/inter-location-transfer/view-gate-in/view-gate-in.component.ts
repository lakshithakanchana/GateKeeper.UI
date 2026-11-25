import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GateIn } from 'src/app/models/gate-in.class';
import { GateKeeperUrls } from 'src/app/models/gatekeeperurls.class';
import { GateInService } from 'src/app/services/gate-in.service';
import { HttpErrorHandlerService } from 'src/app/services/http-error-handler.service';

@Component({
  selector: 'app-view-gate-in',
  templateUrl: './view-gate-in.component.html',
  styleUrls: ['./view-gate-in.component.scss']
})
export class ViewGateInComponent implements OnInit, OnDestroy {

  gateInId: number = 0;
  private paramMapSubscription: Subscription | null = null;
  private gateInSubscription: Subscription | null = null;
  loading: boolean = false;
  gateIn?: GateIn;
  goDownloadPath: string;
  transportDelay: number = 0;

  constructor(private gateInSvc: GateInService, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) {
    this.goDownloadPath = GateKeeperUrls.gateOutAttachmentDownloadUrl;
  }

  ngOnInit(): void {
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.gateInId = Number(params.get('id'));
      if(this.gateInId > 0) {
        this.gateInSubscription = this.gateInSvc.getOne(this.gateInId)
        .subscribe({
          next: (gi) => {
            this.gateIn = gi;
            if(gi.gateOut !== null)
              this.transportDelay = Math.round(Number( (gi.createdDateTime.getTime() - gi.gateOut.createdDateTime.getTime()) / (1000 * 60) ));
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open('Something went wrong!', 'Dismiss');
            console.log(error);
          }
        });
      } // If ends.
    });
  }



  ngOnDestroy(): void {
    if(this.paramMapSubscription !== null)
      this.paramMapSubscription.unsubscribe();
    if(this.gateInSubscription !== null)
      this.gateInSubscription?.unsubscribe();
  }

}
