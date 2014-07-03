import net.sf.json.JSONArray;
import net.sf.json.JSONSerializer;

import com.cycling74.max.MaxBox;
import com.cycling74.max.MaxObject;


import com.cycling74.max.*;

public class Sensor extends MaxObject{

	private String name ;
		
	private String id;
	
	private int port;
			 
	private int x_pos;
	
	private int y_pos;
	
	private JSONArray data;
	
	private MaxPatcher patcher =  this.getParentPatcher();

	private MaxBox name_label;

	private MaxBox id_label;

	private MaxBox port_label;

	private MaxBox info_box;

	private MaxBox title_box;

	private MaxBox outer_box;
	
	private MaxBox subscribe_toggle;

	private MaxBox data_box;

	private MaxBox data_label;

	private MaxBox osc_label;

	private MaxBox data_menu;

	private MaxBox data_menu_message;

	private MaxBox osc_syntax;
	
	
	
	/**
	 * Sets the Sensor with the following parameters:
	 * @param x_pos Position of the Sensor GUI in the x axis.
	 * @param y_pos Position of the Sensors GUI in the y axis.
	 * @param name Name of the Sensor.
	 * @param id Unique ID (UUID) of the Sensor.
	 * @param port Port of the Sensor.
	 * @param data Data of the Sensor.
	 * @since 27/06/2014.
	 */
	public void set (final int x_pos, final int y_pos, final String name, final String id, final int port, String data){
		
		this.name = name;
		this.id = id;
		this.x_pos = x_pos;
		this.y_pos = y_pos;
		this.port = port;
		this.data = parse_data(data);
		

		// Only one inlet for this mxj object, connected the subscribe toggle to detect a toggle event 
		declareIO(1,0);
		
		
		name_label = drawLabel(this.x_pos + 20, this.y_pos + 9, "name : " + this.name, "name_label");
		id_label = drawLabel(this.x_pos + 20, this.y_pos + 40, "id     : " + this.id, "id_label");
		data_menu = drawMenu(this.x_pos + 96, this.y_pos + 87, 150, 20, "data_menu");
		data_label = drawLabel(this.x_pos + 20, this.y_pos + 85, "data            : ", "data_label");
		osc_label = drawLabel(this.x_pos + 20, this.y_pos + 106, "osc syntax : ", "osc_label");
		osc_syntax = drawLabel(this.x_pos + 96, this.y_pos + 106, "", "osc_label");
		port_label = drawLabel(this.x_pos + 20, this.y_pos + 60, "port : " + this.port, "port_label");
		subscribe_toggle = drawToggle(this.x_pos + 343, this.y_pos + 46, "subscribe_toggle");
		data_box = drawPanel(this.x_pos + 17, this.y_pos +83, 358, 47, "data_box");
		info_box = drawPanel(this.x_pos + 8,this.y_pos + 36, 377, 101,"info_box");
		title_box = drawPanel(this.x_pos + 8,this.y_pos + 6, 377, 25,"title_box");
		outer_box = drawPanel(this.x_pos,this.y_pos, 393, 145,"outer_box");
		data_menu_message = this.patcher.newDefault(0,70,"prepend",new Atom[]{Atom.newAtom("data_selected")});
		

		MaxBox menu_receiver = this.patcher.newDefault(0,54,"r",new Atom[]{Atom.newAtom("menu_"+this.id)});
		menu_receiver.setHidden(true);
		MaxBox label_sender = this.patcher.newDefault(0,87,"s",new Atom[]{Atom.newAtom("label_"+this.id)});
		label_sender.setHidden(true);
		MaxBox menu_sender = this.patcher.newDefault(96,this.y_pos+105,"s",new Atom[]{Atom.newAtom("menu_"+this.id)});
		menu_sender.setHidden(true);
		MaxBox label_receiver = this.patcher.newDefault(343,177,"r",new Atom[]{Atom.newAtom("label_"+this.id)});
		label_receiver.setHidden(true);
		MaxBox toggle_receiver = this.patcher.newDefault(343,177,"r",new Atom[]{Atom.newAtom("toggle_"+this.id)});
		toggle_receiver.setHidden(true);
		MaxBox toggle_sender = this.patcher.newDefault(this.x_pos + 343, this.y_pos + 76,"s", new Atom[]{Atom.newAtom("toggle_"+this.id)});
		toggle_sender.setHidden(true);
		
		
		
		this.patcher.connect(data_menu,0, menu_sender, 0);
		this.patcher.connect(menu_receiver, 0, data_menu_message,0);
		this.patcher.connect(data_menu_message, 0, label_sender, 0);
		this.patcher.connect(label_receiver, 0, this.getMaxBox(), 0);
		this.patcher.connect(subscribe_toggle,0, toggle_sender, 0);
		this.patcher.connect(toggle_receiver, 0, this.getMaxBox(), 0);

		
	}

	/**
	 * Sets the this.osc_label according to the item selected in this.data_menu
	 * @param i item number in this.data_menu
	 */
	public void data_selected(int i){
		this.osc_syntax.send("set",new Atom[]{Atom.newAtom(this.data.getJSONObject(i).getString("osc"))});
	}

	/**
	 * Draws a Max/MSP panel object according to the following parameters:
	 * @param x_pos Position of the panel in the x axis.
	 * @param y_pos Position of the panel in the y axis.
	 * @param x_size Size of the panel in the x axis.
	 * @param y_size Size of the panel in the y axis.
	 * @param name Scripting name of the panel.
	 * @return MaxBox with the scripting name defined by the scripting name.
	 * @since 27/06/2014.
	 */
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
	
