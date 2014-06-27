import java.util.ArrayList;
import java.util.Random;
import com.cycling74.max.*;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;


/**
 * This class retrieves network information from the Manticore through an HTTP communication and generates the corresponding nodes and their GUIs.
 * @author Homere Faivre.
 * @since 27/06/2014.
 */
public class NetScan extends MaxObject {
	
	/**
	 * URL to request network information from the local HTTP server.
	 */
	private String info_server = "http://localhost:3000/nodes/";
			
	/**
	 * JSONObject array containing node JSONObjects with the following structure:
	 * {
      "id": "8a3343d0-fdaa-11e3-ab36-9fc80793e9fe",
      "host": "Homys-Toaster.local",
      "name": "Homy's Toaster",
      "ip": "127.0.0.1",
      "sensors": [
        
      ],
      "itself": "true"
     * @since 27/06/2014.
	 */
	private JSONObject[] nodes ;
	
	/**
	 * Array of MaxBoxs containing all the node GUIs.
	 * @since 27/06/2014.
	 */
	private MaxBox[] node_interfaces;
	
	/**
	 * The used patcher.
	 * @since 27/06/2014.
	 */
	private MaxPatcher patcher = this.getParentPatcher();
	
	/**
	 * List of all used ports.
	 * @since 27/06/2014.
	 */
	private ArrayList<Integer> used_ports = new ArrayList<Integer>();
	
	/**
	 * Minimum port range.
	 * @since 27/06/2014.
	 */
	private int MIN_PORT_NUMBER = 32000;
	
	/**
	 * Maximum port range.
	 * @since 27/06/2014.
	 */
	private int MAX_PORT_NUMBER = 64000;

	/**
	 * Debug mode, default set to 0, true if set to 1.
	 * @since 27/06/2014.
	 */
	private int debug_mode = 0;
	
	
	/**
	 * A bang signal to the NetScan java internal will trigger several actions : 
	 * 	- Retrieval of network info from the local HTTP server.
	 * 	- Reset of the used port list and node GUIs.
	 * 	- Creation of new port list and node GUI according to retrieved network data.
	 * @see com.cycling74.max.MaxObject#bang().
	 * @since 27/06/2014.
	 */
	public void bang(){
		
		get_server_info();
		unassign_ports();
		create_new_ports();
		remove_node_interfaces();
		create_node_interfaces();
		
		  
	}
	
	/**
	 * Retrieves network information from the local HTTP server by sending a GET request to the this.info_server URL.
	 * @exception Exception in case the HTTP request cannot be made.
	 * @since 27/06/2014.
	 */
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
			if(this.nodes != null) this.getNetInfo();

					
			outlet(0, nodes.length);
		} catch (Exception e) {
			post("[ERROR!] Could not retrieve data from Information Server");
			if(this.debug_mode == 1) e.printStackTrace();
		}
	}
	
	/**
	 * Sets the program in debug mode (debug_mode = 1).
	 * @since 27/06/2014.
	 */
	public void debug(){
		this.debug_mode = 1;
	}
	
	/**
	 * Posts the network info from the this.nodes field to the Max/MSP console.
	 * @since 27/06/2014.
	 */
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
	
	/**
	 * Parses the Network information (String) and returns a JSONObject array containing nodes.
	 * @param s Network information as a string.
	 * @return nodes Array of JSONObjects containing the parsed nodes.
	 * @since 27/06/2014.
	 * 
	 */
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
	
	/**
	 * Creates the node GUIs and adds them to the this.node_interfaces field. These GUI appear in external patcher windows, while the patcher objects are created within the same  patcher, that is to say this.patcher.
	 * @exception NullPointerExcption if the this.nodes object is null.
	 * @since 27/06/2014.
	 */
	public void create_node_interfaces(){
		
		/*Array of Max Patcher which will contain the node GUIs.*/
		MaxBox[] interfaces = new MaxBox[this.nodes.length];
		try {
			for(int i = 0; i<this.nodes.length; i++){
				
				/* Fill interfaces[] with Max patcher which each contain one MXJ Node object*/
				interfaces[i] = this.patcher.newDefault(122+i*302, 120, "patcher", Atom.parse(escape_space(this.nodes[i].get("name").toString())));
				MaxBox mxj_obj = interfaces[i].getSubPatcher().newDefault(344, 82, "mxj", Atom.parse("Node"));
				
				/* Set the MXJ Node object with specific parameters */
				mxj_obj.send("set", new Atom[]{
						/* x position */
						Atom.newAtom(0),
						/* y position */
						Atom.newAtom(0),
						/* name */
						Atom.newAtom(this.nodes[i].get("name").toString()),
						/* host name */
						Atom.newAtom(this.nodes[i].get("host").toString()),
						/* id */
						Atom.newAtom(this.nodes[i].get("id").toString()),
						/* IP address */
						Atom.newAtom(this.nodes[i].get("ip").toString()),
						/* sensors */
						Atom.newAtom(this.nodes[i].getJSONArray("sensors").toString())
				});

				
				mxj_obj.toBackground(true);
				mxj_obj.setRect(344, 82, 75,20);
				mxj_obj.setName("Node");
				
				/* Set the Patchers in interfaces[] visible and locked */
				interfaces[i].getSubPatcher().getWindow().setSize(391, 170);
				interfaces[i].getSubPatcher().setLocked(true);
				
			}
			
		} catch (NullPointerException e) {
			post("[ERROR!] nodes[] is empty");
			if(this.debug_mode == 1) e.printStackTrace();
		}
		this.node_interfaces = interfaces;
	}
	
	/**
	 * Calls the assign_port() method for each sensor in the this.nodes sensors JSONArray and adds the generated port in the sensor JSONObject. 
	 * @since 27/06/2014 .
	 */
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
	
	/**
	 * Unassigns all ports from previous bangs sent to the NetScan object.
	 * @since 27/06/2014.
	 */
	public void unassign_ports(){
		if(this.used_ports != null){
			this.used_ports.clear();
		}
	}
	
	/**
	 * Generates a port number while verifying that it does not exist in the this.used_ports field and then adds it to this field.
	 * @return new assigned port.
	 * @since 27/06/2014.
	 */
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
	
	/**
	 * Generates a port number ranging between a minimum value and a maximum value.
	 * @param min the minimum port number.
	 * @param max the maximum port number.
	 * @return port number.
	 * @since 27/06/2014.
	 */
	public int generate_random_port(int min, int max){
		
		Random r = new Random();
		return r.nextInt(max-min) + min;
	}

	/**
	 * Empties the node_interfaces array.
	 * @since 27/06/2014.
	 */
	public void remove_node_interfaces(){
		if(this.node_interfaces != null) for(int i = 0; i< node_interfaces.length; i++) this.node_interfaces[i].remove();
	}
	
	/**
	 * @param s .
	 * @return a string with all its whitespace escaped.
	 * @since 27/06/2014.
	 */
	public String escape_space(String s){
		return s.replaceAll("\\s", "\\\\ ");
	}
	

}
