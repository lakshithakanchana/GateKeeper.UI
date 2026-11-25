import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-qr-scan-dialog',
  templateUrl: './qr-scan-dialog.component.html',
  styleUrls: ['./qr-scan-dialog.component.scss']
})
export class QrScanDialogComponent implements OnInit, OnDestroy {

  allowedFormats: BarcodeFormat[] = [BarcodeFormat.QR_CODE]
  private periodicChecker?: NodeJS.Timer;

  constructor(private dialogRef: MatDialogRef<QrScanDialogComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {

    setTimeout(() => {
      this.dialogRef.close(null);
    }, 30 * 1000);

    this.periodicChecker = setInterval(() => {
      if(!document.hasFocus()) {
        this.dialogRef.close(null);
      }
    }, 1000);

  }

  onScanSuccess(barcode: string): void {
    this.dialogRef.close(barcode);
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: FocusEvent): void {
    this.dialogRef.close(null);
  }

  ngOnDestroy(): void {
    if(this.periodicChecker !== undefined) {
      clearInterval(this.periodicChecker);
    }
  }

}
