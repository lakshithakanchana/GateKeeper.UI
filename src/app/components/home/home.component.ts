import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authSvc: AuthService) {
  }

  haveStoreKeeperRole: boolean      = false;
  haveSecurityOfficerRole: boolean  = false;

  ngOnInit(): void {
    this.haveStoreKeeperRole = this.authSvc.haveThisRole('StoreKeeper');
    this.haveSecurityOfficerRole = this.authSvc.haveThisRole('SecurityOfficer');
  }
  
}
