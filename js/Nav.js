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
var Nav = Class.extend({
  init : function( nav_object) {
    this.nav_object = nav_object;
  },
  get_title : function() {
    return this.get_title_by_url( location.pathname );
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
    return this.get_level_by_url( location.pathname );
  },
  get_level_by_url : function( url ) {
    if (url == '/') return 0;
    return url.split('/').length - 1;
  },
  get_url_by_level : function ( level ) {
    if ( level == 0 ) return '/';
    var pathname_array = location.pathname.split('/');
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
  }
});
