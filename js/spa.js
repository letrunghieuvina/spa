'use strict'
/**
 * Created by hieule on 10/5/16.
 */
var spa = (function () {
   var initModule = function($container) {
       spa.shell.initModule($container);
   } ;
   return {
       initModule: initModule
   };
}());