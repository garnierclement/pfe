inlets=1;
outlets=1;
autowatch = 1; 

var Patcher = null;


var nodes_interfaces = new Array(128);
var num_nodes = 0;



var tsk = new Task(mytask, this);

function bang(){
  Patcher = this.patcher.parentpatcher;
  tsk.cancel();
  tsk.interval = 100000;
  tsk.repeat();
}

function mytask(){
  outlet(0,"bang");
}



function write(val){

    f = new File(val,'read','JSON'); //Open with a "read" access the JSON file specified as a parameter in the write message
    var net_info_string = f.readstring(f.eof);
    var net_info = jsonParse(net_info_string);

  //Remove all existing nodes
  for ( k in nodes_interfaces){
    nodes_interfaces[k].remove(nodes_interfaces[k].ip);
  }
  //Create the new node interfaces from net data
  for (k in net_info.nodes){
    nodes_interfaces[k] = new NodeInterface(net_info.nodes,k);
  }
    
  f.close();

}





function get_net_info(){

  for (k in nodes_interfaces){
    nodes_interfaces[k].getInfo();
  }
}

function NodeInterface(nodes, k){

  // Network information
    this.host = nodes[k].host;
    this.name = nodes[k].name;
    this.ip = nodes[k].ip;
    this.id = nodes[k].id;
    this.raw_info = new Array("node_info",this.id, this.ip, this.name, this.host, k);

    

    var y_pos = 90;
    var x_pos = 122 + k * 302 ; 


//  Graphical components
    this.subscribe_toggle = new SubscribeToggle(x_pos, y_pos);
    this.title_label = new Label(x_pos+113, y_pos+9, "NODE" + k, "title_label");
    this.host_label = new Label(x_pos+17, y_pos+42, "HOST : " + this.host, "host_label");
    this.name_label = new Label(x_pos+17, y_pos+67, "NAME : " + this.name, "name_label");
    this.ip_label = new Label(x_pos+17, y_pos+92, "IP : " + this.ip, "ip_label");
    this.info_box = new PanelBox(x_pos+8,y_pos+36, 246, 119, "info_box");
    this.title_box = new PanelBox(x_pos+8,y_pos+6, 246, 27, "title_box");
    this.outer_box = new PanelBox(x_pos,y_pos, 262, 160, "outer_box");
    this.res_req = new ResourceRequestor(x_pos, y_pos, this.name);
    this.info_msg = new InfoMsg(x_pos, y_pos, this.raw_info);
    //this.outer_box.background = 1;


 // Connect the resource requestor's inlet to the toggle's outlet
    Patcher.hiddenconnect(this.subscribe_toggle,0,this.res_req,0);
    Patcher.hiddenconnect(this.info_msg,0,this.res_req,0);
    this.info_msg.message("bang");

}

NodeInterface.prototype.remove = function(ip){
  Patcher.remove(this.subscribe_toggle);
  Patcher.remove(this.title_label);
  Patcher.remove(this.host_label);
  Patcher.remove(this.name_label);
  Patcher.remove(this.ip_label);
  Patcher.remove(this.info_box);
  Patcher.remove(this.title_box);
  Patcher.remove(this.outer_box);
  Patcher.remove(this.res_req);
  Patcher.remove(this.info_msg);
  Patcher.remove(Patcher.getnamed("receiver " + ip ));


}

NodeInterface.prototype.getInfo = function(){
  post();
  post('*****************');
  post();
  post(this.host);
  post();
  post(this.name);
  post();
  post(this.ip);
  post();
  post(this.id);
  post();
  post('*****************');
  post();

} 


function SubscribeToggle(x_pos, y_pos){
    this.sub_toggle = Patcher.newdefault(x_pos+202,y_pos+105,"toggle");
    this.sub_toggle.message("size", 43, 43);
    this.sub_toggle.message("bgcolor", 0.71, 0.62, 0.62);
    this.sub_toggle.message("bordercolor", 0.82, 0.80, 0.80);
    this.sub_toggle.message("checkedcolor", 0.34, 0.16, 0.16);
    this.sub_toggle.varname = "subscribe_toggle";

    return Patcher.getnamed(this.sub_toggle.varname);
}


function PanelBox(x_pos, y_pos, x_size, y_size, name){

    this.panel_box = Patcher.newdefault(x_pos,y_pos,"panel");
    this.panel_box.message("size", x_size, y_size);
    this.panel_box.message("bgcolor", 0.38, 0.33, 0.33);
    this.panel_box.message("bordercolor", 0.56, 0.52, 0.52);
    this.panel_box.message("border", 1);
    this.panel_box.rounded = 10;
    this.panel_box.varname = name;

    return Patcher.getnamed(this.panel_box.varname);
}

