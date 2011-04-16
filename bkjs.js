(function(){
  var initializing = false;
  var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  this.Class = function(){};
 
  Class.extend = function(prop) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();
    initializing = false;
  
    for (var name in prop) {
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            this._super = _super[name];
            var ret = fn.apply(this, arguments);      
            this._super = tmp;
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
  
    function Class() {
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
  
    Class.prototype = prototype;
    Class.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
  };
})();


//alert('only first');
var nav_object = {};
nav_object['/'] = 'Home';
nav_object['/tm1'] = 'Top Level Menu 1';
nav_object['/tm1/tm1i1'] = 'Top Level Menu 1 Item 1';
nav_object['/bar1'] = 'Bar 1';
nav_object['/bar1/bar2'] = 'Bar 2';


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
  }
});

var nav = new Nav( nav_object );


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
    //alert ("href: " + window.location.href + " prev: " + previous_href);
    if (window.location.href != previous_href) {
    previous_href = window.location.href;
      change();
  }
}

function change() {
    document.title = window.location.href;
  breadcrumb.update();
}

//alert(get_title());

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
    this.elem.html(this.display);
    this.elem.attr('href', "javascript:change_url('" + url + "')");
  }
});

var Breadcrumb = Class.extend({
  max_breadcrumb_links : 10,

  init : function( elem, nav, breadcrumb_id ) {
    this.elem = elem;
    this.nav = nav;
    this.breadcrumb_id = breadcrumb_id;
    this.breadcrumb_links = [];

    if ($( '#' + breadcrumb_id + '_ul' ).length) {
      this.breadcrumb_ul = $( '#' + breadcrumb_id + '_ul' );
    } else {
      this.breadcrumb_ul = $( '<ul/>' );
      this.elem.append( this.breadcrumb_ul );
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
    var link_id = this.get_breadcrumb_link_id( level );

    if (this.breadcrumb_links[level]) {
      this.breadcrumb_links[level].update( url, title, level, this.breadcrumb_id );
    } else {
      var bld;

      if ($( '#' + link_id ).length) {
        bld = $( '#' + link_id );
      } else {
        bld = $( '<li/>' );
        this.breadcrumb_ul.append( bld );
      }
      this.breadcrumb_links[level] = new Breadcrumb_Link( bld, url, title, level, this.breadcrumb_id );
    }
  },
  remove_link_at_level : function( level ) {
    link_id = this.get_breadcrumb_link_id( level );
    if ($( '#' + link_id) ) $( '#' + link_id ).remove();
  },
  get_breadcrumb_link_id : function( level ) {
    return this.breadcrumb_id + '_' + level;
  }
});

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
    this.anchor = new Anchor( this.anchor_elem, url, display );
    elem.append( this.anchor_elem );
    elem.append( ' &gt;' );
    this.update( url, display, level, breadcrumb_id );
  },
  update : function( url, display, level, breadcrumb_id ) {
    if (url) this.url = url;
    if (display) this.display = display;
    if (level) this.level = level;
    if (breadcrumb_id) this.breadcrumb_id = breadcrumb_id;
    this.elem.attr( 'id', this.breadcrumb_id + '_' + this.level );
    this.anchor_elem.attr( 'id', this.get_anchor_id() );
    this.anchor.update( this.url, this.display );
  },
  get_anchor_id : function() {
    return 'id', this.breadcrumb_id + '_a_' + this.level;
  }
});


var a = new Anchor( $('#bar'), '/bar/bar', 'change to bar' );
a.add_url_class();


breadcrumb = new Breadcrumb( $( '#breadcrumb' ), nav, 'breadcrumb' );

//var blt = $('<div/>');
//var bl = new Breadcrumb_Link(blt, '/', 'Home', 0, 'breadcrumb');
//$('#breadcrumb').append(blt);
//nav_object['/'] = 'Home2';
