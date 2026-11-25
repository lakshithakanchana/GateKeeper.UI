import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, map } from 'rxjs';
import { ErrorsSummary } from 'src/app/models/errors-summary.class';
import { QrCodeVM } from 'src/app/models/view-models/qr-code-vm';
import { HttpErrorHandlerService } from 'src/app/services/http-error-handler.service';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { DatePipe } from '@angular/common';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-index-qr-codes',
  templateUrl: './index-qr-codes.component.html',
  styleUrls: ['./index-qr-codes.component.scss'],
  providers: [DatePipe]
})
export class IndexQrCodesComponent implements AfterViewInit, OnDestroy {

  qrCodeSubscription: Subscription | null  = null;
  errorsSummary: ErrorsSummary | null       = null;
  dataSource: MatTableDataSource<QrCodeVM>   = new MatTableDataSource();
  displayedColumns: string[] = ['qrcid', 'itemRefNo', 'qty', 'createdLocation', 'dateTime', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(
    private qrcSvc: QrCodeService, private errorHandler: HttpErrorHandlerService,
    private papa: Papa, private datePipe: DatePipe
  ) {
    
  }

  ngAfterViewInit(): void {
    this.refreshQrCodeList();
  }

  refreshQrCodeList() {

    if(this.qrCodeSubscription != null)
      this.qrCodeSubscription.unsubscribe();

    this.qrCodeSubscription = this.qrcSvc.get()
    .pipe(
      map((qrcList) => {
        let tableData: QrCodeVM[] = [];
        qrcList.forEach(qrc => {
          tableData.push({
            qrcid: qrc.qrCodeId,
            itemRefNo: qrc.itemRefNo,
            qty: qrc.qty,
            createdLocation: qrc.currentLocation?.locationName,
            dateTime: qrc.createdDateTime
          });
        });
        return tableData;
      })
    )
    .subscribe({
      next: (res: QrCodeVM[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.errorsSummary = null;
      },
      error: (error: HttpErrorResponse) => this.errorsSummary = this.errorHandler.handle(error)
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportCsv(): void {
    let headers = [
      'QR ID',
      'Item Ref / Reel Code',
      'Qty',
      'Created Location',
      'Created Date/Time'
    ];

    let data: string[][] = [];
    data.push(headers);
    this.dataSource.data.forEach(qrc => {
      data.push([
        qrc.qrcid.toString(),
        qrc.itemRefNo,
        qrc.qty.toString(),
        qrc.createdLocation!,
        this.datePipe.transform(qrc.dateTime, 'dd MMM y h:mm a')!
      ]);
    });
    let csv = this.papa.unparse(data);
    if(csv) {
      let csvFile = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
      let csvURL = window.URL.createObjectURL(csvFile);
      var tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', 'qrcodes.csv');
      tempLink.click()
    }
  }

  ngOnDestroy(): void {
    if(this.qrCodeSubscription != null)
      this.qrCodeSubscription.unsubscribe();
  }

}
