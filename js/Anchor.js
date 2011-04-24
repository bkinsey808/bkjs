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
var Anchor = Class.extend({
  init : function( elem, url, display ) {
    this.elem = elem;
    this.update( url, display );
  },
  add_url_class : function() {
    this.elem.addClass(this.url.replace(/\//g, '__'));
  },
  update : function ( url, display ) {
    if (url) this.url = url;
    if (display) this.display = display;
    this.update_display();
    this.elem.attr('href', "javascript:nav.change_url('" + url + "')");
  },
  update_display : function( display ) {
    this.elem.html(this.display);
  }
});
