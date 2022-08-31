import { ChangeDetectorRef, Component } from '@angular/core';
import {Web3Service} from "../web3.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  userLogged: boolean = false;
  address: string = '';
  balance: number = 0;
  showAddress: boolean = false;

  web3: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private authWeb3Srv: Web3Service
  ) {
    this.web3 = this.authWeb3Srv.web3Instance;
  }

  public connect(): void {
    this.authWeb3Srv.connect();
  }

  public ngOnInit(): void {
    this.authWeb3Srv.userLogged.subscribe((res: boolean) => {
      this.userLogged = res;
      (!this.userLogged) ? this.showAddress = false : this.showAddress = true;
      this.cdr.detectChanges();
    });

    this.authWeb3Srv.address.subscribe((res: string) => {
      this.address = res;
      this.cdr.detectChanges();
    });

    this.authWeb3Srv.balance.subscribe((res: number) => {
      this.balance = res;
      this.cdr.detectChanges();
    });
  }

}
