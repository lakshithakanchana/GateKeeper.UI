import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { QrCode } from 'src/app/models/qr-code.class';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { QrDisplayDialogComponent } from '../../qr-display-dialog/qr-display-dialog.component';

@Component({
  selector: 'app-view-qr-codes',
  templateUrl: './view-qr-codes.component.html',
  styleUrls: ['./view-qr-codes.component.scss']
})
export class ViewQrCodesComponent implements OnInit, OnDestroy {

  qrcId: number = 0;
  private paramMapSubscription: Subscription | null = null;
  private qrcSubscription: Subscription | null = null;
  loading: boolean = false;
  qrCode?: QrCode;

  constructor(
    private qrcSvc: QrCodeService, private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar, private dialog: MatDialog
    ) {

  }

  ngOnInit(): void {
    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.qrcId = Number(params.get('id'));
      if(this.qrcId > 0) {
        this.qrcSubscription = this.qrcSvc.getOne(this.qrcId)
        .subscribe({
          next: (qrc) => {
            this.qrCode = qrc;
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open('Something went wrong!', 'Dismiss');
            console.log(error);
          }
        });
      } // If ends.
    });
  }

  openQrPrintDialog(): void {
    if(this.qrCode !== undefined) {
      this.dialog.open(QrDisplayDialogComponent, {
        data: {
          qrcText: this.qrCode.qrCodeText,
          itemRefNo: this.qrCode.itemRefNo
        }
      });
    }
  }

  ngOnDestroy(): void {
    if(this.paramMapSubscription !== null)
      this.paramMapSubscription.unsubscribe();
    if(this.qrcSubscription !== null)
      this.qrcSubscription?.unsubscribe();
  }

}
