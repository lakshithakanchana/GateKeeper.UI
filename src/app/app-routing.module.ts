import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InterLocationTransferComponent } from './components/inter-location-transfer/inter-location-transfer.component';
import { IndexGateOutsComponent } from './components/inter-location-transfer/index-gate-outs/index-gate-outs.component';
import { IndexInTransitsComponent } from './components/inter-location-transfer/index-in-transits/index-in-transits.component';
import { IndexGateInsComponent } from './components/inter-location-transfer/index-gate-ins/index-gate-ins.component';
import { CreateGateOutComponent } from './components/inter-location-transfer/create-gate-out/create-gate-out.component';
import { CreateGateInComponent } from './components/inter-location-transfer/create-gate-in/create-gate-in.component';
import { ILTHistoryComponent } from './components/inter-location-transfer/ilthistory/ilthistory.component';
import { ILTDetailedHistoryComponent } from './components/inter-location-transfer/iltdetailed-history/iltdetailed-history.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { ViewGateOutComponent } from './components/inter-location-transfer/view-gate-out/view-gate-out.component';
import { ViewGateInComponent } from './components/inter-location-transfer/view-gate-in/view-gate-in.component';
import { QrManagementComponent } from './components/qr-management/qr-management.component';
import { IndexQrCodesComponent } from './components/qr-management/index-qr-codes/index-qr-codes.component';
import { CreateQrCodesComponent } from './components/qr-management/create-qr-codes/create-qr-codes.component';
import { ViewQrCodesComponent } from './components/qr-management/view-qr-codes/view-qr-codes.component';
import { AuthGuardService } from './services/gurds/auth-guard.service';
import { UserRoles } from './models/user-roles.class';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { LoginPageGuardService } from './services/gurds/login-page-guard.service';

const routes: Routes = [
  { path: "", redirectTo: "Login", pathMatch: 'full' },
  { path: "Login", component: LoginComponent, canActivate: [LoginPageGuardService] },
  { path: "Home", component: HomeComponent, canActivate: [AuthGuardService] },
  { path: "Forbidden", component: ForbiddenComponent },
  {
    path: "Inter-Location-Transfer",
    component: InterLocationTransferComponent,
    canActivate: [AuthGuardService],
    data: { roles: [UserRoles.securityOfficer] },
    children: [
      {
        path: "", redirectTo: "Gate-Out", pathMatch: 'full'
      },
      {
        path: "Gate-Out",
        children: [
          {path: "", component: IndexGateOutsComponent},
          {path: "New", component: CreateGateOutComponent},
          {path: ":id", component: ViewGateOutComponent}
        ]
      },
      {
        path: "In-Transit", component: IndexInTransitsComponent
      },
      {
        path: "Gate-In",
        children: [
          {path: "", component: IndexGateInsComponent},
          {path: ":id", component: ViewGateInComponent},
          {path: "New/:id", component: CreateGateInComponent}
        ]
      },
      {
        path: "History",
        children: [
          {path: "", component: ILTHistoryComponent},
          {path: ":id", component: ILTDetailedHistoryComponent}
        ]
      }
    ]
  },
  {
    path: "Qr-Management",
    component: QrManagementComponent, 
    canActivate: [AuthGuardService],
    data: { roles: [UserRoles.storeKeeper] },
    children: [
      { path: '', redirectTo: 'Index', pathMatch: 'full' },
      { path: "Index", component: IndexQrCodesComponent, pathMatch: 'full' },
      { path: 'New', component: CreateQrCodesComponent },
      {
        path: 'View', children: [
          { path: '', redirectTo: '1', pathMatch: 'full' },
          { path: ':id', component: ViewQrCodesComponent }
        ]
      }
    ]
  },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
