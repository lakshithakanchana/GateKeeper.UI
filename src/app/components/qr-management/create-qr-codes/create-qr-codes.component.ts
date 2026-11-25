import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ErrorsSummary } from 'src/app/models/errors-summary.class';
import { Location } from 'src/app/models/location.interface';
import { QrCode } from 'src/app/models/qr-code.class';
import { CustomFormValidatorsService } from 'src/app/services/custom-form-validators.service';
import { HttpErrorHandlerService } from 'src/app/services/http-error-handler.service';
import { LocationService } from 'src/app/services/location.service';
import { QrCodeService } from 'src/app/services/qr-code.service';

@Component({
  selector: 'app-create-qr-codes',
  templateUrl: './create-qr-codes.component.html',
  styleUrls: ['./create-qr-codes.component.scss']
})
export class CreateQrCodesComponent implements OnInit, OnDestroy {

  formQr: FormGroup;
  createSubscription: Subscription | null = null;
  errorsSummary: ErrorsSummary | null = null;
  loading: boolean = false;

  // Selec Options Related Arrays
  currentLocations: Location[] = [];

  constructor(
    public cFValidatorsSvc: CustomFormValidatorsService, private locationSvc: LocationService,
    private httpErrorHandelerSvc: HttpErrorHandlerService, private snackBar: MatSnackBar,
    private qrcSvc: QrCodeService, private router: Router, private activatedRoute: ActivatedRoute
    ) {
    this.formQr = new FormGroup({
      currentLocationId: new FormControl('', [Validators.required, cFValidatorsSvc.notZeroOrBelow]),
      createdUserId: new FormControl('take auto'),
      itemRefNo: new FormControl('', [Validators.required, Validators.minLength(5), cFValidatorsSvc.noWhiteSpacesAllowed]),
      qty: new FormControl('1', [Validators.required, Validators.min(1)]),
      itemSpecs: new FormControl('', [Validators.required]),
      active: new FormControl(true, [Validators.required])
    });
  }

  ngOnInit(): void {

    // Loading locations options
    this.loading = true;
    this.locationSvc.getMyLocations().subscribe({
      next: (locArr) => {
        this.currentLocations = locArr;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
        this.loading = false;
      }
    });

  }

  onSubmitClick() {

    const model: QrCode = this.formQr.value;
    if (model.currentLocationId && this.formQr.valid) {

      this.loading = true;

      if(this.createSubscription !== null)
        this.createSubscription.unsubscribe();

        setTimeout(() => {
          this.createSubscription = this.qrcSvc.create(model)
          .subscribe({
            next: (id: number) => {
              this.errorsSummary = null;
              this.loading = false;
              this.snackBar.open('QR Code created!', 'Dismiss');
              this.router.navigate([`../View/${id}`], {relativeTo: this.activatedRoute});
            },
            error: (error: HttpErrorResponse) => {
              this.errorsSummary = this.httpErrorHandelerSvc.handle(error);
              this.loading = false;
              this.snackBar.open('There are few data entry mistaks! Please fix them and retry!', 'Dismiss');
            }
          });
        }, 400);

        
    }  else {// End of if(this.model each value !== null)
      this.snackBar.open('Please, fix above validation errors first!', 'Dismiss');
    }

  }

  ngOnDestroy(): void {
    if(this.createSubscription !== null)
      this.createSubscription.unsubscribe();
  }

}
