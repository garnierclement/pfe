import java.net.ConnectException;


import com.cycling74.max.*;

import org.json.simple.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;



public class NetScan extends MaxObject {
	
	
	private String info_server = "http://localhost:3000/nodes/";
	
	private HttpInfoRequestor net_info_getter = new HttpInfoRequestor();
		
	private JSONObject[] nodes ;
	
	private MaxBox[] node_interfaces;
	
	private MaxPatcher patcher = this.getParentPatcher();
	
	private int debug_mode = 1;
	
	
	
	public void bang(){
		
		get_server_info();
		
		//remove_node_interfaces();
		create_node_interfaces();
		
		  
	}
	
	public void get_server_info(){
		String raw_net_info = null;
		
		/* Send a HTTP GET request to the info server to get the JSON containing net_info*/
		try {
			raw_net_info = this.net_info_getter.sendGet(this.info_server);
			
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
			
			JSONObject raw = null;
			JSONObject[] nodes = null ;

			try{
				JSONParser jsonParser = new JSONParser();
				raw =  (JSONObject) jsonParser.parse(s);
				
				JSONArray array = (JSONArray) raw.get("nodes");
				Object[] n = array.toArray();
				
				JSONObject[] node_array = new JSONObject[n.length];
				for(int i=0;i<n.length;i++){
					node_array[i] = (JSONObject) jsonParser.parse(n[i].toString());
				}
				
				nodes = node_array;
				
			} catch (ParseException ex) {
				post("[ERROR!] Could not parse data");
				if(this.debug_mode == 1) ex.printStackTrace();
	        } catch (NullPointerException e){
	        	post("[ERROR!] No data to parse");
	        	if(this.debug_mode == 1) e.printStackTrace();
	        }
			
			return nodes;
	}
	
	public void create_node_interfaces(){
		
		MaxBox[] interfaces = new MaxBox[this.nodes.length];
		try {
			for(int i = 0; i<this.nodes.length; i++){
				
				System.out.println(this.nodes[i].get("name").toString());
				

				interfaces[i] = this.patcher.newDefault(122+i*302, 120, "patcher", Atom.parse(escape_space(this.nodes[i].get("name").toString())));
				MaxBox mxj_obj = interfaces[i].getSubPatcher().newDefault(270, 270, "mxj", Atom.parse("Node"));
				mxj_obj.send("set", new Atom[]{
						Atom.newAtom(0),
						Atom.newAtom(0),
						Atom.newAtom(this.nodes[i].get("name").toString()),
						Atom.newAtom(this.nodes[i].get("host").toString()),
						Atom.newAtom(this.nodes[i].get("id").toString()),
						Atom.newAtom(this.nodes[i].get("ip").toString())
					});
				mxj_obj.toBackground(true);
				
				interfaces[i].getSubPatcher().getWindow().setSize(280, 204);
				//interfaces[i].getSubPatcher().getWindow().setGrow(false);
				interfaces[i].getSubPatcher().setLocked(true);
				
				

				
			}
			
		} catch (NullPointerException e) {
			post("[ERROR!] nodes[] is empty");
			if(this.debug_mode == 1) e.printStackTrace();
		}
		
		this.node_interfaces = interfaces;
	}
	
	public void remove_node_interfaces(){
		if(this.node_interfaces != null){
			for(int i = 0; i< node_interfaces.length; i++) this.node_interfaces[i].remove();
		}else{
			System.out.println("No prexisting node");
		}
		
	}
	
	public String escape_space(String s){
		return s.replaceAll("\\s", "\\\\ ");
	}
	

}
