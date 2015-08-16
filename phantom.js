/*global phantom:true*/
/*global require:true*/
/*global window:true*/

var errorHandler = function(msg, trace) {
  var msgStack = ["PHANTOM ERROR: " + msg];
  if (trace && trace.length) {
    msgStack.push("TRACE:");
    trace.forEach(function(t) {
      msgStack.push(" -> " + (t.file || t.sourceURL) + ": " + t.line + (t.function ? " (in function " + t.function +")" : ""));
    });
  }
  system.stderr.write( msgStack.join("\n") + "\n" );
  phantom.exit(1);
};

var htmlfile = phantom.args[0];


var page = require("webpage").create();
page.settings.webSecurityEnabled = false;
page.settings.localToRemoteUrlAccessEnabled = true;
phantom.onError = errorHandler;
page.onError = errorHandler;

page.onConsoleMessage = function(msg) {
  system.stdout.write( "Console output: " + msg + "\n");
  system.stderr.write( "Console output error: " + msg + "\n");
};


