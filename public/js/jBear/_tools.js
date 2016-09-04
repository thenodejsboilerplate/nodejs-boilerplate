  /*
Author:     Frank Lee
File name:    tools.js
Description:  Global tools
Dependencies:   jQuery || ''
Usage:     
        
        // get object length - param: object
        greatApp.tools.getObjectLength(obj);

        // check if object is empty - param: object
        greatApp.tools.isEmpty(obj);

        // check if browser currently used is IE, returns boolean - param: IE version, comparison
        // is it IE8?
        greatApp.tools.isIE(8);

        // is it less than or equal to IE 6?
        greatApp.tools.isIE(7, 'lte');

        // check if iOS browser, returns true if iOS
        Example: greatApp.tools.isIOS()?true:false;
        greatApp.tools.isIOS();

*/

var greatApp = jBear || {};

(function(){
  jBear.prototype = {


    /**********************************
         work for any js value
         Obtain the class of any object you pass it: many object inherit other, more useful toString methods, and to invoke the correct version of toString(), we must do so indirectedly , using the function.call() method 
    *********************************/
    classOf: function(obj){
       if(obj === null) return "null";
       if(obj === undefined) return "undefined";
       return Object.prototype.toString.call(obj).slice(8,-1);
    },


    /**********************************
         get the number of the own properties of an object
    *********************************/
    getObjectLength: function(obj) {
      var getLength = 0;
      for(var prop in obj) {
        (obj.hasOwnProperty(prop)) ? getLength++ : getLength;
      }
      return getLength;
    },

    isEmpty: function(obj) {
      for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
          return false;
      }
      return true;
    },
    
    isIE: function(version, comparison) {
      var cc = 'IE',
        b = document.createElement('B'),
        docElem = document.documentElement,
        isIE;

      if(version){
        cc += ' ' + version;
        if(comparison){ cc = comparison + ' ' + cc; }
      }

      b.innerHTML = '<!--[if '+ cc +']><b id="iecctest"></b><![endif]-->';
      docElem.appendChild(b);
      isIE = !!document.getElementById('iecctest');
      docElem.removeChild(b);
      return isIE;
    },

    isIOS: function(){
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },

    isTouchDevice: function() {
        if (/iPhone|iPad|iPod/.test(navigator.platform) || 
           (Modernizr !== undefined && Modernizr.touch)) {
          return true;
        }
        return false;
     },



    /**
    * Removes all occurence of specified item from array: returns a new array except removed items
    * @param arr Array
    * @param itemToRemove Item to remove from array
    * @returns a new array except removed items: itemToRemove(may several)
    *ECMAScript 2015 way (if your browser support modern JavaScript or you use Babel.js):
       let value = 3;

        let arr = [1, 2, 3, 4, 5, 3];

        arr = arr.filter(item => item !== value);

        console.log(arr); 
        // [ 1, 2, 4, 5 ]
    */
     removeArrayItem: function (arr, itemToRemove) {
        var filteredArray = arr.filter(function(item){
            return item !== itemToRemove;
        });

        return filteredArray;
    },


    /**
     * 
     * lazily loads an image. Requires the following setup
     * <div data-src="image url" data-alt=" optional name" class="thumb-lazy" >&nbsp;</div>
     * An image tag is created and injected into the div.
     * 
     */
    lazyLoadImage: function(selector) {
      var ele = $_qsl( selector ? selector : 'div.thumb-lazy' );
      Array.prototype.forEach.call(ele,lazyLoad);
      function lazyLoad(val) {
          
          var src = this.getAttribute('data-src');
          var img = new Image();
        
        // call this function after it's loaded
        img.onload = function() {
          // make wrapper fully visible
          this.innerHMTL(img);
          img.alt = this.getAttribute('data-alt');
        };
        // begin loading the image from www.flickr.com
        img.src = src;
        
      };
    },


     /**********************************
         asynchronously load and execute a script from a specified url
    *********************************/
    loadasync: function(url){
      var head = $_tag('head')[0];
      var s = document.createElement('script');
      s.src = url;
      head.appendChild(s);
    },


    /****************
        get Element Positon in document coordinate
    *****************/

    getEleDocPos: function(ele){
        //all html elements have offsetLeft and offsetTop properties that return the x and y coordinates fo the element. but for descendants of positioned ele...p394 in definite guide
      var x = 0, y=0;
      while(ele != null){
        x += ele.offsetLeft;
        y += ele.offsetTop;

        ele = ele.offsetParent;
      }

      return {x:x, y:y};


    },





























  };//END OF greatApp.tools 
}
());



