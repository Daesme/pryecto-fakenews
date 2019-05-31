import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
declare let require: any;
const registro_contract = require('../../../build/contracts/FakeNews.json');

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  nombre : string;
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
      console.log('Respuesta email Instructor : ' + infoPeriodista[0]);
	    console.log('Respuesta Nombre Periodista : ' + infoPeriodista[1]);
      console.log('Respuesta Apellido Periodista : ' + infoPeriodista[2]);
      console.log('Respuesta contrasena Periodista : ' + infoPeriodista[3]);
      console.log('Respuesta tipo : ' + infoPeriodista[4]);
      console.log('Respuesta DirecciÃƒÂ³n Periodista : ' + this.account);
	  
      
    } catch (e) {
      console.log(e);
      this.setStatus('Error Obteniendo la informacion del Periodista; Revisar log.');
    }
  }

 
  
    async registrarPeriodista(){
	 if (!this.registroContract) {
       this.setStatus('Metacoin is not loaded, unable to send transaction');
       return;
     }
	
   console.log('Nombre ' + this.nombre);
	 console.log('Apellido ' + this.apellido);
   console.log('email' + this.email);
   console.log('contrasena' + this.contrasena);
	 
 	 this.setStatus('Inicializando transaccion... (Por favor Espere)');
	  
	  try {
      const deployedRegistroContract = await this.registroContract.deployed();
      const registroContractTransaction = await deployedRegistroContract.registrarPeriodista.sendTransaction(this.account,this.email,this.nombre,this.apellido,this.contrasena,this.tipo,{from: this.account});
	  	   
      if (!registroContractTransaction) {
        this.setStatus('Transaction Fallida!');
      } else {
        this.setStatus('Transaction Completada!');
		this.getPeriodista();
		
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error Realizando el registro del Periodista; Ver Log.');
    }
	
  }
  
  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }
 
  
  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }
}



