import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  web3: any = null;
  get web3Instance() { return this.web3; }

  chainIds: string[] = [
    '0x1', // ethereum mainnet
    '0x539', // ganache local 1337
  ];
  address: any = new BehaviorSubject<string>('');
  balance: any = new BehaviorSubject<number>(0);
  userLogged: any = new BehaviorSubject<boolean>(false);

  constructor() {
    if (typeof window.ethereum !== 'undefined') {
      // this.web3 = new Web3(window.ethereum);
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:1234"));
    } else {
      alert('No tienes instalado MetaMask!');
    }
  }

  connect() {
    this.handleIdChainChanged();
  }

  async handleIdChainChanged() {
    const chainId: string = await window.ethereum.request({ method: 'eth_chainId' });

    if (this.chainIds.includes(chainId)) {
      this.handleAccountsChanged();
    } else {
      alert('Selecciona la red principal de Ethereum (Mainet)');
    }

    window.ethereum.on('chainChanged', (res: string) => {
      if (!this.chainIds.includes(res)) {
        this.logout();
        alert('Red no detectada: ' + res);
        return;
      }
      if (this.address.getValue() === '') {
        this.handleAccountsChanged();
      } else {
        this.authBackend();
      }
    });
  }

  async handleAccountsChanged() {
    const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    this.address.next(accounts[0]);
    this.handleBalanceChanged();
    this.authBackend();

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      this.address.next(accounts[0]);
      this.handleBalanceChanged();
      this.authBackend();
    });
  }

  async handleBalanceChanged() {
    await this.web3.eth.getBalance(this.address.getValue(),async  (err: any, res:any) => {
      console.log('balance getted: ', res);
      let balanceEth = await Web3.utils.fromWei(res, 'ether');
      this.balance.next(balanceEth);
    });
  }


  async authBackend() {
    // => IF Success auth api backend
    this.userLogged.next(true);

    // => IF Failed auth api backend d
    //this.logout();
  }

  logout() {
    this.userLogged.next(false);
  }
}
