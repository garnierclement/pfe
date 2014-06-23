import com.cycling74.max.MaxObject;
import java.net.ConnectException;


import com.cycling74.max.*;

public class Node extends MaxObject{

	private String name ;
	
	private String host ;
	
	private String id;
	
	private String ip;
		
	private int x_pos;
	
	private int y_pos;
	
	private MaxPatcher patcher =  this.getParentPatcher();
	
	private HttpInfoRequestor resource_requestor = new HttpInfoRequestor();
	

	
	
	
	public void set (final int x_pos, final int y_pos, final String name, final String host, final String id, final String ip){
		
		this.name = name;
		this.host = host;
		this.id = id;
		this.ip = ip;
		this.x_pos = x_pos;
		this.y_pos = y_pos;
		
	/*	
		MaxBox test = patcher.newDefault(0, 0, "patcher", null);
		test.send("filepath", new Atom[]{ Atom.newAtom("/tmp/"+id)});
		test.send("globalpatchername", new Atom[]{ Atom.newAtom(this.name)});
		System.out.println(test.isPatcher());
		test.getPatcher().newDefault(0, 0, "toggle", null);
		
		
		patcher.getWindow().setVisible(true);
		*/
		
		
		declareIO(1,0);
		
		MaxBox name_label = drawLabel(this.x_pos + 20, this.y_pos + 9, "NAME : " + this.name, "name_label");
		MaxBox host_label = drawLabel(this.x_pos+17, this.y_pos+42, "HOST : " + this.host, "host_label");
		MaxBox ip_label = drawLabel(this.x_pos+17, this.y_pos+92, "IP : " + this.ip, "ip_label");
		
		MaxBox subscribe_toggle = drawToggle(this.x_pos + 202, this.y_pos + 105, "subscribe toggle");
		
		MaxBox info_box = drawPanel(this.x_pos + 8,this.y_pos + 36, 246, 119,"info_box");
		MaxBox title_box = drawPanel(this.x_pos + 8,this.y_pos + 6, 246, 27,"title_box");
		MaxBox outer_box = drawPanel(this.x_pos,this.y_pos, 262, 160,"outer_box");
		
		

		this.patcher.connect(subscribe_toggle,0,this.getMaxBox(),0);
		
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
	
	public void inlet(int val){
		System.out.println(val);
		if(val == 1){
			try {
				String rep = this.resource_requestor.sendGet("http://localhost:3000/request/" + this.id);
			
				if(rep.equals(this.id) == true){
					MaxBox socket = this.patcher.newDefault(400, 400, "udpreceive", new Atom[]{Atom.newAtom(16161)});
					MaxBox out = this.patcher.newDefault(300, 300, "outlet", null);
					this.patcher.connect(socket, 0, out, 0);
				}
				
			} catch (Exception e) {
				post("[ERROR!] Could not retrieve data from Information Server");
			}
			
		}else{
			
		}

	}

	
}
