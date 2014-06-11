{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 5,
			"minor" : 1,
			"revision" : 9
		}
,
		"rect" : [ 25.0, 69.0, 1235.0, 687.0 ],
		"bglocked" : 0,
		"defrect" : [ 25.0, 69.0, 1235.0, 687.0 ],
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
					"text" : "net_scan",
					"patching_rect" : [ 223.0, 428.0, 59.0, 20.0 ],
					"id" : "obj-1",
					"fontname" : "Arial",
					"numinlets" : 1,
					"numoutlets" : 0,
					"fontsize" : 12.0
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "button",
					"patching_rect" : [ 223.0, 379.0, 20.0, 20.0 ],
					"id" : "obj-2",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "bang" ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "title_label",
					"text" : "NODE 0",
					"patching_rect" : [ 235.0, 99.0, 262.0, 20.0 ],
					"id" : "obj-276",
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
					"id" : "obj-278",
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
					"id" : "obj-280",
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
					"id" : "obj-282",
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
					"id" : "obj-284",
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
					"id" : "obj-286",
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
					"id" : "obj-288",
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
					"id" : "obj-290",
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
					"id" : "obj-292",
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
					"text" : "HOST : Homeres-MacBook-Pro.local.",
					"patching_rect" : [ 441.0, 132.0, 262.0, 20.0 ],
					"id" : "obj-294",
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
					"text" : "NAME : Homère’s MacBook Pro",
					"patching_rect" : [ 441.0, 157.0, 262.0, 20.0 ],
					"id" : "obj-296",
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
					"text" : "IP : 192.168.1.100",
					"patching_rect" : [ 441.0, 182.0, 262.0, 20.0 ],
					"id" : "obj-298",
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
					"id" : "obj-300",
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
					"id" : "obj-302",
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
					"id" : "obj-304",
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
					"id" : "obj-306",
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
					"id" : "obj-308",
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
					"text" : "HOST : macbook-cgarnier.local.",
					"patching_rect" : [ 743.0, 132.0, 262.0, 20.0 ],
					"id" : "obj-310",
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
					"text" : "NAME : macbook-cgarnier",
					"patching_rect" : [ 743.0, 157.0, 262.0, 20.0 ],
					"id" : "obj-312",
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
					"text" : "IP : 192.168.1.115",
					"patching_rect" : [ 743.0, 182.0, 262.0, 20.0 ],
					"id" : "obj-314",
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
					"id" : "obj-316",
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
					"id" : "obj-318",
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
					"id" : "obj-320",
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
					"id" : "obj-322",
					"numinlets" : 1,
					"numoutlets" : 0,
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "title_label[3]",
					"text" : "NODE 3",
					"patching_rect" : [ 1141.0, 99.0, 262.0, 20.0 ],
					"id" : "obj-324",
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
					"varname" : "host_label[3]",
					"text" : "HOST : rasphomypi.local.",
					"patching_rect" : [ 1045.0, 132.0, 262.0, 20.0 ],
					"id" : "obj-326",
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
					"varname" : "name_label[3]",
					"text" : "NAME : rasphomypi",
					"patching_rect" : [ 1045.0, 157.0, 262.0, 20.0 ],
					"id" : "obj-328",
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
					"varname" : "ip_label[3]",
					"text" : "IP : 192.168.1.102",
					"patching_rect" : [ 1045.0, 182.0, 262.0, 20.0 ],
					"id" : "obj-330",
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
					"varname" : "subscribe_toggle[3]",
					"bgcolor" : [ 0.71, 0.62, 0.62, 1.0 ],
					"patching_rect" : [ 1230.0, 195.0, 43.0, 43.0 ],
					"id" : "obj-332",
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
					"varname" : "outer_box[3]",
					"bgcolor" : [ 0.33, 0.3, 0.3, 1.0 ],
					"patching_rect" : [ 1028.0, 90.0, 262.0, 160.0 ],
					"id" : "obj-334",
					"background" : 1,
					"numinlets" : 1,
					"numoutlets" : 0
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "title_box[3]",
					"border" : 1,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"patching_rect" : [ 1036.0, 96.0, 246.0, 27.0 ],
					"id" : "obj-336",
					"numinlets" : 1,
					"numoutlets" : 0,
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "info_box[3]",
					"border" : 1,
					"bgcolor" : [ 0.38, 0.33, 0.33, 1.0 ],
					"patching_rect" : [ 1036.0, 126.0, 246.0, 119.0 ],
					"id" : "obj-338",
					"numinlets" : 1,
					"numoutlets" : 0,
					"bordercolor" : [ 0.56, 0.52, 0.52, 1.0 ]
				}

			}
 ],
		"lines" : [ 			{
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
