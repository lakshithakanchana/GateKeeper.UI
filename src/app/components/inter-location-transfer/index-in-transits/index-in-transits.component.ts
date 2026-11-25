import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, map } from 'rxjs';
import { ErrorsSummary } from 'src/app/models/errors-summary.class';
import { InTransitVM } from 'src/app/models/view-models/in-transit-vm.interface';
import { HttpErrorHandlerService } from 'src/app/services/http-error-handler.service';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { DatePipe } from '@angular/common';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-index-in-transits',
  templateUrl: './index-in-transits.component.html',
  styleUrls: ['./index-in-transits.component.scss'],
  providers: [DatePipe]
})
export class IndexInTransitsComponent implements AfterViewInit, OnDestroy {

  inTransitSubscription: Subscription | null = null;
  interval: NodeJS.Timer | null              = null;
  errorsSummary: ErrorsSummary | null        = null;
  data: InTransitVM[] | null                   = null;
  dataSource: MatTableDataSource<InTransitVM>   = new MatTableDataSource();
  displayedColumns: string[] = ['goid', 'itemRefNo', 'from', 'to', 'dateTime', 'delay', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  private get fromDate() {
    if(this.filterForm.get('fromDate')?.value) {
      return new Date(this.filterForm.get('fromDate')!.value);
    }
    return null;
  }
  private get toDate() {
    if(this.filterForm.get('toDate')?.value) {
      return new Date(this.filterForm.get('toDate')!.value);
    }
    return null;
  }

  constructor(
    private qrcSvc: QrCodeService, private errorHandler: HttpErrorHandlerService,
    private papa: Papa, private datePipe: DatePipe
  ) {
    
  }

  ngAfterViewInit(): void {
    this.refreshInTransitList();
    this.interval = setInterval(() =>
      this.refreshInTransitList()
    , 1000*60);
  }

  refreshInTransitList() {

    if(this.inTransitSubscription != null)
      this.inTransitSubscription.unsubscribe();

    this.inTransitSubscription = this.qrcSvc.getInTransits()
    .pipe(
      map((goQrcBList) => {
        let tableData: InTransitVM[] = [];
        goQrcBList.forEach(qrQrcB => {
          if(qrQrcB.gateOut !== null) {
            tableData.push({
              goid: qrQrcB.gateOutId,
              itemRefNo: qrQrcB.qrCode?.itemRefNo,
              from: qrQrcB.gateOut.fromLocation?.locationName,
              to: qrQrcB.gateOut.toLocation?.locationName,
              dateTime: qrQrcB.gateOut.createdDateTime,
              delay: Math.round(Number( ((new Date()).getTime() - qrQrcB.gateOut.createdDateTime.getTime()) / (1000 * 60) ))
            });
          }
        });
        return tableData;
      })
    )
    .subscribe({
      next: (res: InTransitVM[]) => {
        this.data = res;
        this.dataSource = new MatTableDataSource(res);
        this.applyDateRangeFilter();
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

  applyDateRangeFilter(): void {
    if(this.data) {
      if(this.fromDate && this.toDate) {
        this.dataSource = new MatTableDataSource(
          this.data.filter(goVM =>
            goVM.dateTime.getTime() >= this.fromDate!.getTime()
            && goVM.dateTime.getTime() < this.toDate!.setDate(this.toDate!.getDate() + 1)
          )
        );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
  }

  exportCsv(): void {
    let headers = [
      'Gt.Out ID',
      'Item Ref / Reel Code',
      'From',
      'To',
      'Date/Time',
      'Delay(Minutes)'
    ];

    let data: string[][] = [];
    data.push(headers);
    this.dataSource.data.forEach(inTrVM => {
      data.push([
        inTrVM.goid.toString(),
        inTrVM.itemRefNo!,
        inTrVM.from!,
        inTrVM.to!,
        this.datePipe.transform(inTrVM.dateTime, 'dd MMM y h:mm a')!,
        inTrVM.delay.toString()
      ]);
    });
    let csv = this.papa.unparse(data);
    if(csv) {
      let csvFile = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
      let csvURL = window.URL.createObjectURL(csvFile);
      var tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', 'in-transits.csv');
      tempLink.click()
    }
  }

  ngOnDestroy(): void {
    if(this.inTransitSubscription != null)
      this.inTransitSubscription.unsubscribe();
    if(this.interval !== null)
      clearInterval(this.interval);
  }

}
