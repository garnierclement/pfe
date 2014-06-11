{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 5,
			"minor" : 1,
			"revision" : 9
		}
,
		"rect" : [ 0.0, 44.0, 835.0, 726.0 ],
		"bglocked" : 0,
		"defrect" : [ 0.0, 44.0, 835.0, 726.0 ],
		"openrect" : [ 0.0, 0.0, 0.0, 0.0 ],
		"openinpresentation" : 0,
		"default_fontsize" : 12.0,
		"default_fontface" : 0,
		"default_fontname" : "Arial",
		"gridonopen" : 0,
		"gridsize" : [ 15.0, 15.0 ],
		"gridsnaponopen" : 0,
		"toolbarvisible" : 1,
		"boxanimatetime" : 200,
		"imprint" : 0,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"boxes" : [ 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "unpack",
					"patching_rect" : [ 169.0, 376.0, 49.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 2,
					"outlettype" : [ "int", "int" ],
					"id" : "obj-445",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "pack 0 0",
					"patching_rect" : [ 208.0, 595.0, 100.0, 20.0 ],
					"numinlets" : 2,
					"fontsize" : 11.595187,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"id" : "obj-27",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "print thru-makenote",
					"patching_rect" : [ 208.0, 630.0, 111.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 0,
					"id" : "obj-16",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "print thru-sustain",
					"patching_rect" : [ 585.0, 564.0, 100.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 0,
					"id" : "obj-24",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "pack 0 0",
					"patching_rect" : [ 585.0, 533.0, 100.0, 20.0 ],
					"numinlets" : 2,
					"fontsize" : 11.595187,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"id" : "obj-25",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "toggle",
					"patching_rect" : [ 698.0, 455.0, 20.0, 20.0 ],
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"id" : "obj-23"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "notein",
					"patching_rect" : [ 585.0, 454.0, 100.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 3,
					"outlettype" : [ "int", "int", "int" ],
					"id" : "obj-22",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "sustain",
					"patching_rect" : [ 585.0, 497.0, 100.0, 20.0 ],
					"numinlets" : 3,
					"fontsize" : 11.595187,
					"numoutlets" : 2,
					"color" : [ 0.141176, 0.768627, 0.0, 1.0 ],
					"outlettype" : [ "int", "int" ],
					"id" : "obj-21",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "print thru-flush",
					"patching_rect" : [ 404.0, 598.0, 100.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 0,
					"id" : "obj-20",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "pack 0 0",
					"patching_rect" : [ 404.0, 571.0, 100.0, 20.0 ],
					"numinlets" : 2,
					"fontsize" : 11.595187,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"id" : "obj-19",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "button",
					"patching_rect" : [ 359.0, 480.0, 31.0, 31.0 ],
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"id" : "obj-17"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "flush",
					"patching_rect" : [ 404.0, 544.0, 100.0, 20.0 ],
					"numinlets" : 2,
					"fontsize" : 11.595187,
					"numoutlets" : 2,
					"color" : [ 0.141176, 0.768627, 0.0, 1.0 ],
					"outlettype" : [ "int", "int" ],
					"id" : "obj-15",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "number",
					"patching_rect" : [ 485.0, 516.0, 50.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 2,
					"outlettype" : [ "int", "bang" ],
					"id" : "obj-14",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "number",
					"patching_rect" : [ 404.0, 516.0, 50.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 2,
					"outlettype" : [ "int", "bang" ],
					"id" : "obj-13",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "stripnote",
					"patching_rect" : [ 404.0, 484.0, 100.0, 20.0 ],
					"numinlets" : 2,
					"fontsize" : 11.595187,
					"numoutlets" : 2,
					"color" : [ 0.141176, 0.768627, 0.0, 1.0 ],
					"outlettype" : [ "int", "int" ],
					"id" : "obj-12",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "notein",
					"patching_rect" : [ 404.0, 453.0, 100.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 3,
					"outlettype" : [ "int", "int", "int" ],
					"id" : "obj-11",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "noteout",
					"patching_rect" : [ 599.0, 633.0, 49.0, 20.0 ],
					"numinlets" : 3,
					"fontsize" : 11.595187,
					"numoutlets" : 0,
					"color" : [ 0.05098, 0.027451, 0.478431, 1.0 ],
					"id" : "obj-10",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "number",
					"patching_rect" : [ 289.0, 566.0, 40.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 2,
					"outlettype" : [ "int", "bang" ],
					"id" : "obj-9",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "number",
					"patching_rect" : [ 208.0, 566.0, 40.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 2,
					"outlettype" : [ "int", "bang" ],
					"id" : "obj-8",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "makenote 127 50",
					"patching_rect" : [ 208.0, 535.0, 100.0, 20.0 ],
					"numinlets" : 3,
					"fontsize" : 11.595187,
					"numoutlets" : 2,
					"color" : [ 0.141176, 0.768627, 0.0, 1.0 ],
					"outlettype" : [ "float", "float" ],
					"id" : "obj-7",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"text" : "note",
					"patching_rect" : [ 203.0, 449.0, 31.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 0,
					"id" : "obj-6",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"text" : "vel",
					"patching_rect" : [ 245.0, 449.0, 31.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 0,
					"id" : "obj-5",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"text" : "dur",
					"patching_rect" : [ 286.0, 449.0, 31.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 11.595187,
					"numoutlets" : 0,
					"id" : "obj-4",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "slider",
					"patching_rect" : [ 289.0, 474.0, 18.0, 55.0 ],
					"numinlets" : 1,
					"numoutlets" : 1,
					"size" : 100.0,
					"outlettype" : [ "" ],
					"mult" : 10.0,
					"id" : "obj-3",
					"min" : 20.0
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "slider",
					"patching_rect" : [ 249.0, 474.0, 18.0, 55.0 ],
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"id" : "obj-443"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "slider",
					"patching_rect" : [ 208.0, 474.0, 18.0, 55.0 ],
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"id" : "obj-444"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "print",
					"patching_rect" : [ 112.0, 331.0, 34.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"id" : "obj-42",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "button",
					"patching_rect" : [ 41.0, 318.0, 20.0, 20.0 ],
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ],
					"id" : "obj-2"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "net_scan",
					"patching_rect" : [ 45.0, 395.0, 59.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"id" : "obj-1",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "toggle",
					"varname" : "subscribe_toggle",
					"bordercolor" : [ 0.82, 0.8, 0.8, 1.0 ],
					"checkedcolor" : [ 0.34, 0.16, 0.16, 1.0 ],
					"patching_rect" : [ 324.0, 195.0, 43.0, 43.0 ],
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"bgcolor" : [ 0.71, 0.62, 0.62, 1.0 ],
					"presentation_rect" : [ 0.0, 0.0, 43.0, 43.0 ],
					"id" : "obj-405"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "title_label",
					"text" : "NODE0",
					"patching_rect" : [ 235.0, 99.0, 262.0, 20.0 ],
					"numinlets" : 1,
					"fontface" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ],
					"id" : "obj-407",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "host_label",
					"text" : "HOST : Homys-Toaster.local.",
					"patching_rect" : [ 139.0, 132.0, 262.0, 20.0 ],
					"numinlets" : 1,
					"fontface" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ],
					"id" : "obj-409",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "name_label",
					"text" : "NAME : Homy's Toaster",
					"patching_rect" : [ 139.0, 157.0, 262.0, 20.0 ],
					"numinlets" : 1,
					"fontface" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ],
					"id" : "obj-411",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "ip_label",
					"text" : "IP : 192.168.0.107",
					"patching_rect" : [ 139.0, 182.0, 262.0, 20.0 ],
					"numinlets" : 1,
					"fontface" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ],
					"id" : "obj-413",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "info_box",
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ],
					"border" : 1,
					"patching_rect" : [ 130.0, 126.0, 246.0, 119.0 ],
					"numinlets" : 1,
					"numoutlets" : 0,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"id" : "obj-415"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "title_box",
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ],
					"border" : 1,
					"patching_rect" : [ 130.0, 96.0, 246.0, 27.0 ],
					"numinlets" : 1,
					"numoutlets" : 0,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"id" : "obj-417"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "outer_box",
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ],
					"border" : 1,
					"patching_rect" : [ 122.0, 90.0, 262.0, 160.0 ],
					"numinlets" : 1,
					"numoutlets" : 0,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"id" : "obj-419"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"varname" : "resource_requestor Homy's Toaster",
					"text" : "resource_requestor",
					"patching_rect" : [ 122.0, 90.0, 113.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"background" : 1,
					"id" : "obj-420",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "message",
					"varname" : "info_msg",
					"text" : "node_info 7fa83230-f194-11e3-8431-bb5015493655 192.168.0.107 \"Homy's Toaster\" Homys-Toaster.local. \"0\"",
					"linecount" : 4,
					"presentation_linecount" : 4,
					"patching_rect" : [ 122.0, 90.0, 262.0, 60.0 ],
					"numinlets" : 2,
					"fontsize" : 12.0,
					"numoutlets" : 1,
					"background" : 1,
					"outlettype" : [ "" ],
					"presentation_rect" : [ 0.0, 0.0, 262.0, 18.0 ],
					"id" : "obj-422",
					"fontname" : "Arial",
					"hidden" : 1
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "toggle",
					"varname" : "subscribe_toggle[1]",
					"bordercolor" : [ 0.82, 0.8, 0.8, 1.0 ],
					"checkedcolor" : [ 0.34, 0.16, 0.16, 1.0 ],
					"patching_rect" : [ 626.0, 195.0, 43.0, 43.0 ],
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"bgcolor" : [ 0.71, 0.62, 0.62, 1.0 ],
					"presentation_rect" : [ 0.0, 0.0, 43.0, 43.0 ],
					"id" : "obj-424"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "title_label[1]",
					"text" : "NODE1",
					"patching_rect" : [ 537.0, 99.0, 262.0, 20.0 ],
					"numinlets" : 1,
					"fontface" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ],
					"id" : "obj-426",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "host_label[1]",
					"text" : "HOST : macbook-cgarnier.local.",
					"patching_rect" : [ 441.0, 132.0, 262.0, 20.0 ],
					"numinlets" : 1,
					"fontface" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ],
					"id" : "obj-428",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "name_label[1]",
					"text" : "NAME : macbook-cgarnier",
					"patching_rect" : [ 441.0, 157.0, 262.0, 20.0 ],
					"numinlets" : 1,
					"fontface" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ],
					"id" : "obj-430",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "ip_label[1]",
					"text" : "IP : 192.168.0.106",
					"patching_rect" : [ 441.0, 182.0, 262.0, 20.0 ],
					"numinlets" : 1,
					"fontface" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ],
					"id" : "obj-432",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "info_box[1]",
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ],
					"border" : 1,
					"patching_rect" : [ 432.0, 126.0, 246.0, 119.0 ],
					"numinlets" : 1,
					"numoutlets" : 0,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"id" : "obj-434"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "title_box[1]",
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ],
					"border" : 1,
					"patching_rect" : [ 432.0, 96.0, 246.0, 27.0 ],
					"numinlets" : 1,
					"numoutlets" : 0,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"id" : "obj-436"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "outer_box[1]",
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ],
					"border" : 1,
					"patching_rect" : [ 424.0, 90.0, 262.0, 160.0 ],
					"numinlets" : 1,
					"numoutlets" : 0,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"id" : "obj-438"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"varname" : "resource_requestor macbook-cgarnier",
					"text" : "resource_requestor",
					"patching_rect" : [ 424.0, 90.0, 113.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"background" : 1,
					"id" : "obj-439",
					"fontname" : "Arial"
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "message",
					"varname" : "info_msg[1]",
					"text" : "node_info 842d1e10-f194-11e3-ab55-579622bc0027 192.168.0.106 macbook-cgarnier macbook-cgarnier.local. \"1\"",
					"linecount" : 4,
					"presentation_linecount" : 4,
					"patching_rect" : [ 424.0, 90.0, 262.0, 60.0 ],
					"numinlets" : 2,
					"fontsize" : 12.0,
					"numoutlets" : 1,
					"background" : 1,
					"outlettype" : [ "" ],
					"presentation_rect" : [ 0.0, 0.0, 262.0, 18.0 ],
					"id" : "obj-441",
					"fontname" : "Arial",
					"hidden" : 1
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"varname" : "receiver 192.168.0.107",
					"text" : "udpreceive 16161",
					"patching_rect" : [ 122.0, 270.0, 104.0, 20.0 ],
					"numinlets" : 1,
					"fontsize" : 12.0,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"id" : "obj-442",
					"fontname" : "Arial"
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"source" : [ "obj-445", 1 ],
					"destination" : [ "obj-444", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-442", 0 ],
					"destination" : [ "obj-445", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-7", 1 ],
					"destination" : [ "obj-9", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-7", 0 ],
					"destination" : [ "obj-8", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-3", 0 ],
					"destination" : [ "obj-7", 2 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-443", 0 ],
					"destination" : [ "obj-7", 1 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-444", 0 ],
					"destination" : [ "obj-7", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-11", 0 ],
					"destination" : [ "obj-12", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-11", 1 ],
					"destination" : [ "obj-12", 1 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-12", 0 ],
					"destination" : [ "obj-13", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-12", 1 ],
					"destination" : [ "obj-14", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-13", 0 ],
					"destination" : [ "obj-15", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-14", 0 ],
					"destination" : [ "obj-15", 1 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-17", 0 ],
					"destination" : [ "obj-15", 0 ],
					"hidden" : 0,
					"midpoints" : [ 368.5, 540.0, 413.5, 540.0 ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-15", 0 ],
					"destination" : [ "obj-19", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-15", 1 ],
					"destination" : [ "obj-19", 1 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-22", 0 ],
					"destination" : [ "obj-21", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-22", 1 ],
					"destination" : [ "obj-21", 1 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-23", 0 ],
					"destination" : [ "obj-21", 2 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-21", 0 ],
					"destination" : [ "obj-25", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-21", 1 ],
					"destination" : [ "obj-25", 1 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-8", 0 ],
					"destination" : [ "obj-27", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-9", 0 ],
					"destination" : [ "obj-27", 1 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-27", 0 ],
					"destination" : [ "obj-16", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-27", 0 ],
					"destination" : [ "obj-10", 0 ],
					"hidden" : 0,
					"midpoints" : [ 217.5, 620.0, 391.0, 620.0, 391.0, 628.0, 608.5, 628.0 ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-25", 0 ],
					"destination" : [ "obj-24", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-19", 0 ],
					"destination" : [ "obj-20", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-19", 0 ],
					"destination" : [ "obj-10", 0 ],
					"hidden" : 0,
					"midpoints" : [ 413.5, 592.0, 391.0, 592.0, 391.0, 628.0, 608.5, 628.0 ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-25", 0 ],
					"destination" : [ "obj-10", 0 ],
					"hidden" : 0,
					"midpoints" : [ 594.5, 556.0, 571.0, 556.0, 571.0, 619.0, 608.5, 619.0 ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-442", 0 ],
					"destination" : [ "obj-42", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-441", 0 ],
					"destination" : [ "obj-439", 0 ],
					"hidden" : 1,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-424", 0 ],
					"destination" : [ "obj-439", 0 ],
					"hidden" : 1,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-422", 0 ],
					"destination" : [ "obj-420", 0 ],
					"hidden" : 1,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-405", 0 ],
					"destination" : [ "obj-420", 0 ],
					"hidden" : 1,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-2", 0 ],
					"destination" : [ "obj-1", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
 ]
	}

}
