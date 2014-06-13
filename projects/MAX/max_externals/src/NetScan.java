import com.cycling74.max.*;

import org.json.simple.*;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;



public class NetScan extends MaxObject {
	

	public NetScan(){
		
	}
	
	private String info_server = "http://localhost:3000/nodes/";
	
	private HttpInfoRequestor net_info_getter = new HttpInfoRequestor();
	
	private JSONObject net_info = null; 
	
	public JSONObject parse_json(String s){
		
		JSONObject result = null;
		try{
			JSONParser jsonParser = new JSONParser();
			result =  (JSONObject) jsonParser.parse(s);
		} catch (ParseException ex) {
            ex.printStackTrace();
        }
		
		return result;
	}
	
	public void bang(){
		
		String raw_net_info = null;
		
		/* Send a HTTP GET request to the info server to get the JSON containing net_info*/
		try {
			raw_net_info = this.net_info_getter.sendGet(this.info_server);
		} catch (Exception e) {
			post("Error in retreveing info from Information Server");
			e.printStackTrace();
		}
		
		/* Sets the net_info property to the parsed JSON string received from the info server*/
		this.net_info = parse_json(raw_net_info);
		
		System.out.println(net_info.get("nodes"));
		
		outlet(0, net_info.toString());
		

		  
	}
	
	public void getInfo(){
		
	}
	
	
	
		
	
	
	

}
