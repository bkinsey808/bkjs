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
var Breadcrumb = Class.extend({
  max_breadcrumb_links : 10,

  init : function( elem, nav, breadcrumb_id ) {
    this.elem = elem;
    this.nav = nav;
    if (breadcrumb_id) {
      this.breadcrumb_id = breadcrumb_id;
    } else {
      this.breadcrumb_id = this.elem.attr('id');
    }
    this.breadcrumb_links = [];

    if ($( '#' + breadcrumb_id + '_nav' ).length) {
      this.breadcrumb_nav = $( '#' + breadcrumb_id + '_nav' );
    } else {
      this.breadcrumb_nav = $( '<nav/>' );
      this.elem.append( this.breadcrumb_nav );
    }

    if ($( '#' + breadcrumb_id + '_ul' ).length) {
      this.breadcrumb_ul = $( '#' + breadcrumb_id + '_ul' );
    } else {
      this.breadcrumb_ul = $( '<ul/>' );
      this.breadcrumb_nav.append( this.breadcrumb_ul );
    }

    this.update( nav, breadcrumb_id );
  },
  update : function( nav, breadcrumb_id ) {
    if (nav) this.nav = nav;
    if (breadcrumb_id) this.breadcrumb_id = breadcrumb_id;
    var current_level = this.nav.get_level();

    for (var i = 0; i <= current_level; i++) {
      var url = this.nav.get_url_by_level(i);
      var url_level = this.nav.get_level_by_url( url );

      if (this.nav.url_exists( url ) && url_level == i) {
        this.set_link_at_level( i, url );
      } else {
        this.remove_link_at_level(i);
      }
    }

    for (var i = current_level + 1; i <= this.max_breadcrumb_links; i++) {
      this.remove_link_at_level(i);
    }
  },
  set_link_at_level : function( level, url ) {
    var title = this.nav.get_title_by_level( level );

    if (this.breadcrumb_links[level]) {
      this.breadcrumb_links[level].update( url, title, level, this.breadcrumb_id );
    } else {
      this.add_link_at_level( url, title, level );
    }
  },
  add_link_at_level : function( url, title, level ) {
    var bld;
    var link_id = this.get_breadcrumb_link_id( level );

    if ($( '#' + link_id ).length) {
      bld = $( '#' + link_id );
    } else {
      bld = $( '<li/>' );
      this.breadcrumb_ul.append( bld );
    }
    this.breadcrumb_links[level] = new Breadcrumb_Link( bld, url, title, level, this.breadcrumb_id );
  },
  remove_link_at_level : function( level ) {
    link_id = this.get_breadcrumb_link_id( level );
    if ($( '#' + link_id) ) $( '#' + link_id ).remove();
    this.breadcrumb_links[level] = null;
  },
  get_breadcrumb_link_id : function( level ) {
    return this.breadcrumb_id + '_' + level;
  }
});