	/**
	 * Draws a Max/MSP label object according to the following parameters:
	 * @param x_pos Position of the label in the x axis.
	 * @param y_pos Position of the label in the y axis.
	 * @param info Information String to be shown by the label.
	 * @param name Scripting name of the label.
	 * @return MaxBox with the scripting name defined by the scripting name.
	 * @since 27/06/2014
	 */
	public MaxBox drawLabel(int x_pos, int y_pos, String info, String name){
		
		MaxBox label = this.patcher.newDefault(x_pos,y_pos,"comment", null);
		label.send("size",new Atom[]{Atom.newAtom(285),Atom.newAtom(25)});
		label.send("textcolor",new Atom[]{Atom.newAtom(0.92),Atom.newAtom(0.86),Atom.newAtom(0.86)});
		label.send("fontface",new Atom[]{Atom.newAtom("bold")});
		label.send("set",new Atom[]{Atom.newAtom(info)});
		label.send("varname",new Atom[]{Atom.newAtom(name)});
		
		return label;
	}
	
	/**
	 * Draws a Max/MSP Umenu object according to the following parameters:
	 * @param x_pos Position of the Umenu in the x axis.
	 * @param y_pos Position of the Umenu in the y axis.
	 * @param x_size Size of the Umenu in the x axis.
	 * @param y_size Size of the Umenu in the y axis.
	 * @param name Scripting name of the Umenu.
	 * @return MaxBox with the scripting name defined by the scripting name.
	 */
	public MaxBox drawMenu(int x_pos, int y_pos,int x_size, int y_size, String name){
		MaxBox menu = this.patcher.newDefault(x_pos,y_pos,"umenu", null);
		for(int i = 0 ; i < this.data.size(); i ++){
			menu.send("insert", new Atom[]{Atom.newAtom(i), Atom.newAtom(this.data.getJSONObject(i).getString("name"))});
		}
		menu.send("varname", new Atom[]{Atom.newAtom(name)});
		menu.send("size", new Atom[]{Atom.newAtom(x_size),Atom.newAtom(y_size)});
		return menu;
	}
	
	/**
	 * Draws a toggle box with the following parameters:
	 * @param x_pos Position of the toggle in the x axis.
	 * @param y_pos Position of the toggle in the y axis.
	 * @param name Scripting name of the toggle.
	 * @return MaxBox with the scripting name defined by the scripting name.
	 * @since 27/06/2014.
	 */
	public MaxBox drawToggle(int x_pos, int y_pos, String name){
		
		MaxBox toggle = this.patcher.newDefault(x_pos,y_pos,"toggle", null);
		toggle.send("size",new Atom[]{Atom.newAtom(30),Atom.newAtom(30)});
		toggle.send("bgcolor",new Atom[]{Atom.newAtom(0.71),Atom.newAtom(0.62),Atom.newAtom(0.62)});
		toggle.send("bordercolor",new Atom[]{Atom.newAtom(0.82),Atom.newAtom(0.80),Atom.newAtom(0.80)});
		toggle.send("checkedcolor",new Atom[]{Atom.newAtom(0.34),Atom.newAtom(0.16),Atom.newAtom(0.16)});
		toggle.send("varname",new Atom[]{Atom.newAtom(name)});
		
		return toggle;
		
	}
	
	/**
	 * Sends a request or a release message to the MXJ Node object according the the value of val.
	 * @param val 1 or 0 received from a toggle.
	 * @since 27/06/2014.
	 */
	public void inlet(int val){
		if(val == 1){
			// If the toggle is toggled, a request message is sent to the mxj Node object, which will itself request it to the local core information server.
			patcher.getNamedBox("Node").send("request",new Atom[]{Atom.newAtom(this.id),Atom.newAtom(this.port)});
		}
		else{
			// If the toggle is toggled, a release message is sent to the mxj Node object, which will itself request it to the local core information server.
			patcher.getNamedBox("Node").send("release",new Atom[]{Atom.newAtom(this.id),Atom.newAtom(this.port)});
		}

	}
	
	/**
	 * Removes all the Node GUIs
	 * @since 27/06/2014.
	 */
	public void remove_sensor(){
		this.patcher.getNamedBox(this.name_label.getName()).remove();
		this.patcher.getNamedBox(this.port_label.getName()).remove();
		this.patcher.getNamedBox(this.id_label.getName()).remove();
		this.patcher.getNamedBox(this.info_box.getName()).remove();
		this.patcher.getNamedBox(this.title_box.getName()).remove();
		this.patcher.getNamedBox(this.outer_box.getName()).remove();
		this.patcher.getNamedBox(this.data_menu.getName()).remove();
		this.patcher.getNamedBox(this.data_label.getName()).remove();
		this.patcher.getNamedBox(this.data_box.getName()).remove();
		this.patcher.getNamedBox(this.osc_label.getName()).remove();
		this.patcher.getNamedBox(this.data_menu_message.getName()).remove();
		this.patcher.getNamedBox(this.osc_syntax.getName()).remove();

		




		this.name_label = null;
		this.id_label = null;
		this.port_label = null;
		this.info_box = null;
		this.title_box = null;
		this.outer_box = null;
		this.patcher = null;
		this.data = null;
		
	}

	/**
	 * Parses a string containing sensor info to a JSONArray
	 * @param s JSON string containing sensor information.
	 * @return	JSONArray containing sensor JSONObject.
	 * @since 27/06/2014.
	 */
	public JSONArray parse_data(String s) {
		if(s != null) return(JSONArray) JSONSerializer.toJSON(s);
		else return null;
	}
}