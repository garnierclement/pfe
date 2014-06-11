inlets=1;
outlets=1;
autowatch = 1; 


var nodes_interfaces = new Array(128);
var title_label = new Array(128);
var host_label = new Array(128);
var name_label = new Array(128);
var ip_label = new Array(128);
var subscribe_toggle = new Array(128);
var outer_box = new Array(128);
var title_box = new Array(128);
var info_box = new Array(128);
var funnel;
var num_nodes = 0;
var tsk = new Task(mytask, this);

function bang(){
  tsk.cancel();
  tsk.interval = 10000;
  tsk.repeat();
}

function mytask(){
  outlet(0,"bang");
}


function write(val){

post(this.patcher.name);
post(this.patcher.parentpatcher.name);

    f = new File(val,'read','JSON'); //Open with a "read" access the JSON file specified as a parameter in the write message
    var net_info_string = f.readstring(f.eof);
    var net_info = jsonParse(net_info_string);

  //Remove pre-existing node interfaces at each scan of the network
  if(num_nodes>net_info.nodes.length) remove_node_interface(num_nodes);

  //Create the new node interfaces from net data
  for (k in net_info.nodes){
    nodes_interfaces[k] = add_node_interface(net_info.nodes,k);
    //nodes_interfaces[k] = this.patcher.parentpatcher.newdefault(113,9,"node_interface");
  }
    
    f.close();

  num_nodes = net_info.nodes.length;
  post(num_nodes);


}

function check_node_exists(net_info, node){
  for (k in net_info.nodes){
    if(net_info.nodes[k]==node) return true;
    else return false;
  }
}

function remove_node_interface(num_nodes){
  for(i=0;i<num_nodes;i++){
    this.patcher.remove(title_label[i]);
    this.patcher.remove(host_label[i]);
    this.patcher.remove(name_label[i]);
    this.patcher.remove(ip_label[i]);
    this.patcher.remove(subscribe_toggle[i]);
    this.patcher.remove(outer_box[i]);
    this.patcher.remove(info_box[i]);
    this.patcher.remove(title_box[i]);    


  }
}

function add_node_interface(nodes, k){

    var host = nodes[k].host;
    var name = nodes[k].name;
    var ip = nodes[k].ip;


    var y_pos = 90;
    var x_pos = 122 + k * 302 ; 


    title_label[k] = this.patcher.parentpatcher.newdefault(x_pos+113,y_pos+9,"comment");
    title_label[k].message("textcolor", 0.92, 0.86, 0.86);
    title_label[k].message("fontface", "bold");
    title_label[k].message("size", 262, 25);
    title_label[k].message("set", "NODE " + k);
    title_label[k].varname = "title_label";


    host_label[k] = this.patcher.parentpatcher.newdefault(x_pos+17,y_pos+42,"comment");
    host_label[k].message("textcolor", 0.92, 0.86, 0.86);
    host_label[k].message("fontface", "bold");
    host_label[k].message("size", 262, 25);
    host_label[k].message("set", "HOST : " + host);
    host_label[k].varname = "host_label";

    name_label[k] = this.patcher.parentpatcher.newdefault(x_pos+17,y_pos+67,"comment");
    name_label[k].message("textcolor", 0.92, 0.86, 0.86);
    name_label[k].message("fontface", "bold");
    name_label[k].message("size", 262, 25);
    name_label[k].message("set", "NAME : " + name);
    name_label[k].varname = "name_label";

    ip_label[k] = this.patcher.parentpatcher.newdefault(x_pos+17,y_pos+92,"comment");
    ip_label[k].message("textcolor", 0.92, 0.86, 0.86);
    ip_label[k].message("fontface", "bold");
    ip_label[k].message("size", 262, 25);
    ip_label[k].message("set", "IP : " + ip);
    ip_label[k].varname = "ip_label";


    subscribe_toggle[k] = this.patcher.parentpatcher.newdefault(x_pos+202,y_pos+105,"toggle");
    subscribe_toggle[k].message("size", 43, 43);
    subscribe_toggle[k].message("bgcolor", 0.71, 0.62, 0.62);
    subscribe_toggle[k].message("bordercolor", 0.82, 0.80, 0.80);
    subscribe_toggle[k].message("checkedcolor", 0.34, 0.16, 0.16);
    subscribe_toggle[k].varname = "subscribe_toggle";

    outer_box[k] = this.patcher.parentpatcher.newdefault(x_pos,y_pos,"panel");
    outer_box[k].message("size", 262, 160);
    outer_box[k].message("bgcolor", 0.33, 0.30, 0.30);
    outer_box[k].rounded = 10;
    outer_box[k].background = 1;
    outer_box[k].varname = "outer_box";

    title_box[k] = this.patcher.parentpatcher.newdefault(x_pos+8,y_pos+6,"panel");
    title_box[k].message("size", 246, 27);
    title_box[k].message("bgcolor", 0.38, 0.33, 0.33);
    title_box[k].message("bordercolor", 0.56, 0.52, 0.52);
    title_box[k].message("border", 1);
    title_box[k].rounded = 10;
    title_box[k].varname = "title_box";

    info_box[k] = this.patcher.parentpatcher.newdefault(x_pos+8,y_pos+36,"panel");
    info_box[k].message("size", 246, 119);
    info_box[k].message("bgcolor", 0.38, 0.33, 0.33);
    info_box[k].message("bordercolor", 0.56, 0.52, 0.52);
    info_box[k].message("border", 1);
    info_box[k].rounded = 10;
    info_box[k].varname = "info_box";


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