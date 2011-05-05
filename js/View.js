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
    views : {},

    load : function( view_name, callback ) {
	if (this.views[view_name]) return callback();	

	if (this.browser_supports_localStorage()) {

	    if (localStorage['View.' + view_name]) { 
		var localStorage_key = this.get_localStorage_key( view_name );
		var json_text =  localStorage[localStorage_key];
		this.set_view_from_json_text( view_name, json_text );
		return callback();
	    }
	}

	var self = this;
	var json_path = 'json/view/' + view_name + '.json';

	$.ajax(json_path, {
	    dataType: "text",
	    success: function( data ) {
		self.json_success( data, view_name, callback );
	    },
	    error: function(x,y,z) {
		alert("error: " + x.responseText);
	    }
	});
    },
    set_view_from_json_text : function( view_name, json_text ) {
	var json = eval( '(' +  json_text + ')' );
	this.views[view_name] = Class.extend( json );
    },
    json_success : function( json_text, view_name, callback ) {
	this.set_view_from_json_text( view_name, json_text );

	if (this.browser_supports_localStorage()) {
	    var localStorage_key = this.get_localStorage_key( view_name );
	    localStorage[localStorage_key] = json_text;
	}
	return callback();
    },
    get : function ( view_name, params ) {

	if (this.views[view_name]) { 
	    var The_Class = this.views[view_name];
	    var the_object = new The_Class( params );

	    return the_object;	
	}
    },
    get_localStorage_key : function( view_name ) {
	return 'View.' + view_name;
    },
    browser_supports_localStorage : function() {

	try {
	    return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
	    return false;
	}
    }
});