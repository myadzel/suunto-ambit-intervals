"use strict";angular.module("ambitIntervalsApp",["ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.tree","LocalStorageModule"]).config(["localStorageServiceProvider",function(a){a.setPrefix("ambitintervals")}]).config(["$routeProvider","$locationProvider",function(a,b){b.hashPrefix("!"),a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/howto",{templateUrl:"views/howto.html",controller:"HowtoCtrl"}).when("/feedback",{templateUrl:"views/feedback.html",controller:"FeedbackCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("ambitIntervalsApp").controller("MainCtrl",["$scope","intervalFilesService","idgenerator","calculatorservice",function(a,b,c,d){function e(a){return{name:a,id:c.getId(),description:"",defaultDurationType:"Distance",defaultTargetType:"Pace",durationAlarm:!0,targetAlarm:!1,lightAlarm:!1,imperial:!1,steps:[]}}function f(){return{type:"Other",duration:{type:"Lap"},target:{type:"None"}}}function g(){if(0===a.intervals.length){var b=e("Interval 1");a.intervals.push(b),a.interval=b}else a.interval=a.intervals[0]}function h(a,b){"Repeat"===b.type&&b.steps.length>2?window.confirm("Do you really wan't to delete Repeat with "+b.steps.length+" steps?")&&_.remove(a,b):_.remove(a,b)}a.showImportExport=null!==window.webkitURL,a.showFilePicker=!1,a.interval=null,a.intervals=b.getIntervals(),a.importFile="",a.durationTypes=["Distance","Time","Calories","HR"],a.targetTypes=["Pace","Lap Avg Pace","Cadence","Speed","HR","Lap Avg HR","Power"],a.durationAndDistance={duration:0,distance:0},g(),a.$watch("interval",function(c){b.saveInterval(c),a.durationAndDistance=d.calculateInterval(c),a.visualisation=d.calculateVisualisation(c,a.durationAndDistance)},!0),a.$watch("importFile",function(b){if(b&&b.length>0){var c=JSON.parse(b);a.intervals.push(c),a.interval=c,a.showFilePicker=!1}}),a.showLoadInterval=function(){a.showFilePicker=!0},a.hideLoadInterval=function(){a.showFilePicker=!1},a.exportInterval=function(){var b=new Blob([angular.toJson(a.interval,!0)],{type:"text/plain"}),c=document.createElement("a");c.download=a.interval.name+".txt",c.innerHTML="Download File",null!==window.webkitURL&&(c.href=window.webkitURL.createObjectURL(b)),c.click()},a.addNewInterval=function(){var b=e("Interval "+(a.intervals.length+1));a.intervals.push(b),a.interval=b},a.duplicateInterval=function(){var b=_.cloneDeep(a.interval);b.name=b.name+" copy",b.id=c.getId(),a.intervals.push(b),a.interval=b},a.deleteInterval=function(){if(window.confirm("Do you really wan't to delete '"+a.interval.name+"'?")){b.deleteInterval(a.interval);var c=a.interval;a.interval=null,_.remove(a.intervals,c),g()}},a.deleteStep=function(b){_.contains(a.interval.steps,b)?h(a.interval.steps,b):_(a.interval.steps).where(function(a){return"Repeat"===a.type}).each(function(a){h(a.steps,b)})},a.addStepTo=function(a){a.steps.push(f())},a.addStep=function(){a.interval.steps.push(f())},a.addRepeat=function(){var b={type:"Repeat",times:1,steps:[]};a.interval.steps.push(b)},a.options={accept:function(a,b){var c=a.$modelValue,d=b.$element.attr("data-nodetype");return"Repeat"===d&&"Repeat"===c.type?!1:!0}}}]),angular.module("ambitIntervalsApp").directive("stepEditor",function(){return{restrict:"E",replace:!0,scope:{step:"=",deleteStep:"=",repeatTimes:"=",useImperial:"="},templateUrl:"views/stepeditortemplate.html",link:function(a){a.stepTypes=["Other","WarmUp","Interval","Recovery","Rest","CoolDown"],a.durationTypes=["Distance","Time","Lap","Calories","HR"],a.targetTypes=["Pace","Lap Avg Pace","Cadence","Speed","HR","Lap Avg HR","Power","None"]}}}),angular.module("ambitIntervalsApp").service("codeGeneratorService",["preprocessor",function(a){var b=function(a,b){var c="";return c+="/* "+b+" App */\r\n",c+="/* "+a.name+" */\r\n",a.description&&(c+="/* "+a.description+" */\r\n"),c+="\r\n"},c=function(a){var b="";b+="/* Initialize variables */\r\n",b+="if (SUUNTO_DURATION == 0) {\r\n";for(var c=0;c<a.length;++c)b+="  "+a[c]+" = 0;\r\n";return b+="}\r\n\r\n"},d=function(a,b){if(!a.duration.value)throw new Error(b+" missing for step "+a.type)},e=function(a,b){var c="";return"WarmUp"===a.type&&(c+='  prefix = "wu";\r\n'),"CoolDown"===a.type&&(c+='  prefix = "cd";\r\n'),"Interval"===a.type&&(c+='  prefix = "int";\r\n'),"Recovery"===a.type&&(c+='  prefix = "rec";\r\n'),"Rest"===a.type&&(c+='  prefix = "rest";\r\n'),"Other"===a.type&&(c+='  prefix = "othr";\r\n'),"Lap"===a.duration.type&&("Distance"===b.defaultDurationType?b.imperial?(c+='  postfix = "yd";\r\n',c+="  RESULT = SUUNTO_LAP_DISTANCE * 1000 * 1.0936;\r\n"):(c+='  postfix = "m";\r\n',c+="  RESULT = SUUNTO_LAP_DISTANCE * 1000;\r\n"):"Time"===b.defaultDurationType?(c+='  postfix = "s";\r\n',c+="  RESULT = SUUNTO_LAP_DURATION;\r\n"):"Calories"===b.defaultDurationType?(c+='  postfix = "kc";\r\n',c+="  RESULT = SUUNTO_LAP_ENERGY;\r\n"):(c+='  postfix = "hr";\r\n',c+="  RESULT = SUUNTO_HR;\r\n")),"Distance"===a.duration.type&&(d(a,"Distance"),b.imperial?(c+='  postfix = "yd";\r\n',c+="  RESULT = "+(1760*a.duration.value).toFixed(2)+" - (SUUNTO_LAP_DISTANCE * 1000 * 1.0936);\r\n"):(c+='  postfix = "m";\r\n',c+="  RESULT = "+1e3*a.duration.value+" - (SUUNTO_LAP_DISTANCE * 1000);\r\n")),"Time"===a.duration.type&&(d(a,"Time"),c+='  postfix = "s";\r\n',c+="  RESULT = "+a.duration.value+" - SUUNTO_LAP_DURATION;\r\n"),"Calories"===a.duration.type&&(d(a,"Calories"),c+='  postfix = "kc";\r\n',c+="  RESULT = "+a.duration.value+" - SUUNTO_LAP_ENERGY;\r\n"),"HR"===a.duration.type&&(d(a,"HR"),c+='  postfix = "hr";\r\n',c+="  RESULT = "+a.duration.value+" - SUUNTO_HR;\r\n"),c},f=function(){var a="\r\n";return a+="  /* Check for cycling, mountain biking or indoor cycling */\r\n",a+="  if(SUUNTO_ACTIVITY_TYPE == 4 || SUUNTO_ACTIVITY_TYPE == 5 || SUUNTO_ACTIVITY_TYPE == 17) {\r\n",a+='    postfix = "rpm";\r\n',a+="  } else {\r\n",a+='    postfix = "spm";\r\n',a+="  }\r\n"},g=function(a,b,c,d){var e="";return e+="  ACTUAL = "+b+";\r\n",e+="  FROM = "+a.target.from+";\r\n",e+="  TO = "+a.target.to+";\r\n",e+="  FORMATPACE = "+d+";\r\n",e+="SUUNTO_CADENCE"===b?f():'  postfix = "'+c+'";\r\n'},h=function(a,b,c){var d="";return d+="  ACTUAL = "+a+";\r\n",d+="  FROM = ACTUAL;\r\n",d+="  TO = ACTUAL;\r\n",d+="  FORMATPACE = "+c+";\r\n",d+="SUUNTO_CADENCE"===a?f():'  postfix = "'+b+'";\r\n'},i=function(a,b){if(!a.target.to||!a.target.from)throw new Error(b+" missing for step "+a.type)},j=function(a,b){var c="",d="";return("Pace"===a.target.type||"Lap Avg Pace"===a.target.type)&&(i(a,"Target pace"),d="Pace"===a.target.type?"SUUNTO_PACE":"SUUNTO_LAP_PACE",c+=b.imperial?g(a,d+" * 1.609 * 60","/mi",1):g(a,d+" * 60","/km",1)),"Speed"===a.target.type&&(i(a,"Target speed"),c+=b.imperial?g(a,"SUUNTO_SPEED * 0.6214","mph",0):g(a,"SUUNTO_SPEED","kmh",0)),"HR"===a.target.type&&(i(a,"Target heart rate"),c+=g(a,"SUUNTO_HR","bpm",0)),"Lap Avg HR"===a.target.type&&(i(a,"Target heart rate"),c+=g(a,"SUUNTO_LAP_AVG_HR","bpm",0)),"Power"===a.target.type&&(i(a,"Target power"),c+=g(a,"SUUNTO_BIKE_POWER","W",0)),"Cadence"===a.target.type&&(i(a,"Target cadence"),c+=g(a,"SUUNTO_CADENCE","",0)),"None"===a.target.type&&("Pace"===b.defaultTargetType?c+=b.imperial?h("SUUNTO_PACE * 1.609 * 60","/mi",1):h("SUUNTO_PACE * 60","/km",1):"Lap Avg Pace"===b.defaultTargetType?c+=b.imperial?h("SUUNTO_LAP_PACE * 1.609 * 60","/mi",1):h("SUUNTO_LAP_PACE * 60","/km",1):"Speed"===b.defaultTargetType?c+=b.imperial?h("SUUNTO_SPEED * 0.6214","mph",0):h("SUUNTO_SPEED","kmh",0):"Lap Avg HR"===b.defaultTargetType?c+=h("SUUNTO_LAP_AVG_HR","bpm",0):"HR"===b.defaultTargetType?c+=h("SUUNTO_HR","bpm",0):"Power"===b.defaultTargetType?c+=h("SUUNTO_BIKE_POWER","W",0):"Cadence"===b.defaultTargetType&&(c+=h("SUUNTO_CADENCE","",0))),c},k=function(a,b){return"/* Lap "+a+" is step type "+b.type+" with duration type "+b.duration.type+" */\r\n"},l=function(a,b){return"/* Lap "+a+" is step type "+b.type+" with target type "+b.target.type+" */\r\n"},m=function(a,b,c){for(var d="",e=0,f=0;f<a.steps.length;++f){e++;var g=a.steps[f];if("Repeat"===g.type){for(var h=0;h<g.steps.length;++h){for(var i=[],j=[],k=g.steps[h],l=0;l<g.times;++l){var m=e+h+l*g.steps.length;j.push(m),i.push("SUUNTO_LAP_NUMBER == "+m)}d+=b(j.join(", "),k),d+="if ("+i.join(" || ")+") {\r\n",d+=c(k,a),d+="}\r\n\r\n"}e+=g.times*g.steps.length-1}else d+=b(e,g),d+="if (SUUNTO_LAP_NUMBER == "+e+") {\r\n",d+=c(g,a),d+="}\r\n\r\n"}return d},n=function(a,b,c){var d="";return d+="\r\n",d+="    /* Check if we need to alert for out-of-target */\r\n",d+=c?"    if (ONTARGET != "+a+" && ALARMCOUNT == 0 && SUUNTO_LAP_DURATION > 30) {\r\n":"    if (ONTARGET != "+a+" && ALARMCOUNT == 0) {\r\n",d+="      ONTARGET = "+a+";\r\n",d+="      ALARMCOUNT = "+b+";\r\n",d+="    }\r\n"};this.generateDurationApp=function(d){var f=JSON.parse(JSON.stringify(d));f=a.convertPaceToSeconds(f);var g="";return g+=b(f,"Duration"),g+=c(["RESULT"]),g+=m(f,k,e),g+="/* Check if duration is reached */\r\n",g+="if (RESULT < 0) {\r\n",g+="  RESULT = 0;\r\n",f.durationAlarm&&(g+="  /* Alert that duration is reached */\r\n",g+="  Suunto.alarmBeep();\r\n",f.lightAlarm&&(g+="  Suunto.light();\r\n")),g+="}\r\n"},this.generateTargetApp=function(d){var e=d;e=JSON.parse(JSON.stringify(e)),e=a.convertPaceToSeconds(e);var f="",g=["ACTUAL","TO","FROM","FORMATPACE","TARGET","TARGETSEC","TARGETMIN","RESULT"];return e.targetAlarm&&(g.push("ALARMCOUNT"),g.push("ONTARGET")),f+=b(e,"Target"),f+=c(g),f+=m(e,l,j),f+="/* Set target value */\r\n",f+="if (ACTUAL > TO) {\r\n",f+="  TARGET = TO;\r\n",f+="} else if (ACTUAL < FROM) {\r\n",f+="  TARGET = FROM;\r\n",f+="} else {\r\n",f+="  TARGET = ACTUAL;\r\n",f+="}\r\n\r\n",f+="/* Check if result should be formatted as pace and lables reversed */\r\n",f+="if (FORMATPACE == 1) {\r\n",f+="  if (ACTUAL > TO) {\r\n",f+='    prefix ="up";\r\n',e.targetAlarm&&(f+=n(1,2,!0)),f+="  } else if (ACTUAL < FROM) {\r\n",f+='    prefix = "dwn";\r\n',e.targetAlarm&&(f+=n(-1,3,!0)),f+="  } else {\r\n",f+='    prefix = "ok";\r\n',e.targetAlarm&&(f+=n(0,0,!1)),f+="  }\r\n\r\n",f+="  TARGETSEC = Suunto.mod(TARGET, 60);\r\n",f+="  TARGETMIN = (TARGET - TARGETSEC) / 60;\r\n",f+="  RESULT = TARGETMIN + TARGETSEC/100;\r\n",f+="} else {\r\n",f+="  if (ACTUAL > TO) {\r\n",f+='    prefix ="dwn";\r\n',e.targetAlarm&&(f+=n(-1,3,!0)),f+="  } else if (ACTUAL < FROM) {\r\n",f+='    prefix = "up";\r\n',e.targetAlarm&&(f+=n(1,2,!0)),f+="  } else {\r\n",f+='    prefix = "ok";\r\n',e.targetAlarm&&(f+=n(0,0,!1)),f+="  }\r\n\r\n",f+="  RESULT = TARGET;\r\n",f+="}\r\n",e.targetAlarm&&(f+="\r\n",f+="/* Check if alarm is set */\r\n",f+="if (ALARMCOUNT > 0) {\r\n",f+="  ALARMCOUNT = ALARMCOUNT - 1;\r\n",f+="  Suunto.alarmBeep();\r\n",e.lightAlarm&&(f+="  Suunto.light();\r\n"),f+="}\r\n"),f}}]),angular.module("ambitIntervalsApp").filter("generateDurationApp",["codeGeneratorService",function(a){return function(b){if(b)try{return a.generateDurationApp(b)}catch(c){return"Error: "+c.message}}}]),angular.module("ambitIntervalsApp").filter("generateTargetApp",["codeGeneratorService",function(a){return function(b){if(b)try{return a.generateTargetApp(b)}catch(c){return"Error: "+c.message}}}]),angular.module("ambitIntervalsApp").service("intervalFilesService",["localStorageService",function(a){this.getIntervals=function(){for(var b=[],c=a.keys(),d=0;c.length>d;++d)b.push(this.getInterval(c[d]));return b},this.getInterval=function(b){return a.get(b)},this.saveInterval=function(b){a.remove(b.id),a.set(b.id,b)},this.deleteInterval=function(b){a.remove(b.id)}}]),angular.module("ambitIntervalsApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("ambitIntervalsApp").controller("HowtoCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("ambitIntervalsApp").directive("mainmenu",["$location",function(a){return{templateUrl:"views/mainmenu.html",restrict:"E",replace:!0,scope:"@",link:function(b){b.getClass=function(b){return b===a.path()?"active":""}}}}]),angular.module("ambitIntervalsApp").service("preprocessor",function(){function a(a){var c=b.exec(a);if(c&&c.length>1){var d=Number(c[1]),e=Number(c[2]);return(60*d+e).toString()}return a}var b=/(\d\d):(\d\d)/;this.convertPace=a,this.convertPaceToSeconds=function(b){function c(b){("Pace"===b.target.type||"Lap Avg Pace"===b.target.type)&&(b.target.from=a(b.target.from),b.target.to=a(b.target.to)),"Time"===b.duration.type&&(b.duration.value=a(b.duration.value))}function d(a){for(var b=0;b<a.length;++b)"Repeat"===a[b].type?d(a[b].steps):c(a[b])}return d(b.steps),b}}),angular.module("ambitIntervalsApp").controller("FeedbackCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("ambitIntervalsApp").directive("appoutput",function(){var a=function(a){var b=window.getSelection(),c=document.createRange();c.selectNode(a),b.removeAllRanges(),b.addRange(c)};return{restrict:"E",scope:"@",templateUrl:"views/appoutput.html",link:function(b,c){b.showDurationHelp=!1,b.showTargetHelp=!1,b.copyHelpText="MacIntel"===window.navigator.platform?"Now press CMD+C to copy":"Now press Ctrl+C to copy",b.selectDurationApp=function(){b.showDurationHelp=!0,b.showTargetHelp=!1,a(c.find("pre")[0])},b.selectTargetApp=function(){b.showTargetHelp=!0,b.showDurationHelp=!1,a(c.find("pre")[1])}}}}),angular.module("ambitIntervalsApp").directive("dirDisqus",["$window",function(a){return{restrict:"E",scope:{disqus_shortname:"@disqusShortname",disqus_identifier:"@disqusIdentifier",disqus_title:"@disqusTitle",disqus_url:"@disqusUrl",disqus_category_id:"@disqusCategoryId",disqus_disable_mobile:"@disqusDisableMobile",readyToBind:"@"},template:'<div id="disqus_thread"></div><a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>',link:function(b){if("undefined"==typeof b.disqus_identifier||"undefined"==typeof b.disqus_url)throw"Please ensure that the `disqus-identifier` and `disqus-url` attributes are both set.";b.$watch("readyToBind",function(c){if(angular.isDefined(c)||(c="true"),b.$eval(c))if(a.disqus_shortname=b.disqus_shortname,a.disqus_identifier=b.disqus_identifier,a.disqus_title=b.disqus_title,a.disqus_url=b.disqus_url,a.disqus_category_id=b.disqus_category_id,a.disqus_disable_mobile=b.disqus_disable_mobile,a.DISQUS)a.DISQUS.reset({reload:!0,config:function(){this.page.identifier=b.disqus_identifier,this.page.url=b.disqus_url,this.page.title=b.disqus_title}});else{var d=document.createElement("script");d.type="text/javascript",d.async=!0,d.src="//"+b.disqus_shortname+".disqus.com/embed.js",(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(d)}})}}}]),angular.module("ambitIntervalsApp").directive("fileread",[function(){return{scope:{fileread:"="},link:function(a,b){b.bind("change",function(b){var c=new FileReader;c.onload=function(b){a.$apply(function(){a.fileread=b.target.result})},c.readAsText(b.target.files[0],"UTF-8")})}}}]),angular.module("ambitIntervalsApp").service("idgenerator",function(){this.getId=function(){return Math.round(1e16*Math.random(10))+""}}),angular.module("ambitIntervalsApp").service("calculatorservice",["preprocessor",function(a){var b=function(b,c,d){var e=0,f=0,g=300;if("Time"===b.duration.type)e=Number(a.convertPace(b.duration.value)),f="Pace"===b.target.type||"Lap Avg Pace"===b.target.type?e/a.convertPace(b.target.to):e/g;else if("Distance"===b.duration.type)if(f=b.duration.value,"Pace"===b.target.type||"Lap Avg Pace"===b.target.type){var h=a.convertPace(b.target.to);e=h*b.duration.value}else e=f*g;else e=d,f=e/g;return{duration:e*c,distance:f*c}};this.calculateStep=b,this.calculateInterval=function(a){for(var c,d=0,e=0,f=0;f<a.steps.length;++f){var g=a.steps[f];if("Repeat"===g.type)for(var h=0;h<g.steps.length;++h)c=b(g.steps[h],g.times,0),d+=c.distance,e+=c.duration;else c=b(g,1,0),d+=c.distance,e+=c.duration}return{duration:e,distance:d.toFixed(2)}},this.calculateVisualisation=function(a,c){for(var d,e=[],f="0%",g=0;g<a.steps.length;++g){var h=a.steps[g];if("Repeat"===h.type)for(var i=0;i<h.times;++i)for(var j=0;j<h.steps.length;++j)d=b(h.steps[j],1,300),f=d.duration/c.duration*100+"%",e.push({type:h.steps[j].type,inRepeat:"in-repeat",width:f});else d=b(h,1,300),f=d.duration/c.duration*100+"%",e.push({type:h.type,inRepeat:"no-repeat",width:f})}return e}}]),angular.module("ambitIntervalsApp").filter("sectopace",function(){function a(a,b,c){return c=c||"0",a+="",a.length>=b?a:new Array(b-a.length+1).join(c)+a}return function(b){var c=Math.floor(b/3600),d=Math.floor(b/60%60),e=Math.round(b%60);return isNaN(c)||isNaN(d)||isNaN(e)?"--":""+a(c,2,"0")+":"+a(d,2,"0")+":"+a(e,2,"0")}});