function Label(x_pos, y_pos, info, name){

   this.lbl = Patcher.newdefault(x_pos,y_pos,"comment");
   this.lbl.message("textcolor", 0.92, 0.86, 0.86);
   this.lbl.message("fontface", "bold");
   this.lbl.message("size", 262, 25);
   this.lbl.message("set", info);
   this.lbl.varname = name;

   return Patcher.getnamed(this.lbl.varname);
}

function InfoMsg(x_pos, y_pos, node_info){
  this.info_msg = Patcher.newdefault(x_pos,y_pos,"message");
  this.info_msg.message("set", node_info);
  this.info_msg.hidden = 1;
  this.info_msg.message("size",262, 160);
  this.info_msg.varname = "info_msg";
  this.info_msg.background = 1;

  return Patcher.getnamed(this.info_msg.varname);
}

function ResourceRequestor(x_pos, y_pos, node_info){
 this.res_req = Patcher.newdefault(x_pos,y_pos,"resource_requestor");
 this.res_req.varname = "resource_requestor " + node_info;
 //this.res_req.hidden = 1;
 this.res_req.message("title", node_info + "resource_req");
 this.res_req.background = 1;

 
 return Patcher.getnamed(this.res_req.varname);

}







///////////////////////////////////////////////////////////////
//                        JSON PARSING                       //
///////////////////////////////////////////////////////////////



// This source code is free for use in the public domain.
// NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

// http://code.google.com/p/json-sans-eval/

/**
 * Parses a string of well-formed JSON text.
 *
 * If the input is not well-formed, then behavior is undefined, but it is
 * deterministic and is guaranteed not to modify any object other than its
 * return value.
 *
 * This does not use `eval` so is less likely to have obscure security bugs than
 * json2.js.
 * It is optimized for speed, so is much faster than json_parse.js.
 *
 * This library should be used whenever security is a concern (when JSON may
 * come from an untrusted source), speed is a concern, and erroring on malformed
 * JSON is *not* a concern.
 *
 *                      Pros                   Cons
 *                    +-----------------------+-----------------------+
 * json_sans_eval.js  | Fast, secure          | Not validating        |
 *                    +-----------------------+-----------------------+
 * json_parse.js      | Validating, secure    | Slow                  |
 *                    +-----------------------+-----------------------+
 * json2.js           | Fast, some validation | Potentially insecure  |
 *                    +-----------------------+-----------------------+
 *
 * json2.js is very fast, but potentially insecure since it calls `eval` to
 * parse JSON data, so an attacker might be able to supply strange JS that
 * looks like JSON, but that executes arbitrary javascript.
 * If you do have to use json2.js with untrusted data, make sure you keep
 * your version of json2.js up to date so that you get patches as they're
 * released.
 *
 * @param {string} json per RFC 4627
 * @param {function (this:Object, string, *):*} opt_reviver optional function
 *     that reworks JSON objects post-parse per Chapter 15.12 of EcmaScript3.1.
 *     If supplied, the function is called with a string key, and a value.
 *     The value is the property of 'this'.  The reviver should return
 *     the value to use in its place.  So if dates were serialized as
 *     {@code { "type": "Date", "time": 1234 }}, then a reviver might look like
 *     {@code
 *     function (key, value) {
 *       if (value && typeof value === 'object' && 'Date' === value.type) {
 *         return new Date(value.time);
 *       } else {
 *         return value;
 *       }
 *     }}.
 *     If the reviver returns {@code undefined} then the property named by key
 *     will be deleted from its container.
 *     {@code this} is bound to the object containing the specified property.
 * @return {Object|Array}
 * @author Mike Samuel <mikesamuel@gmail.com>
 */
