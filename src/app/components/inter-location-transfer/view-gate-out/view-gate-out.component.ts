import { Component, OnInit, OnDestroy } from '@angular/core';
import { GateOutService } from 'src/app/services/gate-out.service';
import { Subscription } from 'rxjs';
import { GateOut } from 'src/app/models/gate-out.class';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GateKeeperUrls } from 'src/app/models/gatekeeperurls.class';

@Component({
  selector: 'app-view-gate-out',
  templateUrl: './view-gate-out.component.html',
  styleUrls: ['./view-gate-out.component.scss']
})
export class ViewGateOutComponent implements OnInit, OnDestroy {

  gateOutId: number = 0;
  loading: boolean = false;
  private paramMapSubscription: Subscription | null = null;
  private gateOutSubscription: Subscription | null = null;
  gateOut?: GateOut;
  downloadPath: string; // Gate Out attachments download path


  constructor(private gateOutSvc: GateOutService, private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute) {
    this.downloadPath = GateKeeperUrls.gateOutAttachmentDownloadUrl;
  }

  ngOnInit(): void {
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.gateOutId = Number(params.get('id'));
      if(this.gateOutId > 0) {
        this.gateOutSubscription = this.gateOutSvc.getOne(this.gateOutId)
        .subscribe({
          next: (go) => this.gateOut = go,
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
    if(this.gateOutSubscription !== null)
      this.gateOutSubscription?.unsubscribe();
  }

}
