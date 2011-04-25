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


var nav_object = {};
nav_object['/'] = 'Home';
nav_object['/tm1'] = 'Top Level Menu 1';
nav_object['/tm1/tm1i1'] = 'Top Level Menu 1 Item 1';
nav_object['/bar1'] = 'Bar 1';
nav_object['/bar1/bar2'] = 'Bar 2';
nav_object['/bar1/bar2b'] = 'Bar 2b';
nav_object['/bar1/bar2b/a'] = 'Bar 2b a';
nav_object['/bar1/bar2b/b'] = 'Bar 2b b';

var nav = new Nav( nav_object, update_callback );
var a = new Anchor( $('#bar'), '/bar/bar', 'change to bar' );

breadcrumb = new Breadcrumb( $( '#breadcrumb' ), nav );
sidenav = new Sidenav( $( '#sidenav' ), nav );

$('#breadcrumb_a_0').focus();


function update_callback() {
  if (breadcrumb.update) breadcrumb.update();
  if (sidenav.update) sidenav.update();
}
nav.set_update_callback( update_callback ); 

window.onpopstate = detect_href_change;
window.onpushstate = detect_href_change;


function  detect_href_change ( event ) {
  if (window.location.href != this.previous_href) {
    nav.previous_href = window.location.href;
    nav.my_change();
  }
}

$(window).hashchange( function(){
  if (! nav.browser_supports_pushState()) {
    detect_href_change();
  }
});

