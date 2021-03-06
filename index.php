<?php 
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

$home_url = '';
?>
<html>
<head>
  <title></title>
<link rel="stylesheet" type="text/css" 
      href="<?php echo $home_url ?>/css/index.css" />
</head>
<body>
<script type="text/javascript" 
	src="<?php echo $home_url ?>/js/jquery-1.5.2.min.js"></script>
<div id="header"></div>
<div id="breadcrumb"></div>
<div id="sidenav"></div>
<div id="view"><a id="bar" ></a>
Parameter: <?php print_r($_GET); ?>
<script type="text/javascript" 
  	src="<?php echo $home_url ?>/js/jquery.ba-hashchange.js"></script>
<script type="text/javascript" 
	src="<?php echo $home_url ?>/js/Class.js"></script>
<script type="text/javascript" 
	src="<?php echo $home_url ?>/js/Nav.js"></script>
<script type="text/javascript" 
	src="<?php echo $home_url ?>/js/View.js"></script>
<script type="text/javascript" 
	src="<?php echo $home_url ?>/js/Anchor.js"></script>
<script type="text/javascript" 
	src="<?php echo $home_url ?>/js/index.js"></script>
</div>
</body>
</html>
