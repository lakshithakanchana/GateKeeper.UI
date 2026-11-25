import { HttpErrorResponse } from '@angular/common/http';
import { Component,ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorsSummary } from 'src/app/models/errors-summary.class';
import { GateInVM } from 'src/app/models/view-models/gate-in-vm.interface';
import { GateInService } from 'src/app/services/gate-in.service';
import { HttpErrorHandlerService } from 'src/app/services/http-error-handler.service';
import { QrScanDialogComponent } from '../../qr-scan-dialog/qr-scan-dialog.component';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-index-gate-ins',
  templateUrl: './index-gate-ins.component.html',
  styleUrls: ['./index-gate-ins.component.scss'],
  providers: [DatePipe]
})
export class IndexGateInsComponent implements AfterViewInit, OnDestroy {

  gateInSubscription: Subscription | null  = null;
  errorsSummary: ErrorsSummary | null      = null;
  data: GateInVM[] | null                  = null;
  dataSource: MatTableDataSource<GateInVM> = new MatTableDataSource();
  displayedColumns: string[] = ['giid', 'goid', 'qrcid', 'itemRefNo', 'location', 'gateOutDateTime', 'gateInDateTime', 'delay', 'actions'];

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
    private gateInSvc: GateInService, private errorHandler: HttpErrorHandlerService,
    private snackBar: MatSnackBar, private dialog: MatDialog, private qrcSvc: QrCodeService,
    private router: Router, private activatedRoute: ActivatedRoute, private papa: Papa,
    private datePipe: DatePipe
  ) {
    
  }

  ngAfterViewInit(): void {
    this.refreshGateInsList();
  }

  refreshGateInsList() {

    if(this.gateInSubscription != null)
      this.gateInSubscription.unsubscribe();

    this.gateInSubscription = this.gateInSvc.get()
    .pipe(
      map((gateInList) => {
        let tableData: GateInVM[] = [];
        gateInList.forEach(gateIn => {
          let gateOutDT = gateIn.gateOut !== null ? gateIn.gateOut.createdDateTime : gateIn.createdDateTime;
            tableData.push({
              giid: gateIn.gateInId,
              goid: gateIn.gateOutId,
              qrcid: gateIn.qrCodeId,
              itemRefNo: gateIn.qrCode !== null ? gateIn.qrCode.itemRefNo : '',
              location: gateIn.location?.locationName,
              gateOutDateTime: gateOutDT,
              gateInDateTime: gateIn.createdDateTime,
              delay: Math.round(Number( (gateIn.createdDateTime.getTime() - gateOutDT.getTime())/(1000 * 60) ))
            });
        });
        return tableData;
      })
    )
    .subscribe({
      next: (res: GateInVM[]) => {
        this.data = res;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.applyDateRangeFilter();
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
          this.data.filter(giVM =>
            giVM.gateInDateTime.getTime() >= this.fromDate!.getTime()
            && giVM.gateInDateTime.getTime() < this.toDate!.setDate(this.toDate!.getDate() + 1)
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
      'Gt.In ID',
      'Gt.Out ID',
      'QR ID',
      'Item Ref / Reel Code',
      'Location',
      'Gt.Out Date/Time',
      'Gt.In Date/Time',
      'Delay(Minutes)'
    ];

    let data: string[][] = [];
    data.push(headers);
    this.dataSource.data.forEach(goVM => {
      data.push([
        goVM.giid.toString(),
        goVM.goid.toString(),
        goVM.qrcid.toString(),
        goVM.itemRefNo,
        goVM.location!,
        this.datePipe.transform(goVM.gateOutDateTime, 'dd MMM y h:mm a')!,
        this.datePipe.transform(goVM.gateInDateTime, 'dd MMM y h:mm a')!,
        goVM.delay.toString()
      ]);
    });
    let csv = this.papa.unparse(data);
    if(csv) {
      let csvFile = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
      let csvURL = window.URL.createObjectURL(csvFile);
      var tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', 'gate-ins.csv');
      tempLink.click()
    }
  }

  openQrScanDialog(): void {
    let dialogRef = this.dialog.open(QrScanDialogComponent);
    dialogRef.afterClosed().subscribe( (qrcText: string | null | undefined) => {
      if(qrcText !== null && qrcText !== undefined) {
        let qrcId = this.qrcSvc.getIdFromQrCodeText(qrcText);
        this.router.navigate([`New/${qrcId}`], {relativeTo: this.activatedRoute});
      }
    });
  }

  ngOnDestroy(): void {
    if(this.gateInSubscription != null)
      this.gateInSubscription.unsubscribe();
  }

}
