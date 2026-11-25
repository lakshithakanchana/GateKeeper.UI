import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, pipe, mergeMap } from 'rxjs';
import { Company } from 'src/app/models/company.interface';
import { Location } from 'src/app/models/location.interface';
import { DocumentType } from 'src/app/models/document-type.interface';
import { ErrorsSummary } from 'src/app/models/errors-summary.class';
import { GateOut } from 'src/app/models/gate-out.class';
import { CustomFormValidatorsService } from 'src/app/services/custom-form-validators.service';
import { GateOutService } from 'src/app/services/gate-out.service';
import { HttpErrorHandlerService } from 'src/app/services/http-error-handler.service';
import { CompanyService } from 'src/app/services/company.service';
import { LocationService } from 'src/app/services/location.service';
import { DocumentTypeService } from 'src/app/services/document-type.service';
import { QrCode } from 'src/app/models/qr-code.class';

import { MatDialog } from '@angular/material/dialog';
import { QrScanDialogComponent } from '../../qr-scan-dialog/qr-scan-dialog.component';
import { QrCodeService } from 'src/app/services/qr-code.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Driver } from 'src/app/models/other-models/driver.interface';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-create-gate-out',
  templateUrl: './create-gate-out.component.html',
  styleUrls: ['./create-gate-out.component.scss']
})
export class CreateGateOutComponent implements OnInit, OnDestroy {

  formGO: FormGroup;
  createSubscription: Subscription | null = null;
  uploadAttachmentSubscription: Subscription | null = null;
  errorsSummary: ErrorsSummary | null = null;
  loading: boolean = false;
  attachment?: Blob;

  drivers: Driver[] = [
    { epf: '0252', name: 'Jayalath' },
    { epf: '0245', name: 'Renuka' },
    { epf: '0447', name: 'Gayan' },
    { epf: '1007', name: 'Wasantha' },
    { epf: '1903', name: 'Nishantha' }
  ];

  vehicles: string[] = [
    'Fork Lift No. 01',
    'Fork Lift No. 04',
    'Fork Lift No. 05',
    'Fork Lift No. 06',
    'LE-6475'
  ]

  qrCodes: QrCode[] = []; // To keep app-qr-code-list-item required details.

  // Selec Options Related Arrays
  companies: Company[] = [];
  fromLocations: Location[] = [];
  toLocations: Location[] = [];
  documentTypes: DocumentType[] = [];

  constructor(private gateOutSvc: GateOutService, private httpErrorHandelerSvc: HttpErrorHandlerService, 
    private router: Router, private activatedRoute: ActivatedRoute, public cFValidatorsSvc: CustomFormValidatorsService,
    private companySvc: CompanyService, private locationSvc: LocationService,
    private docTypeSvc: DocumentTypeService, private dialog: MatDialog,
    private qrcSvc: QrCodeService, private snackBar: MatSnackBar) {

    this.formGO = new FormGroup({
      companyId: new FormControl('', [Validators.required, cFValidatorsSvc.notZeroOrBelow]),
      fromLocationId: new FormControl('', [Validators.required, cFValidatorsSvc.notZeroOrBelow, this.fromToLocationsConflict]),
      toLocationId: new FormControl('', [Validators.required, cFValidatorsSvc.notZeroOrBelow, this.fromToLocationsConflict]),
      documentTypeId: new FormControl('', [Validators.required, cFValidatorsSvc.notZeroOrBelow]),
      createdUserId: new FormControl('take auto'),
      vehicleNo: new FormControl('', [Validators.required]),
      driverEpfNo: new FormControl('', [Validators.required]),
      driverName: new FormControl('', [Validators.required]),
      attachedDocumentNo: new FormControl(''),
      tempAttachmentRef: new FormControl(''),
      qrCodeIds: new FormArray([

      ], Validators.required)
    });
  }

  ngOnInit(): void {

    // Loading companies options
    this.loading = true;
    this.companySvc.getCompanies().subscribe({
      next: (comArr) => {
        this.companies = comArr;
        this.loading = false;
        if(this.companies.length > 0)
          this.formGO.patchValue({companyId: this.companies[0].companyId})
      },
      error: (error: HttpErrorResponse) => {
        this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
        this.loading = false;
      }
    });

    // Loading fromLocations options
    this.loading = true;
    this.locationSvc.getMyLocations().subscribe({
      next: (locArr) => {
        this.fromLocations = locArr;
        this.loading = false;
        if(this.fromLocations.length > 0)
          this.formGO.patchValue({fromLocationId: this.fromLocations[0].locationId});
      },
      error: (error: HttpErrorResponse) => {
        this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
        this.loading = false;
      }
    });

    // Loading toLocations options
    this.loading = true;
    this.locationSvc.getLocations().subscribe({
      next: (locArr) => {
        this.toLocations = locArr;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
        this.loading = false;
      }
    });

    // Loading documentTyprs options
    this.loading = true;
    this.docTypeSvc.getDocumentTypes().subscribe({
      next: (dtArr) => {
        this.documentTypes = dtArr;
        this.loading = false;
        if(this.documentTypes.length > 0)
          this.formGO.patchValue({documentTypeId: this.documentTypes[0].documentTypeId})
      },
      error: (error: HttpErrorResponse) => {
        this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
        this.loading = false;
      }
    });

  }

