import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-display-dialog',
  templateUrl: './qr-display-dialog.component.html',
  styleUrls: ['./qr-display-dialog.component.scss']
})
export class QrDisplayDialogComponent implements OnInit {

  qrcText: string = '';
  itemRefNo: string = '';
  isPrintButtonHidden: boolean = false;

  @ViewChild('hiddenPrintButton') hiddenPrintButton?: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: {qrcText: string, itemRefNo: string}
  ) { }

  print(): void {
    this.isPrintButtonHidden = true;
    setTimeout(() => this.hiddenPrintButton?.nativeElement.click(), 1000);
    setTimeout(() => this.isPrintButtonHidden = false, 3000);
  }

  ngOnInit(): void {
    this.qrcText = this.dialogData.qrcText;
    this.itemRefNo = this.dialogData.itemRefNo;
  }

}
