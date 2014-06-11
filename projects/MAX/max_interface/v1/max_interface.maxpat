{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 5,
			"minor" : 1,
			"revision" : 9
		}
,
		"rect" : [ 59.0, 56.0, 1334.0, 775.0 ],
		"bglocked" : 0,
		"defrect" : [ 59.0, 56.0, 1334.0, 775.0 ],
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
					"text" : "r scan",
					"patching_rect" : [ 358.0, 558.0, 43.0, 20.0 ],
					"id" : "obj-9628",
					"fontname" : "Arial",
					"numinlets" : 0,
					"numoutlets" : 1,
					"fontsize" : 12.0,
					"outlettype" : [ "" ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "s scan",
					"patching_rect" : [ 197.0, 448.0, 45.0, 20.0 ],
					"id" : "obj-8091",
					"fontname" : "Arial",
					"numinlets" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "r bang",
					"patching_rect" : [ 284.0, 419.0, 45.0, 20.0 ],
					"id" : "obj-4266",
					"fontname" : "Arial",
					"numinlets" : 0,
					"numoutlets" : 1,
					"fontsize" : 12.0,
					"outlettype" : [ "" ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "s bang",
					"patching_rect" : [ 348.0, 615.0, 47.0, 20.0 ],
					"id" : "obj-4265",
					"fontname" : "Arial",
					"numinlets" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "button",
					"patching_rect" : [ 197.0, 423.0, 20.0, 20.0 ],
					"id" : "obj-280",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "button",
					"patching_rect" : [ 328.0, 507.0, 20.0, 20.0 ],
					"id" : "obj-199",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "message",
					"text" : "download http://localhost:3000 matrix",
					"patching_rect" : [ 266.0, 446.0, 286.0, 18.0 ],
					"id" : "obj-3",
					"fontname" : "Arial",
					"numinlets" : 2,
					"numoutlets" : 1,
					"fontsize" : 12.0,
					"outlettype" : [ "" ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "jit.uldl",
					"patching_rect" : [ 266.0, 481.0, 41.0, 20.0 ],
					"id" : "obj-4",
					"fontname" : "Arial",
					"numinlets" : 1,
					"numoutlets" : 2,
					"fontsize" : 12.0,
					"outlettype" : [ "jit_matrix", "" ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "message",
					"text" : "write net_info.json",
					"patching_rect" : [ 328.0, 530.0, 108.0, 18.0 ],
					"id" : "obj-2",
					"fontname" : "Arial",
					"numinlets" : 2,
					"numoutlets" : 1,
					"fontsize" : 12.0,
					"outlettype" : [ "" ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "jit.textfile",
					"patching_rect" : [ 266.0, 614.0, 57.0, 20.0 ],
					"id" : "obj-1",
					"fontname" : "Arial",
					"numinlets" : 1,
					"numoutlets" : 3,
					"fontsize" : 12.0,
					"outlettype" : [ "jit_matrix", "jit_matrix", "" ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "js init_net_info.js",
					"patching_rect" : [ 348.0, 589.0, 99.0, 20.0 ],
					"id" : "obj-31",
					"fontname" : "Arial",
					"numinlets" : 1,
					"numoutlets" : 1,
					"fontsize" : 12.0,
					"outlettype" : [ "" ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "title_label",
					"text" : "NODE 0",
					"patching_rect" : [ 235.0, 99.0, 262.0, 20.0 ],
					"id" : "obj-474",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "host_label",
					"text" : "HOST : clementpi.local.",
					"patching_rect" : [ 139.0, 132.0, 262.0, 20.0 ],
					"id" : "obj-476",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "name_label",
					"text" : "NAME : clementpi",
					"patching_rect" : [ 139.0, 157.0, 262.0, 20.0 ],
					"id" : "obj-478",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "ip_label",
					"text" : "IP : 192.168.1.103",
					"patching_rect" : [ 139.0, 182.0, 262.0, 20.0 ],
					"id" : "obj-480",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "toggle",
					"varname" : "subscribe_toggle",
					"bgcolor" : [ 0.71, 0.62, 0.62, 1.0 ],
					"patching_rect" : [ 324.0, 195.0, 43.0, 43.0 ],
					"id" : "obj-482",
					"numinlets" : 1,
					"numoutlets" : 1,
					"presentation_rect" : [ 0.0, 0.0, 43.0, 43.0 ],
					"checkedcolor" : [ 0.34, 0.16, 0.16, 1.0 ],
					"outlettype" : [ "int" ],
					"bordercolor" : [ 0.82, 0.8, 0.8, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "outer_box",
					"bgcolor" : [ 0.33, 0.3, 0.3, 1.0 ],
					"patching_rect" : [ 122.0, 90.0, 262.0, 160.0 ],
					"id" : "obj-484",
					"background" : 1,
					"numinlets" : 1,
					"numoutlets" : 0
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "title_box",
					"border" : 1,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"patching_rect" : [ 130.0, 96.0, 246.0, 27.0 ],
					"id" : "obj-486",
					"numinlets" : 1,
					"numoutlets" : 0,
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "info_box",
					"border" : 1,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"patching_rect" : [ 130.0, 126.0, 246.0, 119.0 ],
					"id" : "obj-488",
					"numinlets" : 1,
					"numoutlets" : 0,
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "title_label[1]",
					"text" : "NODE 1",
					"patching_rect" : [ 537.0, 99.0, 262.0, 20.0 ],
					"id" : "obj-490",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "host_label[1]",
					"text" : "HOST : macbook-cgarnier.local.",
					"patching_rect" : [ 441.0, 132.0, 262.0, 20.0 ],
					"id" : "obj-492",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "name_label[1]",
					"text" : "NAME : macbook-cgarnier",
					"patching_rect" : [ 441.0, 157.0, 262.0, 20.0 ],
					"id" : "obj-494",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "ip_label[1]",
					"text" : "IP : 192.168.1.115",
					"patching_rect" : [ 441.0, 182.0, 262.0, 20.0 ],
					"id" : "obj-496",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "toggle",
					"varname" : "subscribe_toggle[1]",
					"bgcolor" : [ 0.71, 0.62, 0.62, 1.0 ],
					"patching_rect" : [ 626.0, 195.0, 43.0, 43.0 ],
					"id" : "obj-498",
					"numinlets" : 1,
					"numoutlets" : 1,
					"presentation_rect" : [ 0.0, 0.0, 43.0, 43.0 ],
					"checkedcolor" : [ 0.34, 0.16, 0.16, 1.0 ],
					"outlettype" : [ "int" ],
					"bordercolor" : [ 0.82, 0.8, 0.8, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "outer_box[1]",
					"bgcolor" : [ 0.33, 0.3, 0.3, 1.0 ],
					"patching_rect" : [ 424.0, 90.0, 262.0, 160.0 ],
					"id" : "obj-500",
					"background" : 1,
					"numinlets" : 1,
					"numoutlets" : 0
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "title_box[1]",
					"border" : 1,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"patching_rect" : [ 432.0, 96.0, 246.0, 27.0 ],
					"id" : "obj-502",
					"numinlets" : 1,
					"numoutlets" : 0,
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "info_box[1]",
					"border" : 1,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"patching_rect" : [ 432.0, 126.0, 246.0, 119.0 ],
					"id" : "obj-504",
					"numinlets" : 1,
					"numoutlets" : 0,
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "title_label[2]",
					"text" : "NODE 2",
					"patching_rect" : [ 839.0, 99.0, 262.0, 20.0 ],
					"id" : "obj-506",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "host_label[2]",
					"text" : "HOST : Homeres-MacBook-Pro.local.",
					"patching_rect" : [ 743.0, 132.0, 262.0, 20.0 ],
					"id" : "obj-508",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "name_label[2]",
					"text" : "NAME : Homère’s MacBook Pro",
					"patching_rect" : [ 743.0, 157.0, 262.0, 20.0 ],
					"id" : "obj-510",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "ip_label[2]",
					"text" : "IP : 192.168.1.100",
					"patching_rect" : [ 743.0, 182.0, 262.0, 20.0 ],
					"id" : "obj-512",
					"fontname" : "Arial",
					"numinlets" : 1,
					"fontface" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0,
					"presentation_rect" : [ 0.0, 0.0, 262.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "toggle",
					"varname" : "subscribe_toggle[2]",
					"bgcolor" : [ 0.71, 0.62, 0.62, 1.0 ],
					"patching_rect" : [ 928.0, 195.0, 43.0, 43.0 ],
					"id" : "obj-514",
					"numinlets" : 1,
					"numoutlets" : 1,
					"presentation_rect" : [ 0.0, 0.0, 43.0, 43.0 ],
					"checkedcolor" : [ 0.34, 0.16, 0.16, 1.0 ],
					"outlettype" : [ "int" ],
					"bordercolor" : [ 0.82, 0.8, 0.8, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "outer_box[2]",
					"bgcolor" : [ 0.33, 0.3, 0.3, 1.0 ],
					"patching_rect" : [ 726.0, 90.0, 262.0, 160.0 ],
					"id" : "obj-516",
					"background" : 1,
					"numinlets" : 1,
					"numoutlets" : 0
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "title_box[2]",
					"border" : 1,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"patching_rect" : [ 734.0, 96.0, 246.0, 27.0 ],
					"id" : "obj-518",
					"numinlets" : 1,
					"numoutlets" : 0,
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "info_box[2]",
					"border" : 1,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"patching_rect" : [ 734.0, 126.0, 246.0, 119.0 ],
					"id" : "obj-520",
					"numinlets" : 1,
					"numoutlets" : 0,
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ]
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"source" : [ "obj-9628", 0 ],
					"destination" : [ "obj-31", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-280", 0 ],
					"destination" : [ "obj-8091", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-4", 1 ],
					"destination" : [ "obj-199", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-199", 0 ],
					"destination" : [ "obj-2", 0 ],
					"hidden" : 0,
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
, 			{
				"patchline" : 				{
					"source" : [ "obj-3", 0 ],
					"destination" : [ "obj-4", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-4", 0 ],
					"destination" : [ "obj-1", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-2", 0 ],
					"destination" : [ "obj-31", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-31", 0 ],
					"destination" : [ "obj-4265", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-4266", 0 ],
					"destination" : [ "obj-3", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
 ]
	}

}
