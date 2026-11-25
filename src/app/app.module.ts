import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './modules/app-material.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LoginComponent } from './components/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorsSummaryComponent } from './components/errors-summary/errors-summary.component';
import { InterLocationTransferComponent } from './components/inter-location-transfer/inter-location-transfer.component';
import { IndexGateOutsComponent } from './components/inter-location-transfer/index-gate-outs/index-gate-outs.component';
import { CreateGateOutComponent } from './components/inter-location-transfer/create-gate-out/create-gate-out.component';
import { IndexInTransitsComponent } from './components/inter-location-transfer/index-in-transits/index-in-transits.component';
import { IndexGateInsComponent } from './components/inter-location-transfer/index-gate-ins/index-gate-ins.component';
import { CreateGateInComponent } from './components/inter-location-transfer/create-gate-in/create-gate-in.component';
import { ILTHistoryComponent } from './components/inter-location-transfer/ilthistory/ilthistory.component';
import { ILTDetailedHistoryComponent } from './components/inter-location-transfer/iltdetailed-history/iltdetailed-history.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { QrCodeListItemComponent } from './components/qr-code-list-item/qr-code-list-item.component';
import { QrScanDialogComponent } from './components/qr-scan-dialog/qr-scan-dialog.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ViewGateOutComponent } from './components/inter-location-transfer/view-gate-out/view-gate-out.component';
import { ViewGateInComponent } from './components/inter-location-transfer/view-gate-in/view-gate-in.component';
import { QrManagementComponent } from './components/qr-management/qr-management.component';
import { IndexQrCodesComponent } from './components/qr-management/index-qr-codes/index-qr-codes.component';
import { CreateQrCodesComponent } from './components/qr-management/create-qr-codes/create-qr-codes.component';
import { ViewQrCodesComponent } from './components/qr-management/view-qr-codes/view-qr-codes.component';
import { QRCodeModule } from 'angularx-qrcode';
import { QrDisplayDialogComponent } from './components/qr-display-dialog/qr-display-dialog.component';
import { NgxPrintModule } from 'ngx-print';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    SidenavComponent,
    LoginComponent,
    ErrorsSummaryComponent,
    InterLocationTransferComponent,
    IndexGateOutsComponent,
    CreateGateOutComponent,
    IndexInTransitsComponent,
    IndexGateInsComponent,
    CreateGateInComponent,
    ILTHistoryComponent,
    ILTDetailedHistoryComponent,
    PageNotFoundComponent,
    HomeComponent,
    QrCodeListItemComponent,
    QrScanDialogComponent,
    ViewGateOutComponent,
    ViewGateInComponent,
    QrManagementComponent,
    IndexQrCodesComponent,
    CreateQrCodesComponent,
    ViewQrCodesComponent,
    QrDisplayDialogComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    ZXingScannerModule,
    QRCodeModule,
    NgxPrintModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
