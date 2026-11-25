import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, OnDestroy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, map } from 'rxjs';
import { ErrorsSummary } from 'src/app/models/errors-summary.class';
import { GateOutVM } from 'src/app/models/view-models/gate-out-vm.interface';
import { GateOutService } from 'src/app/services/gate-out.service';
import { HttpErrorHandlerService } from 'src/app/services/http-error-handler.service';
import { DatePipe } from '@angular/common';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-index-gate-outs',
  templateUrl: './index-gate-outs.component.html',
  styleUrls: ['./index-gate-outs.component.scss'],
  providers: [DatePipe]
})
export class IndexGateOutsComponent implements AfterViewInit, OnDestroy {

  gateOutSubscription: Subscription | null  = null;
  errorsSummary: ErrorsSummary | null       = null;
  data: GateOutVM[] | null                  = null;
  dataSource: MatTableDataSource<GateOutVM> = new MatTableDataSource();
  displayedColumns: string[] = ['goid', 'qrcid', 'itemRefNo', 'from', 'to', 'dateTime', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null                = null;

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
    private gateOutSvc: GateOutService, private errorHandler: HttpErrorHandlerService,
    private papa: Papa, private datePipe: DatePipe
  ) {
  
  }

  ngAfterViewInit(): void {
    this.refreshGateOutsList();
  }

  refreshGateOutsList() {

    if(this.gateOutSubscription != null)
      this.gateOutSubscription.unsubscribe();

    this.gateOutSubscription = this.gateOutSvc.get()
    .pipe(
      map((gateOutList) => {
        let tableData: GateOutVM[] = [];
        gateOutList.forEach(gateOut => {
          gateOut.qrCodes?.forEach(qrc => {
            tableData.push({
              goid: gateOut.gateOutId,
              qrcid: qrc.qrCodeId,
              itemRefNo: qrc.itemRefNo,
              from: gateOut.fromLocation?.locationName,
              to: gateOut.toLocation?.locationName,
              dateTime: gateOut.createdDateTime
            });
          });
        });
        return tableData;
      })
    )
    .subscribe({
      next: (res: GateOutVM[]) => {
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
      'QR ID',
      'Item Ref / Reel Code',
      'From',
      'To',
      'Date/Time'
    ];

    let data: string[][] = [];
    data.push(headers);
    this.dataSource.data.forEach(goVM => {
      data.push([
        goVM.goid.toString(),
        goVM.qrcid.toString(),
        goVM.itemRefNo,
        goVM.from!,
        goVM.to!,
        this.datePipe.transform(goVM.dateTime, 'dd MMM y h:mm a')!
      ]);
    });
    let csv = this.papa.unparse(data);
    if(csv) {
      let csvFile = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
      let csvURL = window.URL.createObjectURL(csvFile);
      var tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', 'gate-outs.csv');
      tempLink.click()
    }
  }

  ngOnDestroy(): void {
    if(this.gateOutSubscription != null)
      this.gateOutSubscription.unsubscribe();
  }

}
