inlets=1;
outlets=1;
autowatch = 1; 

var Patcher = this.patcher;

var toggled = 0;


var Node = new function() {
    this.id = " ";
    this.ip = " ";
    this.name = " ";
    this.host = " ";
    this.graphical_offset = 0;
    this.receiver = null;
    this.setInfo = function (id, ip, name, host, offset) {
      this.id = id;
      this.ip = ip;
      this.name = name;
      this.host = host;
      this.graphical_offset = offset;
    };
    this.getInfo = function(){
      post();
      post('****NODE INFO****');
      post();
      post(this.host);
      post();
      post(this.name);
      post();
      post(this.ip);
      post();
      post(this.id);
      post();
      post('*****NODE INFO****');
      post();
   }; 
}





function msg_int(val){

 

	if((val == 1) ) {
    this.patcher.getnamed("downloader").message("download","http://localhost:3000/request/"+ Node.id, "matrix");
	}
  else{
    remove_receiver();
  }

  
	
}

function node_info(id, ip, name, host, graphical_offset){

  Node.setInfo(id, ip, name, host, graphical_offset);


}

function reply(val){
  if(val==Node.id){

    Node.receiver = new UdpReceive(Node.graphical_offset, Node.ip);

  }
}

function UdpReceive(offset, ip){
  this.receiver = Patcher.parentpatcher.newdefault(122 + offset * 302, 270 , "udpreceive", "16161");
  this.receiver.varname = "receiver " + ip;
  return Patcher.parentpatcher.getnamed(this.receiver.varname);

}

function remove_receiver(){
  Patcher.remove(Node.receiver);
}