var jsonParse = (function () {
  var number
      = '(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)';
  var oneChar = '(?:[^\\0-\\x08\\x0a-\\x1f\"\\\\]'
      + '|\\\\(?:[\"/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';
  var string = '(?:\"' + oneChar + '*\")';

  // Will match a value in a well-formed JSON file.
  // If the input is not well-formed, may match strangely, but not in an unsafe
  // way.
  // Since this only matches value tokens, it does not match whitespace, colons,
  // or commas.
  var jsonToken = new RegExp(
      '(?:false|true|null|[\\{\\}\\[\\]]'
      + '|' + number
      + '|' + string
      + ')', 'g');

  // Matches escape sequences in a string literal
  var escapeSequence = new RegExp('\\\\(?:([^u])|u(.{4}))', 'g');

  // Decodes escape sequences in object literals
  var escapes = {
    '"': '"',
    '/': '/',
    '\\': '\\',
    'b': '\b',
    'f': '\f',
    'n': '\n',
    'r': '\r',
    't': '\t'
  };
  function unescapeOne(_, ch, hex) {
    return ch ? escapes[ch] : String.fromCharCode(parseInt(hex, 16));
  }

  // A non-falsy value that coerces to the empty string when used as a key.
  var EMPTY_STRING = new String('');
  var SLASH = '\\';

  // Constructor to use based on an open token.
  var firstTokenCtors = { '{': Object, '[': Array };

  var hop = Object.hasOwnProperty;

  return function (json, opt_reviver) {
    // Split into tokens
    var toks = json.match(jsonToken);
    // Construct the object to return
    var result;
    var tok = toks[0];
    var topLevelPrimitive = false;
    if ('{' === tok) {
      result = {};
    } else if ('[' === tok) {
      result = [];
    } else {
      // The RFC only allows arrays or objects at the top level, but the JSON.parse
      // defined by the EcmaScript 5 draft does allow strings, booleans, numbers, and null
      // at the top level.
      result = [];
      topLevelPrimitive = true;
    }

    // If undefined, the key in an object key/value record to use for the next
    // value parsed.
    var key;
    // Loop over remaining tokens maintaining a stack of uncompleted objects and
    // arrays.
    var stack = [result];
    for (var i = 1 - topLevelPrimitive, n = toks.length; i < n; ++i) {
      tok = toks[i];

      var cont;
      switch (tok.charCodeAt(0)) {
        default:  // sign or digit
          cont = stack[0];
          cont[key || cont.length] = +(tok);
          key = void 0;
          break;
        case 0x22:  // '"'
          tok = tok.substring(1, tok.length - 1);
          if (tok.indexOf(SLASH) !== -1) {
            tok = tok.replace(escapeSequence, unescapeOne);
          }
          cont = stack[0];
          if (!key) {
            if (cont instanceof Array) {
              key = cont.length;
            } else {
              key = tok || EMPTY_STRING;  // Use as key for next value seen.
              break;
            }
          }
          cont[key] = tok;
          key = void 0;
          break;
        case 0x5b:  // '['
          cont = stack[0];
          stack.unshift(cont[key || cont.length] = []);
          key = void 0;
          break;
        case 0x5d:  // ']'
          stack.shift();
          break;
        case 0x66:  // 'f'
          cont = stack[0];
          cont[key || cont.length] = false;
          key = void 0;
          break;
        case 0x6e:  // 'n'
          cont = stack[0];
          cont[key || cont.length] = null;
          key = void 0;
          break;
        case 0x74:  // 't'
          cont = stack[0];
          cont[key || cont.length] = true;
          key = void 0;
          break;
        case 0x7b:  // '{'
          cont = stack[0];
          stack.unshift(cont[key || cont.length] = {});
          key = void 0;
          break;
        case 0x7d:  // '}'
          stack.shift();
          break;
      }
    }
    // Fail if we've got an uncompleted object.
    if (topLevelPrimitive) {
      if (stack.length !== 1) { throw new Error(); }
      result = result[0];
    } else {
      if (stack.length) { throw new Error(); }
    }

    if (opt_reviver) {
      // Based on walk as implemented in http://www.json.org/json2.js
      var walk = function (holder, key) {
        var value = holder[key];
        if (value && typeof value === 'object') {
          var toDelete = null;
          for (var k in value) {
            if (hop.call(value, k) && value !== holder) {
              // Recurse to properties first.  This has the effect of causing
              // the reviver to be called on the object graph depth-first.

              // Since 'this' is bound to the holder of the property, the
              // reviver can access sibling properties of k including ones
              // that have not yet been revived.

              // The value returned by the reviver is used in place of the
              // current value of property k.
              // If it returns undefined then the property is deleted.
              var v = walk(value, k);
              if (v !== void 0) {
                value[k] = v;
              } else {
                // Deleting properties inside the loop has vaguely defined
                // semantics in ES3 and ES3.1.
                if (!toDelete) { toDelete = []; }
                toDelete.push(k);
              }
            }
          }
          if (toDelete) {
            for (var i = toDelete.length; --i >= 0;) {
              delete value[toDelete[i]];
            }
          }
        }
        return opt_reviver.call(holder, key, value);
      };
      result = walk({ '': result }, '');
    }

    return result;
  };
})();