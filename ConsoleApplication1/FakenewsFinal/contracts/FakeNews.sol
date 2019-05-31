pragma solidity ^0.5.0;
contract Fakenews {
    
      struct Periodista{
	    string nombre;
	    string apellido; 
	    string email;
	    string contrasena;
		string tipo;
	}

       struct File{
          uint idNum;
          string titulo; 
          string tema; 
          string fecha; 
          string descripcion; 
          string url;
          string hash;
          string autor;
       }
       
    mapping (address => Periodista) periodistas; 
    mapping (string => File) archivos;
    
    address[] public periodistasAccts; 
    File[] public files;
    
    function registrarPeriodista(address _address, string memory nombre, string memory apellido, string memory email, string memory contrasena, string memory tipo)public {
	    periodistas[_address].nombre=nombre; 
	    periodistas[_address].apellido=apellido;
	    periodistas[_address].email=email;
	    periodistas[_address].contrasena=contrasena;
		periodistas[_address].tipo=tipo;

	    periodistasAccts.push(_address);
	    
	}
	
	function getPeridistas() view public returns (address[] memory){	
	    return periodistasAccts;
	    
	}
	
	
	function getPeriodista(address _address) view public returns (string memory, string memory, string memory, string memory, string memory) {
	    return (periodistas[_address].nombre, periodistas[_address].apellido, periodistas[_address].email, periodistas[_address].contrasena, periodistas[_address].tipo);
	}
	
	
	function cantidadPeriodistas() view public returns (uint){
	    return periodistasAccts.length; 
	    
	}
 

    function certificarArchivo(string memory url,string memory hash, string memory  autor) public{
        archivos[hash].url=url;
   	archivos[hash].hash=hash;
        archivos[hash].autor=autor;
    }

    function obtenerInformacionArchivo(string memory hash) view public returns (string memory, string memory) {
       return (archivos[hash].url, archivos[hash].autor);
    }
    
    function addNoticia(uint _idNum, string memory _titulo, string memory _tema, string memory _fecha, string memory _descripcion, string memory _url, string memory _autor) public returns(uint) {
        files.length++;
        files[files.length-1].idNum = _idNum;
        files[files.length-1].titulo = _titulo;
        files[files.length-1].tema = _tema;
        files[files.length-1].fecha = _fecha;
        files[files.length-1].descripcion = _descripcion;
        files[files.length-1].url = _url;
        files[files.length-1].autor = _autor;
        return files.length;
    }
    
     function getUsersCount() public view returns(uint) {
        return files.length;
    }
    
    function getNoticia(uint index) public view returns(uint, string memory, string memory, string memory,string memory, string memory) {
        return (files[index].idNum, files[index].titulo, files[index].tema, files[index].fecha,files[index].url,files[index].autor);
    }

    
}