/*
  bkjs: Ben Kinsey's Javascript Framework
  Copyright (C) 2011 Ben Kinsey
  AGPLv3 (or higher) License.  Other licenses available for a small fee.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var View = Class.extend({
    classes : {},
    objects : {},

    load_multiple : function( class_names, callback ) {
	var len = class_names.length;
	if (len == 0) return callback();

	if (len == 1) {
	    return this.load( class_names[0], callback );
	}

	var last_class_name = class_names.pop();
	var self = this;

	this.load( last_class_name, function() {
	    self.load_multiple( class_names, callback );
	});
    },

    load : function( class_name, callback ) {

	if (this.classes[class_name]) return callback();	

	if (this.browser_supports_localStorage()) {

	    if (localStorage['View.' + class_name]) { 
		var localStorage_key = this.get_localStorage_key( class_name );
		var json_text = localStorage[localStorage_key];
		return this.set_view_from_json_text( class_name, json_text, callback );
	    }
	}

	var self = this;
	var json_path = 'json/view/' + class_name + '.json';

	$.ajax(json_path, {
	    dataType: "text",
	    success: function( data ) {
		self.json_success( data, class_name, callback );
	    },
	    error: function(x,y,z) {
		alert("error: " + x.responseText);
	    }
	});
    },

    set_view_from_json_text : function( class_name, json_text, callback ) {
	var json = eval( '(' +  json_text + ')' );

	var self = this;

	if (json.parent) {
	    this.load( json.parent, function() {
		var Parent_Class = self.classes[json.parent];
		self.classes[class_name] = Parent_Class.extend( json );
		return callback();
	    });
	} else {
	    this.classes[class_name] = Class.extend( json );
	    return callback();
	}
    },

    json_success : function( json_text, class_name, callback ) {
	var self = this;
	this.set_view_from_json_text( class_name, json_text, function() {	    
	    self.maybe_store_json_text( class_name, json_text );
	    return callback();
	});
    },

    maybe_store_json_text : function ( class_name, json_text ) {
	if (this.browser_supports_localStorage()) {
	    var localStorage_key = this.get_localStorage_key( class_name );
	    localStorage[localStorage_key] = json_text;
	}
    },

    set : function ( object_name, class_name, params ) {

	if (this.classes[class_name]) { 
	    var The_Class = this.classes[class_name];
	    this.objects[object_name] = new The_Class( params );
	    return this.objects[object_name];
	}
    },

    get : function ( object_name ) {

	if (this.objects[object_name]) {
	    return this.objects[object_name];
	}
    },

    get_localStorage_key : function( class_name ) {
	return 'View.' + class_name;
    },

    browser_supports_localStorage : function() {

	try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
	    return false;
	}
    }
});