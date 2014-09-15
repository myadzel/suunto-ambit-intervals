"use strict";angular.module("ambitIntervalsApp",["ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.tree","LocalStorageModule"]).config(["localStorageServiceProvider",function(a){a.setPrefix("ambitintervals")}]).config(["$routeProvider","$locationProvider",function(a,b){b.hashPrefix("!"),a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/howto",{templateUrl:"views/howto.html",controller:"HowtoCtrl"}).when("/feedback",{templateUrl:"views/feedback.html",controller:"FeedbackCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("ambitIntervalsApp").controller("MainCtrl",["$scope","intervalFilesService","idgenerator",function(a,b,c){function d(a){return{name:a,id:c.getId(),description:"",steps:[]}}function e(){return{type:"Other",duration:{type:"Lap"},target:{type:"None"}}}function f(){if(0===a.intervals.length){var b=d("Interval 1");a.intervals.push(b),a.interval=b}else a.interval=a.intervals[0]}function g(a,b){"Repeat"===b.type&&b.steps.length>2?window.confirm("Do you really wan't to delete Repeat with "+b.steps.length+" steps?")&&_.remove(a,b):_.remove(a,b)}a.showImportExport=null!==window.webkitURL,a.showFilePicker=!1,a.interval=null,a.intervals=b.getIntervals(),a.importFile="",f(),a.$watch("interval",function(a){b.saveInterval(a)},!0),a.$watch("importFile",function(b){if(b&&b.length>0){var c=JSON.parse(b);a.intervals.push(c),a.interval=c,a.showFilePicker=!1}}),a.showLoadInterval=function(){a.showFilePicker=!0},a.hideLoadInterval=function(){a.showFilePicker=!1},a.exportInterval=function(){var b=new Blob([angular.toJson(a.interval,!0)],{type:"text/plain"}),c=document.createElement("a");c.download=a.interval.name+".txt",c.innerHTML="Download File",null!==window.webkitURL&&(c.href=window.webkitURL.createObjectURL(b)),c.click()},a.addNewInterval=function(){var b=d("Interval "+(a.intervals.length+1));a.intervals.push(b),a.interval=b},a.duplicateInterval=function(){var b=_.cloneDeep(a.interval);b.name=b.name+" copy",b.id=c.getId(),a.intervals.push(b),a.interval=b},a.deleteInterval=function(){if(window.confirm("Do you really wan't to delete '"+a.interval.name+"'?")){b.deleteInterval(a.interval);var c=a.interval;a.interval=null,_.remove(a.intervals,c),f()}},a.deleteStep=function(b){_.contains(a.interval.steps,b)?g(a.interval.steps,b):_(a.interval.steps).where(function(a){return"Repeat"===a.type}).each(function(a){g(a.steps,b)})},a.addStepTo=function(a){a.steps.push(e())},a.addStep=function(){a.interval.steps.push(e())},a.addRepeat=function(){var b={type:"Repeat",times:1,steps:[]};a.interval.steps.push(b)},a.options={accept:function(a,b){var c=a.$modelValue,d=b.$element.attr("data-nodetype");return"Repeat"===d&&"Repeat"===c.type?!1:!0}}}]),angular.module("ambitIntervalsApp").directive("stepEditor",function(){return{restrict:"E",replace:!0,scope:{step:"=",deleteStep:"="},templateUrl:"views/stepeditortemplate.html",link:function(a){a.stepTypes=["Other","WarmUp","Interval","Recovery","Rest","CoolDown"],a.durationTypes=["Distance","Time","Lap","Calories","HR"],a.targetTypes=["Pace","Cadence","Speed","HR","Power","None"]}}}),angular.module("ambitIntervalsApp").service("codeGeneratorService",["preprocessor",function(a){var b=function(a,b){var c="";return c+="/* "+b+" App */\r\n",c+="/* "+a.name+" */\r\n",a.description&&(c+="/* "+a.description+" */\r\n"),c+="\r\n"},c=function(a){var b="";b+="/* Initialize variables */\r\n",b+="if (SUUNTO_DURATION == 0) {\r\n";for(var c=0;c<a.length;++c)b+="  "+a[c]+" = 0;\r\n";return b+="}\r\n\r\n"},d=function(a,b){if(!a.duration.value)throw new Error(b+" missing for step "+a.type)},e=function(a){var b="";return"WarmUp"===a.type&&(b+='  prefix = "wu";\r\n'),"CoolDown"===a.type&&(b+='  prefix = "cd";\r\n'),"Interval"===a.type&&(b+='  prefix = "int";\r\n'),"Recovery"===a.type&&(b+='  prefix = "rec";\r\n'),"Rest"===a.type&&(b+='  prefix = "rest";\r\n'),"Other"===a.type&&(b+='  prefix = "othr";\r\n'),"Lap"===a.duration.type&&(b+='  postfix = "m";\r\n',b+="  RESULT = SUUNTO_LAP_DISTANCE * 1000;\r\n"),"Distance"===a.duration.type&&(d(a,"Distance"),b+='  postfix = "m";\r\n',b+="  RESULT = "+1e3*a.duration.value+" - (SUUNTO_LAP_DISTANCE * 1000);\r\n"),"Time"===a.duration.type&&(d(a,"Time"),b+='  postfix = "s";\r\n',b+="  RESULT = "+a.duration.value+" - SUUNTO_LAP_DURATION;\r\n"),"Calories"===a.duration.type&&(d(a,"Calories"),b+='  postfix = "kc";\r\n',b+="  RESULT = "+a.duration.value+" - SUUNTO_LAP_ENERGY;\r\n"),"HR"===a.duration.type&&(d(a,"HR"),b+='  postfix = "hr";\r\n',b+="  RESULT = "+a.duration.value+" - SUUNTO_HR;\r\n"),b},f=function(a,b,c,d){var e="";return e+="  ACTUAL = "+b+";\r\n",e+="  FROM = "+a.target.from+";\r\n",e+="  TO = "+a.target.to+";\r\n",e+="  FORMATPACE = "+d+";\r\n",e+='  postfix = "'+c+'";\r\n'},g=function(a,b){if(!a.target.to||!a.target.from)throw new Error(b+" missing for step "+a.type)},h=function(a){var b="";return"Pace"===a.target.type&&(g(a,"Target pace"),b+=f(a,"SUUNTO_PACE * 60","/km",1)),"Speed"===a.target.type&&(g(a,"Target speed"),b+=f(a,"SUUNTO_SPEED","kmt",0)),"HR"===a.target.type&&(g(a,"Target heart rate"),b+=f(a,"SUUNTO_HR","bpm",0)),"Power"===a.target.type&&(g(a,"Target power"),b+=f(a,"SUUNTO_BIKE_POWER","W",0)),"None"===a.target.type&&(b+="  ACTUAL = SUUNTO_PACE * 60;\r\n",b+="  FROM = ACTUAL;\r\n",b+="  TO = ACTUAL;\r\n",b+="  FORMATPACE = 1;\r\n",b+='  postfix = "/km";\r\n'),"Cadence"===a.target.type&&(g(a,"Target cadence"),b+="  ACTUAL = SUUNTO_CADENCE;\r\n",b+="  FROM = "+a.target.from+";\r\n",b+="  TO = "+a.target.to+";\r\n",b+="  FORMATPACE = 0;\r\n\r\n",b+="  /* Check for cycling, mountain biking or indoor cycling */\r\n",b+="  if(SUUNTO_ACTIVITY_TYPE == 4 || SUUNTO_ACTIVITY_TYPE == 5 || SUUNTO_ACTIVITY_TYPE == 17) {\r\n",b+='    postfix = "rpm";\r\n',b+="  } else {\r\n",b+='    postfix = "spm";\r\n',b+="  }\r\n"),b},i=function(a,b){return"/* Lap "+a+" is step type "+b.type+" with duration type "+b.duration.type+" */\r\n"},j=function(a,b){return"/* Lap "+a+" is step type "+b.type+" with target type "+b.target.type+" */\r\n"},k=function(a,b,c){for(var d="",e=0,f=0;f<a.steps.length;++f){e++;var g=a.steps[f];if("Repeat"===g.type){for(var h=0;h<g.steps.length;++h){for(var i=[],j=[],k=g.steps[h],l=0;l<g.times;++l){var m=e+h+l*g.steps.length;j.push(m),i.push("SUUNTO_LAP_NUMBER == "+m)}d+=b(j.join(", "),k),d+="if ("+i.join(" || ")+") {\r\n",d+=c(k),d+="}\r\n\r\n"}e+=g.times*g.steps.length-1}else d+=b(e,g),d+="if (SUUNTO_LAP_NUMBER == "+e+") {\r\n",d+=c(g),d+="}\r\n\r\n"}return d};this.generateDurationApp=function(d){var f=JSON.parse(JSON.stringify(d));f=a.convertPaceToSeconds(f);var g="";return g+=b(f,"Duration"),g+=c(["RESULT"]),g+=k(f,i,e),g+="/* Notify if duration is reached */\r\n",g+="if (RESULT < 0) {\r\n",g+="  RESULT = 0;\r\n",g+="  Suunto.alarmBeep();\r\n",g+="}\r\n"},this.generateTargetApp=function(d){var e=d;e=JSON.parse(JSON.stringify(e)),e=a.convertPaceToSeconds(e);var f="";return f+=b(e,"Target"),f+=c(["ACTUAL","TO","FROM","FORMATPACE","TARGET","TARGETSEC","TARGETMIN","RESULT"]),f+=k(e,j,h),f+="/* Set target value */\r\n",f+="if (ACTUAL > TO) {\r\n",f+="  TARGET = TO;\r\n",f+="} else if (ACTUAL < FROM) {\r\n",f+="  TARGET = FROM;\r\n",f+="} else {\r\n",f+="  TARGET = ACTUAL;\r\n",f+="}\r\n\r\n",f+="/* Check if result should be formatted as pace and lables reversed */\r\n",f+="if (FORMATPACE == 1) {\r\n",f+="  if (ACTUAL > TO) {\r\n",f+='    prefix ="up";\r\n',f+="  } else if (ACTUAL < FROM) {\r\n",f+='    prefix = "dwn";\r\n',f+="  } else {\r\n",f+='    prefix = "ok";\r\n',f+="  }\r\n\r\n",f+="  TARGETSEC = Suunto.mod(TARGET, 60);\r\n",f+="  TARGETMIN = (TARGET - TARGETSEC) / 60;\r\n",f+="  RESULT = TARGETMIN + TARGETSEC/100;\r\n",f+="} else {\r\n",f+="  if (ACTUAL > TO) {\r\n",f+='    prefix ="dwn";\r\n',f+="  } else if (ACTUAL < FROM) {\r\n",f+='    prefix = "up";\r\n',f+="  } else {\r\n",f+='    prefix = "ok";\r\n',f+="  }\r\n\r\n",f+="  RESULT = TARGET;\r\n",f+="}\r\n"}}]),angular.module("ambitIntervalsApp").filter("generateDurationApp",["codeGeneratorService",function(a){return function(b){if(b)try{return a.generateDurationApp(b)}catch(c){return"Error: "+c.message}}}]),angular.module("ambitIntervalsApp").filter("generateTargetApp",["codeGeneratorService",function(a){return function(b){if(b)try{return a.generateTargetApp(b)}catch(c){return"Error: "+c.message}}}]),angular.module("ambitIntervalsApp").service("intervalFilesService",["localStorageService",function(a){this.getIntervals=function(){for(var b=[],c=a.keys(),d=0;c.length>d;++d)b.push(this.getInterval(c[d]));return b},this.getInterval=function(b){return a.get(b)},this.saveInterval=function(b){a.remove(b.id),a.set(b.id,b)},this.deleteInterval=function(b){a.remove(b.id)}}]),angular.module("ambitIntervalsApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("ambitIntervalsApp").controller("HowtoCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("ambitIntervalsApp").directive("mainmenu",["$location",function(a){return{templateUrl:"views/mainmenu.html",restrict:"E",replace:!0,scope:"@",link:function(b){b.getClass=function(b){return b===a.path()?"active":""}}}}]),angular.module("ambitIntervalsApp").service("preprocessor",function(){this.convertPaceToSeconds=function(a){function b(a){var b=e.exec(a);if(b&&b.length>1){var c=Number(b[1]),d=Number(b[2]);return(60*c+d).toString()}return a}function c(a){"Pace"===a.target.type&&(a.target.from=b(a.target.from),a.target.to=b(a.target.to)),"Time"===a.duration.type&&(a.duration.value=b(a.duration.value))}function d(a){for(var b=0;b<a.length;++b)"Repeat"===a[b].type?d(a[b].steps):c(a[b])}var e=/(\d\d):(\d\d)/;return d(a.steps),a}}),angular.module("ambitIntervalsApp").controller("FeedbackCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("ambitIntervalsApp").directive("appoutput",function(){var a=function(a){var b=window.getSelection(),c=document.createRange();c.selectNode(a),b.removeAllRanges(),b.addRange(c)};return{restrict:"E",scope:"@",templateUrl:"views/appoutput.html",link:function(b,c){b.showDurationHelp=!1,b.showTargetHelp=!1,b.copyHelpText="Now press CMD+C to copy",b.selectDurationApp=function(){b.showDurationHelp=!0,b.showTargetHelp=!1,a(c.find("pre")[0])},b.selectTargetApp=function(){b.showTargetHelp=!0,b.showDurationHelp=!1,a(c.find("pre")[1])}}}}),angular.module("ambitIntervalsApp").directive("dirDisqus",["$window",function(a){return{restrict:"E",scope:{disqus_shortname:"@disqusShortname",disqus_identifier:"@disqusIdentifier",disqus_title:"@disqusTitle",disqus_url:"@disqusUrl",disqus_category_id:"@disqusCategoryId",disqus_disable_mobile:"@disqusDisableMobile",readyToBind:"@"},template:'<div id="disqus_thread"></div><a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>',link:function(b){if("undefined"==typeof b.disqus_identifier||"undefined"==typeof b.disqus_url)throw"Please ensure that the `disqus-identifier` and `disqus-url` attributes are both set.";b.$watch("readyToBind",function(c){if(angular.isDefined(c)||(c="true"),b.$eval(c))if(a.disqus_shortname=b.disqus_shortname,a.disqus_identifier=b.disqus_identifier,a.disqus_title=b.disqus_title,a.disqus_url=b.disqus_url,a.disqus_category_id=b.disqus_category_id,a.disqus_disable_mobile=b.disqus_disable_mobile,a.DISQUS)a.DISQUS.reset({reload:!0,config:function(){this.page.identifier=b.disqus_identifier,this.page.url=b.disqus_url,this.page.title=b.disqus_title}});else{var d=document.createElement("script");d.type="text/javascript",d.async=!0,d.src="//"+b.disqus_shortname+".disqus.com/embed.js",(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(d)}})}}}]),angular.module("ambitIntervalsApp").directive("fileread",[function(){return{scope:{fileread:"="},link:function(a,b){b.bind("change",function(b){var c=new FileReader;c.onload=function(b){a.$apply(function(){a.fileread=b.target.result})},c.readAsText(b.target.files[0],"UTF-8")})}}}]),angular.module("ambitIntervalsApp").service("idgenerator",function(){this.getId=function(){return Math.round(1e16*Math.random(10))+""}});