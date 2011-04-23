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
var Breadcrumb_Anchor = Anchor.extend({
  init : function( elem, url, display, id ) {
    if (elem) this.elem = elem;
    if (id) this.id = id;

    if ($( '#' + this.get_span_id() ).length) {
      this.span_elem = $( '#' + this.get_span_id() );
    } else {
      this.span_elem = $( '<span/>' );
      this.span_elem.attr( 'itemprop', 'title' );
      this.elem.append( this.span_elem );
    }
    this._super( elem, url, display );
    this.elem.attr( 'itemprop', 'url' );
  },
  update : function( url, display, id ) {
    this._super( url, display );
    if (id) this.id = id;
    this.elem.attr( 'id', this.id );
    this.span_elem.attr( 'id', this.get_span_id() );
  },
  get_span_id : function() {
    return this.id + '_span';
  },
  update_display : function() {
    this.span_elem.html(this.display);
  }
});