  onDriverEpfChange(e: MatSelectChange): void {
    this.formGO.patchValue({
      driverName: this.drivers.find(d => d.epf === e.value)?.name
    });
  }

  onDriverNameChange(e: MatSelectChange): void {
    this.formGO.patchValue({
      driverEpfNo: this.drivers.find(d => d.name === e.value)?.epf
    });
  }

  fileInputChange(fileInputEvent: any): void {
    if(fileInputEvent.target.files.length > 0) {
      this.attachment = fileInputEvent.target.files[0];
    }
  }

  openQrScanDialog(): void {
    let dialogRef = this.dialog.open(QrScanDialogComponent);
    dialogRef.afterClosed().subscribe( (qrcText: string | null | undefined) => {
      if(qrcText !== null && qrcText !== undefined) {
        this.loading = true;
        this.qrcSvc.getQrCode(qrcText)
        .subscribe({
          next: (qrc: QrCode) => {
            if(this.qrCodes.find(q => q.qrCodeId === qrc.qrCodeId) === undefined) {
              this.qrCodes.push(qrc);
              this.addQrCodeIdToFormArray(qrc.qrCodeId);
            } else {
              this.snackBar.open('The same QR can not be scaned twice!', 'Dismiss');
            }
            this.loading = false;
          },
          error: (err: HttpErrorResponse) => {
            let errorsSummary: ErrorsSummary = this.httpErrorHandelerSvc.handle(err)
            this.snackBar.open(errorsSummary.errors[0], 'Dismiss');
            this.loading = false;
          }
        });
      }
    });
  }

  onQrCodeListItemDelete(qrcId: number) {
    // Removing iten from the FromGroup.FormArray
    const index = (<FormArray>this.formGO.get('qrCodeIds')).value
      .findIndex((qrcId_lmb: number) => qrcId_lmb === qrcId);
    if(index >= 0)
      (<FormArray>this.formGO.get('qrCodeIds')).removeAt(index);
    // Removing item from the this.qrCodes list
    this.qrCodes.splice(this.qrCodes.findIndex(qrc => qrc.qrCodeId === qrcId) , 1);
  }

  onSubmitClick() {

    const model: GateOut = this.formGO.value;
    if (
          model.companyId && model.fromLocationId && model.toLocationId
          && model.documentTypeId && model.vehicleNo && model.driverEpfNo
          && model.driverName && model.qrCodeIds && model.qrCodeIds.length > 0
      ) {

      this.loading = true;

      if(this.attachment && this.attachment.size > 0) {
        if(this.uploadAttachmentSubscription !== null)
          this.uploadAttachmentSubscription.unsubscribe();
        this.uploadAttachmentSubscription = this.gateOutSvc.uploadAttachment(this.attachment)
        .subscribe({
          next: (tempAttachmentRef: string) => {
            this.errorsSummary = null;
            model.tempAttachmentRef = tempAttachmentRef;
            this.createGateOut(model);
            this.snackBar.open('Attachment Uploaded!', 'Dismiss', { duration: 3000 });
          },
          error: (error: HttpErrorResponse) => {
            this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
            this.loading = false;
            this.snackBar.open('There was an error during attachment upload!', 'Dismiss');
          }
        });
      } else {
        model.tempAttachmentRef = '';
        this.createGateOut(model);
      }

    }  else {// End of if(this.model each value !== null)
      this.snackBar.open('Some of the required fields are still empty!', 'Dismiss');
    }

  }

  private createGateOut(model: GateOut): void {
    if(this.createSubscription)
      this.createSubscription.unsubscribe();
    this.createSubscription = this.gateOutSvc.createGateOut(model)
    .subscribe({
      next: (id: number) => {
        this.errorsSummary = null;
        this.loading = false;
        this.snackBar.open('Gate Out created!', 'Dismiss', { duration: 3000 });
        this.router.navigate([`../${id}`], {relativeTo: this.activatedRoute});
      },
      error: (error: HttpErrorResponse) => {
        this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
        this.loading = false;
        this.snackBar.open('There are few data entry mistaks! Please fix them and retry!', 'Dismiss');
      }
    });
  }

  addQrCodeIdToFormArray(qrcId: number): void {
    (<FormArray>this.formGO.get('qrCodeIds')).push(
      new FormControl(qrcId, [Validators.required, this.cFValidatorsSvc.notZeroOrBelow])
    );
  }

  fromToLocationsConflict(control: AbstractControl): ValidationErrors | null {
    let fromLoc = control.parent?.value?.fromLocationId;
    let toLoc = control.parent?.value?.toLocationId;
    if(control.value == fromLoc || control.value == toLoc) {
      return {fromToLocationsConflict: true}
    }
    return null;
  }

  ngOnDestroy(): void {
    if(this.createSubscription)
      this.createSubscription.unsubscribe();
    if(this.uploadAttachmentSubscription)
      this.uploadAttachmentSubscription.unsubscribe();
  }

}
