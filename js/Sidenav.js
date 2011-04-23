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
var Sidenav = Class.extend({
  init : function( elem, nav, sidenav_id ) {
    this.elem = elem;
    if (sidenav_id) { 
      this.sidenav_id = sidenav_id;
    } else {
      this.sidenav_id = this.elem.attr('id');
    }
    this.child_elems = {};
    this.child_items = {};
    this.update( sidenav_id, nav );
  },
  update : function( sidenav_id, nav ) {
    if (nav) this.nav = nav;
    if (sidenav_id) this.sidenav_id = sidenav_id;
    this.url_children = this.nav.get_url_children( '/' );
    this.set_ul();

    for (child_url in this.url_children) {
      this.set_child( child_url);
    }
  },
  set_child : function( child_url ) {
    this.set_li( child_url );

    if (this.child_items[child_url]) {
      this.child_items[child_url].update( child_url, this.nav, this.sidenav_id );
    } else {
      var child_elem = this.child_elems[child_url];
      this.child_items[child_url] = new Sidenav_Item( child_elem, child_url, this.nav, this.sidenav_id );
    }
  },
  set_ul : function() {
    var ul_id = this.get_ul_id();

    if ($( '#' + ul_id ).length) {
      this.ul_elem = $( '#' + ul_id );
    } else {
      this.ul_elem = $( '<ul/>' );
      this.elem.append( this.ul_elem );
    }
    this.ul_elem.attr('id', ul_id);
  },
  set_li : function( child_url ) {
    var child_sidenav_item_id = this.get_sidenav_item_id( child_url );

    if ($( '#' + child_sidenav_item_id ).length) {
      this.child_elems[child_url] = $( '#' + child_sidenav_item_id );
    } else {
      this.child_elems[child_url] = $( '<li/>' );
      this.ul_elem.append( this.child_elems[child_url] );
    }
  },
  get_ul_id : function() {
    return this.sidenav_id + '_ul';
  },
  get_sidenav_item_id : function( url ) {
      return this.sidenav_id + '_' + url.replace(/\//g, '__');
  }
});