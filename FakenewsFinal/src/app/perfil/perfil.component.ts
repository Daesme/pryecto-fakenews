import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';


declare let require: any;
const registro_contract = require('../../../build/contracts/FakeNews.json');

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  tipo: string;
  registroContract: any;
  status: string;
  accounts: string[];
  account: string;



  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    this.watchAccount();
    this.web3Service.artifactsToContract(registro_contract)
      .then((registro_contractAbstraction) => {
        this.registroContract = registro_contractAbstraction;
        this.registroContract.deployed().then(deployed => {
          console.log(deployed);
          this.getPeriodista();
        });

      });

     

  }

  async getPeriodista() {
    
    if (!this.registroContract) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }

    console.log('Periodista Ingresado: ');
    try {
      const deployedRegistroContract = await this.registroContract.deployed();
      const infoPeriodista = await deployedRegistroContract.getPeriodista.call(this.account);
      this.nombre = infoPeriodista[1];
      this.apellido = infoPeriodista[2];
      this.email = infoPeriodista[3];
      this.tipo = infoPeriodista[4];
      console.log('Respuesta email Instructor : ' + infoPeriodista[0]);
      console.log('Respuesta Nombre Periodista : ' + infoPeriodista[1]);
      console.log('Respuesta Apellido Periodista : ' + infoPeriodista[2]);
      console.log('Respuesta contrasena Periodista : ' + infoPeriodista[3]);
      console.log('Respuesta DirecciÃƒÂ³n Periodista : ' + this.account);


    } catch (e) {
      console.log(e);
      this.setStatus('Error Obteniendo la informacion del Periodista; Revisar log.');
    }
  }


  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
      this.getPeriodista();
    
    });
  }


  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }
}


