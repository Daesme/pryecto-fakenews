import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http'

declare let require: any;
const registro_contract = require('../../../build/contracts/FakeNews.json');


@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styleUrls: ['./validar.component.css']
})
export class ValidarComponent implements OnInit {
  titulo: string;
  id: Uint16Array;
  tema: string;
  fecha: string;
  descripcion: string;
  noticias: string[];
  registroContract: any;
  status: string;
  accounts: string[];
  account: string;
  titulos: string[];
  temas: string[];
  fechas: string[];
  urls: string[];

  url: string;
  hash : string;
  autor: string;



  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar,private http: HttpClient) { }

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
  

  public endpoint = 'https://hashtu.herokuapp.com/myApp/rest/archivo/';
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  async hastu(){
    

    const jsonToSend = {
      "url": this.url,
      "hash": "",
      "autor": this.account
    }

    this.http.post<any>(this.endpoint, jsonToSend, this.httpOptions).subscribe((data: any) =>{
      console.log(data);
      console.log(this.account);

      this.hash=data["hash"];
      this.autor=this.account;
      console.log(data["hash"]);
    });

    console.log(this.url);
    console.log(this.hash);
    console.log(this.account);
    

  }


  async getNoticia() {
    if (!this.registroContract) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }

    console.log('Lista de Usuarios Registrados ');
    try {
      const deployedRegistroContract = await this.registroContract.deployed();
      const numUsuarios = await deployedRegistroContract.getUsersCount.call();
      console.log("Numero de Usuarios " + numUsuarios);
      var tit = [];
      var tem = [];
      var fech = [];
      var ur = [];
      var aut = [];
      
      for (let i = 0; i < numUsuarios; i++) {
        const infoUsuario = await deployedRegistroContract.getNoticia.call(i, { from: this.account });
        console.log('Respuesta id Usuario : ' + infoUsuario[0]);
        console.log('Respuesta Titulo : ' + infoUsuario[1]);
        console.log('Respuesta Tema : ' + infoUsuario[2]);
        console.log('Respuesta Fecha: ' + infoUsuario[3]);
        console.log(this.account)
        console.log('hello'+aut.push(infoUsuario[5]));

        

        tit.push(infoUsuario[1]);
        tem.push(infoUsuario[2]);
        fech.push(infoUsuario[3]);
        ur.push(infoUsuario[4]);
        aut.push(infoUsuario[5]);
        
        this.titulos = tit;
        this.temas = tem;
        this.fechas = fech;
        this.urls=ur;

      }

    } catch (e) {
      console.log(e);
      this.setStatus('Error Obteniendo la informacion del Periodista; Revisar log.');
    }
  }

  


  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.account = accounts[0];
    });
  }


  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }

  async registraarImagen(){
    //this.hastu();
    
    if (!this.registroContract) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }
   this.setStatus('Inicializando transaccion... (Por favor Espere)');
   
   try {
    
     const deployedRegistroContract = await this.registroContract.deployed();
     const registroContractTransaction = await deployedRegistroContract.certificarArchivo.sendTransaction(this.url,this.hash, this.autor,{from: this.account});
     console.log('Nombre ' + this.url);
     console.log('Apellido ' + this.hash);
     console.log('email' + this.autor);
     if (!registroContractTransaction) {
       this.setStatus('Transaction Fallida!');
     } else {
       this.setStatus('Transaction Completada!');
     }
   } catch (e) {
     console.log(e);
     this.setStatus('Error Realizando el registro del Periodista; Ver Log.');
   }
  }

  async getValidaciones() {
    if (!this.registroContract) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }

    console.log('Lista de Usuarios Registrados ');
    try {
      const deployedRegistroContract = await this.registroContract.deployed();
     
      var tit = [];
      var tem = [];
      var fech = [];
      var ur = [];
      var aut = [];
      
        console.log("HOla")
        const infoUsuario = await deployedRegistroContract.obtenerInformacionArchivo.call(this.url, this.hash, { from: this.account });

        console.log('Respuesta id Usuario : ' + infoUsuario[0]);
        console.log('Respuesta Titulo : ' + infoUsuario[1]);
        console.log('Respuesta Tema : ' + infoUsuario[2]);


      

    } catch (e) {
      console.log(e);
      this.setStatus('Error Obteniendo la informacion del Periodista; Revisar log.');
    }
  }



}


