<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8 />
<title>twitness</title>
<!--[if IE]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <script language="javascript" type="text/javascript" src="excanvas.pack.js"></script>
<![endif]-->
<link href="/css/twitness.css" rel="stylesheet" type="text/css"/>
</head>
<body>
  <div id="content">
    <h1><a href="/">twitness</a></h1>
    <div id="userInput">
        <input type="text" id="username"/>
	<input type="button" id="usernameSearch" value="Show"/>
    </div>
	<div id="explanation">
		Tracking your fitness since 2009.  Simply tweet your <span class="sets">sets</span> along with "hundredpushups" and we'll track your progress.
		For an example check out <a href="#rapaul">@rapaul</a> struggling or <a href="#mrdanparker">@mrdanparker</a> dominating.
	</div>
    <div id="display">
        <div id="graph" style="width:600px;height:300px"><!-- Place holder --></div>
        <ol id="recent"><!-- Place holder --></ol>
    </div>
  </div>
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
  <script type="text/javascript" src="/js/jquery.twitnessCacheSearch.js"></script>
  <script type="text/javascript" src="/js/twitness.js"></script>
  <script type="text/javascript" src="/js/jquery.flot.pack.js"></script>
  <script type="text/javascript" src="/js/jquery.timeago.js"></script>
  <script type="text/javascript">
  	var uservoiceJsHost = ("https:" == document.location.protocol) ? "https://uservoice.com" : "http://cdn.uservoice.com";
	document.write(unescape("%3Cscript src='" + uservoiceJsHost + "/javascripts/widgets/tab.js' type='text/javascript'%3E%3C/script%3E"))
  </script>
  <script type="text/javascript" src="/js/uservoice.js"></script>
</body>
</html>
