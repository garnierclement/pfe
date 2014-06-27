import java.net.ConnectException;
import java.util.ArrayList;
import java.util.Random;


import com.cycling74.max.*;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;



public class NetScan extends MaxObject {
	
	
	private String info_server = "http://localhost:3000/nodes/";
			
	private JSONObject[] nodes ;
	
	private MaxBox[] node_interfaces;
	
	private MaxPatcher patcher = this.getParentPatcher();
	
	private ArrayList<Integer> used_ports = new ArrayList<Integer>();
	
	private int MIN_PORT_NUMBER = 32000;
	
	private int MAX_PORT_NUMBER = 64000;

	private int debug_mode = 0;
	
	
	
	public void bang(){
		
		get_server_info();
		unassign_ports();
		create_new_ports();
		remove_node_interfaces();
		create_node_interfaces();
		
		  
	}
	
	public void get_server_info(){
		
		HttpInfoRequestor net_info_getter = new HttpInfoRequestor();
		String raw_net_info = null;
		
		/* Send a HTTP GET request to the info server to get the JSON containing net_info*/
		try {
			raw_net_info = net_info_getter.sendGet(this.info_server);
			
			if(this.debug_mode == 1) System.out.println("[DEBUG] " + raw_net_info);
			/* Sets the nodes[] array from the received from the info server*/
			this.nodes = parse_json(raw_net_info);
			
			/* Prints network info */
			this.getNetInfo();

					
			outlet(0, nodes.length);
		} catch (ConnectException e) {
			post("[ERROR!] Could not retrieve data from Information Server");
			if(this.debug_mode == 1) e.printStackTrace();
		} catch (NullPointerException e) {
			post("[ERROR!] nodes[] is empty");
			if(this.debug_mode == 1) e.printStackTrace();
		} catch (Exception e) {
			if(this.debug_mode == 1) e.printStackTrace();
		}
	}
	
	public void debug(){
		this.debug_mode = 1;
	}
	
	public void getNetInfo(){
		
		
		try {
			for (int k=0; k<this.nodes.length; k++){
				System.out.println(this.nodes[k].get("name"));
				System.out.println(this.nodes[k].get("host"));
				System.out.println(this.nodes[k].get("ip"));
				System.out.println(this.nodes[k].get("id"));
				System.out.println("*********************\n");
			}
		} catch (NullPointerException e) {
			post("[ERROR!] No data to print");
			if(this.debug_mode == 1) e.printStackTrace();
		}
		
	}
	
	public JSONObject[] parse_json(String s){

		JSONObject network = (JSONObject) JSONSerializer.toJSON(s);


		JSONArray nodes = network.getJSONArray("nodes");

		JSONObject [] node_array = new JSONObject[nodes.size()];
		for(int i=0;i<nodes.size();i++){
			node_array[i] = nodes.getJSONObject(i);
		}


		this.nodes = node_array;
		return this.nodes;

	}
	
	public void create_node_interfaces(){
		
		MaxBox[] interfaces = new MaxBox[this.nodes.length];
		try {
			for(int i = 0; i<this.nodes.length; i++){
				
				
				interfaces[i] = this.patcher.newDefault(122+i*302, 120, "patcher", Atom.parse(escape_space(this.nodes[i].get("name").toString())));
				MaxBox mxj_obj = interfaces[i].getSubPatcher().newDefault(344, 82, "mxj", Atom.parse("Node"));
				mxj_obj.send("set", new Atom[]{
						Atom.newAtom(0),
						Atom.newAtom(0),
						Atom.newAtom(this.nodes[i].get("name").toString()),
						Atom.newAtom(this.nodes[i].get("host").toString()),
						Atom.newAtom(this.nodes[i].get("id").toString()),
						Atom.newAtom(this.nodes[i].get("ip").toString()),
						Atom.newAtom(this.nodes[i].getJSONArray("sensors").toString())
				});

				
				mxj_obj.toBackground(true);
				mxj_obj.setRect(344, 82, 75,20);
				mxj_obj.setName("Node");
				
				interfaces[i].getSubPatcher().getWindow().setSize(391, 170);
				interfaces[i].getSubPatcher().setLocked(true);
				
				

				
			}
			
		} catch (NullPointerException e) {
			post("[ERROR!] nodes[] is empty");
			if(this.debug_mode == 1) e.printStackTrace();
		}
		this.node_interfaces = interfaces;
	}
	
	public void create_new_ports(){
		for(int i = 0; i < this.nodes.length; i++){
			JSONArray sensors = this.nodes[i].getJSONArray("sensors");
			for(int k=0; k < sensors.size(); k++){
				int port = assign_port();
				sensors.getJSONObject(k).put("port", port);
			}
		}
		System.out.println("USED PORTS: "+this.used_ports);
	}
	
	public void unassign_ports(){
		if(this.used_ports != null){
			this.used_ports.clear();
		}
	}
	
	public int assign_port() {
		int port = generate_random_port(this.MIN_PORT_NUMBER,this.MAX_PORT_NUMBER);;
		if(this.used_ports != null){
			while(this.used_ports.contains(port)){
				port = generate_random_port(this.MIN_PORT_NUMBER,this.MAX_PORT_NUMBER);
			}
		}
		this.used_ports.add(port);
		return port;
	}
	
	public int generate_random_port(int min, int max){
		
		Random r = new Random();
		return r.nextInt(max-min) + min;
	}

	public void remove_node_interfaces(){
		if(this.node_interfaces != null) for(int i = 0; i< node_interfaces.length; i++) this.node_interfaces[i].remove();
	}
	
	public String escape_space(String s){
		return s.replaceAll("\\s", "\\\\ ");
	}
	

}
