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
var Nav = Class.extend({
    init : function( nav_object, home_url ) {
	this.nav_object = nav_object;
	this.home_url = '';
	if (home_url) this.home_url = home_url;

	if (! this.browser_supports_pushState() && ! location.hash) {
	    window.location = this.home_url + '/#!' + location.pathname;
	}
	this.previous_href = window.location.href;
	this.set_pathname();
	document.title = this.get_title();

	var self = this;

	var update_func = function() { 
	    self.set_prev_and_update_to_url(); 
	};
	window.onpopstate = update_func;
	window.onpushstate = update_func;
	$(window).hashchange( update_func );
    },

    set_prev_and_update_to_url : function() { 
	alert('set prev and update');
	this.previous_href = window.location.href;
	this.update_to_url();
    },

    update_to_url : function( url ) {
	this.set_pathname( this.strip_home_url( url ) );
	document.title = this.get_title();
	if (this.update_callback) {
	    this.update_callback();
	}
    },

    set_update_callback : function( update_callback ) {
	this.update_callback = update_callback;
    },

    set_pathname : function( url ) {
	if (url) {
	    this.pathname = url;
	    return;
	}
	if (location.hash && location.pathname == this.home_url + '/') {
	    this.pathname = location.hash.substring( 2 );
	} else {
	    this.pathname = this.strip_home_url( location.pathname );
	}
    },

    strip_home_url : function( url ) {
	if (! url) return;

	if (url.indexOf( this.home_url ) == 0) {
	    return url.substring( this.home_url.length );
	}
	return url;
    },

    get_title : function() {
	return this.get_title_by_url( this.pathname );
    },

    get_title_by_url : function ( url ) {
	if (!url) return this.nav_object['/'];
	if (this.nav_object[url]) return this.nav_object[url];
	var level = this.get_level_by_url( url );
	if (level < 1) return this.nav_object['/'];
	url = this.get_url_by_level( level - 1 );
	return this.get_title_by_url( url );
    },

    get_level : function() {
	return this.get_level_by_url( this.pathname );
    },

    get_level_by_url : function( url ) {
	if (url == '/') return 0;
	return url.split('/').length - 1;
    },

    get_url_by_level : function ( level ) {
	if ( level == 0 ) return '/';
	var pathname_array = this.pathname.split('/');
	var url = '';
	level++;

	if (level > pathname_array.length) level = pathname_array.length;
	for (var i = 0; i < level; i++) {
	    if (i != 0) url += '/';
	    url += pathname_array[i];
	}
	return url;
    },

    get_title_by_level : function ( level ) {
	var url = this.get_url_by_level( level );
	return this.get_title_by_url( url );
    },

    url_exists : function( url ) {
	if (this.nav_object[url]) return true;
	return false;
    },

    get_urls_by_level : function( level ) {
	var urls_at_level = {};

	for (var url in this.nav_object) {
	    if (this.get_level_by_url( url ) == level) {
		urls_at_level[url] = this.nav_object[url];
	    }
	}
	return urls_at_level;
    },

    url_in_url : function( needle_url, haystack_url ) {
	if (needle_url == '/') return true;
	var needle_url_array = needle_url.split('/');
	var needle_url_array_length = needle_url_array.length;
	var haystack_url_array = haystack_url.split('/');
	var haystack_url_array_length = haystack_url_array.length;
	if (needle_url_array_length > haystack_url_array_length) return false;

	for (var i = 0; i < needle_url_array_length; i++) {
	    if (needle_url_array[i] != haystack_url_array[i]) return false;
	}
	return true;
    },

    get_url_children : function( url ) {
	var url_children = {};
	var url_array = url.split('/');
	var url_level = this.get_level_by_url( url );

	for (var nav_url in this.nav_object) {
	    var nav_url_array = nav_url.split('/');
	    var nav_url_level = this.get_level_by_url( nav_url );
	    if (nav_url_level != url_level + 1) continue;
	    if (! this.url_in_url( url, nav_url )) continue;
	    url_children[nav_url] = this.nav_object[nav_url];
	}

	return url_children;
    },

    change_url : function( url ) {
	var stateObj = { foo: "bar" };
	if (! url) url = '/';
	var new_url = this.home_url + url;
	var new_href = location.protocol + "//" + location.hostname + new_url;
	if (location.href == new_href) return;

	if (this.browser_supports_pushState()) {
	    this.previous_href = window.location.href;
	    history.pushState( stateObj, null, new_url );
	    if (this.previous_href != window.location.href) { 
		this.update_to_url( new_url );
	    }
	} else {
	    window.location.href = this.home_url + '/#!' + url;
	}
	return;
    },

    browser_supports_pushState : function() {
	return !(typeof history.pushState === 'undefined');
    }
});