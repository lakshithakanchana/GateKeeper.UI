import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  constructor(private authSvc: AuthService) {
  }

  haveStoreKeeperRole: boolean      = false;
  haveSecurityOfficerRole: boolean  = false;

  ngOnInit(): void {

    this.haveStoreKeeperRole = this.authSvc.haveThisRole('StoreKeeper');
    this.haveSecurityOfficerRole = this.authSvc.haveThisRole('SecurityOfficer');

    this.authSvc.getLoginStatus().subscribe({
      next: () => {
        this.haveStoreKeeperRole = this.authSvc.haveThisRole('StoreKeeper');
        this.haveSecurityOfficerRole = this.authSvc.haveThisRole('SecurityOfficer');
      }
    });
    
  }

}
