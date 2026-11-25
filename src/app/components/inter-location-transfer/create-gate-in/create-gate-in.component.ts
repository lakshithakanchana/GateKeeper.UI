import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Company } from 'src/app/models/company.interface';
import { ErrorsSummary } from 'src/app/models/errors-summary.class';
import { GateIn } from 'src/app/models/gate-in.class';
import { GateOut } from 'src/app/models/gate-out.class';
import { Location } from 'src/app/models/location.interface';
import { QrCode } from 'src/app/models/qr-code.class';
import { CompanyService } from 'src/app/services/company.service';
import { CustomFormValidatorsService } from 'src/app/services/custom-form-validators.service';
import { GateInService } from 'src/app/services/gate-in.service';
import { GateOutService } from 'src/app/services/gate-out.service';
import { HttpErrorHandlerService } from 'src/app/services/http-error-handler.service';
import { LocationService } from 'src/app/services/location.service';
import { QrCodeService } from 'src/app/services/qr-code.service';

@Component({
  selector: 'app-create-gate-in',
  templateUrl: './create-gate-in.component.html',
  styleUrls: ['./create-gate-in.component.scss']
})
export class CreateGateInComponent implements OnInit, OnDestroy {

  formGI: FormGroup;
  createSubscription: Subscription | null = null;
  private paramMapSubscription: Subscription | null = null;
  errorsSummary: ErrorsSummary | null = null;
  loading: boolean = false;

  // Selec Options Related Arrays
  companies: Company[] = [];
  locations: Location[] = [];

  // Readonly values related properties
  gateOut?: GateOut;
  qrCode?: QrCode;

  constructor(
    private gateInSvc: GateInService, private httpErrorHandelerSvc: HttpErrorHandlerService, 
    private router: Router, private activatedRoute: ActivatedRoute,
    private companySvc: CompanyService, private locationSvc: LocationService,
    public cFValidatorsSvc: CustomFormValidatorsService, private snackBar: MatSnackBar,
    private gateOutSvc: GateOutService, private qrcSvc: QrCodeService
  ) {

    this.formGI = new FormGroup({
      companyId: new FormControl('', [Validators.required, cFValidatorsSvc.notZeroOrBelow]),
      locationId: new FormControl('', [Validators.required, cFValidatorsSvc.notZeroOrBelow]),
      qrCodeId: new FormControl('', [Validators.required]),
      createdUserId: new FormControl('take auto'),
      remarks: new FormControl('')
    });
  }

  ngOnInit(): void {

    this.paramMapSubscription = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      let qrCodeId: number = Number(params.get('id'));
      this.formGI.patchValue({
        qrCodeId: qrCodeId
      });
      if(qrCodeId > 0) {
        
        // Loading the Latest Gate Out
        this.loading = true;
        this.gateOutSvc.getGateOutFromQrIdIfInTransitUrl(qrCodeId).subscribe({
          next: (gateOut) => {
            this.gateOut = gateOut;
            this.loading = false;
          },
          error: (error: HttpErrorResponse) => {
            this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
            this.loading = false;
          }
        });

        // Loading the QrCode model
        // TODO: Need to synce loding bar in the form with also this.
        this.qrcSvc.getOne(qrCodeId).subscribe({
          next: (qrCode) => {
            this.qrCode = qrCode;
          },
          error: (error: HttpErrorResponse) => {

          }
        });

      } // If ends.
    });
    
    // Loading companies options
    this.loading = true;
    this.companySvc.getCompanies().subscribe({
      next: (comArr) => {
        this.companies = comArr;
        this.loading = false;
        if(this.companies.length > 0)
          this.formGI.patchValue({companyId: this.companies[0].companyId});
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
        this.locations = locArr;
        this.loading = false;
        if(this.locations.length > 0)
          this.formGI.patchValue({locationId: this.locations[0].locationId});
      },
      error: (error: HttpErrorResponse) => {
        this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
        this.loading = false;
      }
    });

  }

  onSubmitClick() {

    const model: GateIn = this.formGI.value;
    if ( model.companyId && model.locationId && model.qrCodeId ) {

      this.loading = true;

      if(this.createSubscription !== null)
        this.createSubscription.unsubscribe();

        setTimeout(() => {
          this.createSubscription = this.gateInSvc.createGateIn(model)
          .subscribe({
            next: (id: number) => {
              this.errorsSummary = null;
              this.loading = false;
              this.snackBar.open('Gate In created!', 'Dismiss');
              this.router.navigate([`../../${id}`], {relativeTo: this.activatedRoute});
            },
            error: (error: HttpErrorResponse) => {
              this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
              this.loading = false;
              this.snackBar.open('There are few data entry mistaks! Please fix them and retry!', 'Dismiss');
            }
          });
        }, 400);

        
    }  else {// End of if(this.model each value !== null)
      this.snackBar.open('Some of the required fields are still empty!', 'Dismiss');
    }

  }

  ngOnDestroy(): void {
    if(this.createSubscription !== null)
      this.createSubscription.unsubscribe();
    if(this.paramMapSubscription !== null)
      this.paramMapSubscription?.unsubscribe();
  }

}
