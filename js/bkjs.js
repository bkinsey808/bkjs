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

var nav = new Nav( nav_object );

document.title = nav.get_title();

var previous_href = window.location.href;
var stateObj = { foo: "bar" };


function change_url(url) {
  if (! url) url = '/';
  var new_href = location.protocol + "//" + location.hostname + url;
  if (location.href == new_href) return;

  if (browser_supports_pushState()) {
    previous_href = window.location.href;
    history.pushState(stateObj, null, url);
    if (previous_href != window.location.href) change();
  } else {
    window.location.href = url;
  }
  return;
}

function browser_supports_pushState() {
  return !(typeof history.pushState === 'undefined');
}

window.onpopstate = detect_href_change;
window.onpushstate = detect_href_change;

function detect_href_change(event) {
  if (window.location.href != previous_href) {
    previous_href = window.location.href;
    change();
  }
}

function change() {
  document.title = nav.get_title();
  breadcrumb.update();
  sidenav.update();
}

function get_title(nav_path) {
  var title = 'Default';

  while (nav_path.length) {
    if (typeof nav_object[nav_path] != 'undefined') return nav_object[nav_path];
    var last_index_of_slash = nav_path.lastIndexOf('/');

    if (last_index_of_slash > 0) {
      nav_path = nav_path.substring(0, nav_path.lastIndexOf('/'));
    } else {
      return title;
    }
  }
  return title;
}

var a = new Anchor( $('#bar'), '/bar/bar', 'change to bar' );
a.add_url_class();

breadcrumb = new Breadcrumb( $( '#breadcrumb' ), nav );
sidenav = new Sidenav( $( '#sidenav' ), nav );

