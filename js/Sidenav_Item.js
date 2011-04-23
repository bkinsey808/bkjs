/*
  bkjs: Ben Kinsey's Javascript Framework
  Copyright (C) 2011 Ben Kinsey
  AGPLv3 License.  Other licenses available for a small fee.

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
var Sidenav_Item = Class.extend({
  init : function( elem, url, nav, sidenav_id ) {
    this.elem = elem;
    this.child_elems = {};
    this.child_items = {};
    this.update( url, nav, sidenav_id );
  },
  update : function( url, nav, sidenav_id ) {
    if (url) this.url = url;
    if (nav) this.nav = nav;
    if (sidenav_id) this.sidenav_id = sidenav_id;
    this.sidenav_item_id = this.get_sidenav_item_id( this.url );
    this.elem.attr( 'id', this.sidenav_item_id );
    this.url_children = this.nav.get_url_children( this.url );
    this.update_anchor();

    var has_children = this.has_children( this.url_children );
    var url_in_pathname = this.nav.url_in_url( url, location.pathname );
    
    if ( has_children && url_in_pathname ) {
      this.expand();
    } else {
      this.unexpand();
    }
  },
  update_anchor : function () {
    var anchor_id = this.get_anchor_id();

    if ($( '#' + anchor_id ).length) {
      this.anchor_elem = $( '#' + anchor_id );
    } else {
      this.anchor_elem = $( '<a/>' );
      this.elem.append( this.anchor_elem );
    }
    this.anchor_elem.attr('id', anchor_id);
    var anchor_title = this.nav.get_title_by_url( this.url );
    this.anchor = new Anchor( this.anchor_elem, this.url, anchor_title);
  },
  has_children : function ( url_children ) {
    for (var url in url_children) {
	if (url_children.hasOwnProperty( url )) return true;      
    }
    return false;
  },
  expand : function () {
    this.set_ul();

    for (child_url in this.url_children) {
      this.set_child( child_url );
    }
  },
  set_ul : function () {
    var ul_id = this.get_ul_id();

    if ($( '#' + ul_id ).length) {
      this.ul_elem = $( '#' + ul_id );
    } else {
      this.ul_elem = $( '<ul/>' );
      this.elem.append( this.ul_elem );
    }
    this.ul_elem.attr('id', ul_id);
    this.ul_elem.show();
  },
  set_child : function ( child_url ) {
    var child_sidenav_item_id = this.get_sidenav_item_id( child_url );
    this.set_li( child_sidenav_item_id, child_url );

    if (this.child_items[child_url]) {
      this.child_items[child_url].update( child_url, this.nav, this.sidenav_id );
    } else {
      var child_elem = this.child_elems[child_url];
      this.child_items[child_url] = new Sidenav_Item( child_elem, child_url, this.nav, this.sidenav_id );
    }
  },
  set_li : function ( child_sidenav_item_id, child_url ) {
    if ($( '#' + child_sidenav_item_id ).length) {
      this.child_elems[child_url] = $( '#' + child_sidenav_item_id );
    } else {
      this.child_elems[child_url] = $( '<li/>' );
      this.ul_elem.append( this.child_elems[child_url] );
    }
  },
  unexpand : function () {
    if (! this.ul && $( '#' + this.get_ul_id() ).length) {
      this.ul = $( '#' + this.get_ul_id() );
    }
    if (this.ul) this.ul.hide();
  },
  get_ul_id : function () {
    return this.sidenav_item_id + '_ul';
  },
  get_anchor_id : function () {
    return this.sidenav_item_id + '_a';
  },
  get_sidenav_item_id : function( url ) {
      return this.sidenav_id + '_' + url.replace(/\//g, '__');
  }
});