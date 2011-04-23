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
var Breadcrumb_Link = Class.extend({
  init : function( elem, url, display, level, breadcrumb_id ) {
    this.elem = elem;
    this.url = url;
    this.display = display;
    this.level = level;
    this.breadcrumb_id = breadcrumb_id;
    var anchor_id = this.get_anchor_id();

    if ($( '#' + anchor_id ).length) {
      this.anchor_elem = $( '#' + anchor_id );
    } else {
      this.anchor_elem = $( '<a/>' );
      this.elem.append( this.anchor_elem );
    }
    this.anchor = new Breadcrumb_Anchor( this.anchor_elem, url, display, this.get_anchor_id() );
    elem.append( this.anchor_elem );
    elem.append( ' &gt;' );
    this.update( url, display, level, breadcrumb_id );
    this.elem.attr( 'itemscope', 'itemscope' );
    this.elem.attr( 'itemtype', 'http://data-vocabulary.org/Breadcrumb' );
  },
  update : function( url, display, level, breadcrumb_id ) {
    if (url) this.url = url;
    if (display) this.display = display;
    if (level) this.level = level;
    if (breadcrumb_id) this.breadcrumb_id = breadcrumb_id;
    this.elem.attr( 'id', this.breadcrumb_id + '_' + this.level );
    this.anchor.update( this.url, this.display, this.get_anchor_id() );
  },
  get_anchor_id : function() {
    return 'id', this.breadcrumb_id + '_a_' + this.level;
  }
});
