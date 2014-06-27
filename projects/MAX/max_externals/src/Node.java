import com.cycling74.max.Atom;
import com.cycling74.max.MaxObject;
import net.sf.json.JSONArray;
import net.sf.json.JSONSerializer;


import com.cycling74.max.*;

public class Node extends MaxObject{

	private String name ;
	
	private String host ;
	
	private String id;
	
	private String ip;
		
	private int x_pos;
	
	private int y_pos;
	
	private MaxPatcher patcher =  this.getParentPatcher();
	
	private JSONArray sensors;

	private MaxBox name_label;

	private MaxBox host_label;

	private MaxBox ip_label;

	private MaxBox info_box;

	private MaxBox title_box;

	private MaxBox outer_box;
	

	
	
	
	public void set (final int x_pos, final int y_pos, final String name, final String host, final String id, final String ip,  String sensors){
		
		this.name = name;
		this.host = host;
		this.id = id;
		this.ip = ip;
		this.x_pos = x_pos;
		this.y_pos = y_pos;
		this.sensors = parse_sensors(sensors);
		

			
		declareIO(1,0);
		
		name_label = drawLabel(this.x_pos + 20, this.y_pos + 9, "NAME : " + this.name, "name_label");
		host_label = drawLabel(this.x_pos+17, this.y_pos+42, "HOST : " + this.host, "host_label");
		ip_label = drawLabel(this.x_pos+17, this.y_pos+65, "IP : " + this.ip, "ip_label");
		info_box = drawPanel(this.x_pos + 8,this.y_pos + 36, 377, 50,"info_box");
		title_box = drawPanel(this.x_pos + 8,this.y_pos + 7, 377, 25,"title_box");
		outer_box = drawPanel(this.x_pos,this.y_pos, 391, 93,"outer_box");
		
		create_sensors();
		
	}

	public MaxBox drawPanel(int x_pos, int y_pos, int x_size, int y_size, String name){
		
		MaxBox panel = this.patcher.newDefault(x_pos,y_pos,"panel", null);
		panel.send("size",new Atom[]{Atom.newAtom(x_size),Atom.newAtom(y_size)});
		panel.send("bgcolor",new Atom[]{Atom.newAtom(0.38),Atom.newAtom(0.33),Atom.newAtom(0.33)});
		panel.send("bordercolor",new Atom[]{Atom.newAtom(0.56),Atom.newAtom(0.52),Atom.newAtom(0.52)});
		panel.send("border",new Atom[]{Atom.newAtom(1)});
		panel.send("rounded",new Atom[]{Atom.newAtom(10)});
		panel.send("varname",new Atom[]{Atom.newAtom(name)});
		
		return panel;
	}
	
	public MaxBox drawLabel(int x_pos, int y_pos, String info, String name){
		
		MaxBox label = this.patcher.newDefault(x_pos,y_pos,"comment", null);
		label.send("size",new Atom[]{Atom.newAtom(265),Atom.newAtom(25)});
		label.send("textcolor",new Atom[]{Atom.newAtom(0.92),Atom.newAtom(0.86),Atom.newAtom(0.86)});
		label.send("fontface",new Atom[]{Atom.newAtom("bold")});
		label.send("set",new Atom[]{Atom.newAtom(info)});
		label.send("varname",new Atom[]{Atom.newAtom(name)});
		
		return label;
	}
	
	public MaxBox drawToggle(int x_pos, int y_pos, String name){
		
		MaxBox toggle = this.patcher.newDefault(x_pos,y_pos,"toggle", null);
		toggle.send("size",new Atom[]{Atom.newAtom(43),Atom.newAtom(43)});
		toggle.send("bgcolor",new Atom[]{Atom.newAtom(0.71),Atom.newAtom(0.62),Atom.newAtom(0.62)});
		toggle.send("bordercolor",new Atom[]{Atom.newAtom(0.82),Atom.newAtom(0.80),Atom.newAtom(0.80)});
		toggle.send("checkedcolor",new Atom[]{Atom.newAtom(0.34),Atom.newAtom(0.16),Atom.newAtom(0.16)});
		toggle.send("varname",new Atom[]{Atom.newAtom(name)});
		
		return toggle;
		
	}
	
	public void create_sensors(){
		for(int i=0; i< this.sensors.size(); i++){
			MaxBox sensor = this.patcher.newDefault(0,0, "mxj", Atom.parse("Sensor"));
			sensor.setRect(343,101 + 93, 75, 20);
			sensor.toBackground(true);
			sensor.setHidden(true);
			sensor.send("set", new Atom[]{
					Atom.newAtom(0),
					Atom.newAtom(93 + i*145),
					Atom.newAtom(this.sensors.getJSONObject(i).getString("name")),
					Atom.newAtom(this.sensors.getJSONObject(i).getString("id")),
					Atom.newAtom(this.sensors.getJSONObject(i).getInt("port")),
					Atom.newAtom(this.sensors.getJSONObject(i).getJSONArray("data").toString())
			});
		}
	}
	
	/* Send resource request message to local core information server */
	public void request(String id, int port){
		
		HttpInfoRequestor resource_requestor = new HttpInfoRequestor();
		try {
			String rep = resource_requestor.sendGet("http://localhost:3000/request/" + id);
		
			if(rep.equals(this.id) == true){
				MaxBox socket = this.patcher.newDefault(400, 400, "udpreceive", new Atom[]{Atom.newAtom(port)});
				MaxBox out = this.patcher.newDefault(300, 300, "outlet", null);
				this.patcher.connect(socket, 0, out, 0);
			}
			
		} catch (Exception e) {
			post("[ERROR!] Could not retrieve data from Information Server");
		}
		
	}
		
	/* Send resource release message to local core information server */
	public void release(String id, int port){
		HttpInfoRequestor resource_requestor = new HttpInfoRequestor();
		try {
			String rep = resource_requestor.sendGet("http://localhost:3000/request/" + id);
		
			if(rep.equals(this.id) == true){
				MaxBox socket = this.patcher.newDefault(400, 400, "udpreceive", new Atom[]{Atom.newAtom(port)});
				MaxBox out = this.patcher.newDefault(300, 300, "outlet", null);
				this.patcher.connect(socket, 0, out, 0);
			}
			
		} catch (Exception e) {
			post("[ERROR!] Could not retrieve data from Information Server");
		}
	}
	
	public JSONArray parse_sensors(String s){
		if(s == null) return null;
		else return (JSONArray) JSONSerializer.toJSON(s);
	}

	public void remove_node(){
		this.patcher.getNamedBox(this.name_label.getName()).remove();
		this.patcher.getNamedBox(this.host_label.getName()).remove();
		this.patcher.getNamedBox(this.ip_label.getName()).remove();
		this.patcher.getNamedBox(this.info_box.getName()).remove();
		this.patcher.getNamedBox(this.title_box.getName()).remove();
		this.patcher.getNamedBox(this.outer_box.getName()).remove();

		this.name_label = null;
		this.host_label = null;
		this.ip_label = null;
		this.info_box = null;
		this.title_box = null;
		this.outer_box = null;
		this.patcher = null;
		this.sensors = null;
		
	}
}
