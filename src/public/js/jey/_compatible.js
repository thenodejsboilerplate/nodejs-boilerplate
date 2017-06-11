
// Author:     Frank Lee
// File name:    _compatible.js
// Description:  Global tools
// Dependencies:  ''
// Usage:     


var jey = jey || {};

(function(){
  jey.prototype = {

      /**********************************
            browser support addEventListener

            Pay attention:  handlers are invoked with the target as their this value when registered using addEvenntListener() or e.onclick(the like), but attachEvent() are invoked as functions , and their this value is the global (window) object.
      *********************************/
    addEventListener: function(tart,event,func,bool){
        if(tart && event && func){
               if(document.addEventListener){
                  if(bool !== null){
                    tart.addEventListener(event,func,bool);
                  }else{
                    tart.addEventListener(event,func);
                  }
                    
               }else if(Element.attachEvent){
                    //tart.attachEvent('on'+ event, func);
                    tart.attachEvent('on'+ event, function(event){
                      //invoke the handler function as a method of the target, passing on the event object. so that the  this value is the same as addEventListener that refers to the target
                      return func.call(tart, event);
                    });
                    //note: event handlers registers using this method cannot be removed, since the wrapper function passed to attachEvent() is not retained anywhere to be passed to detachEvent()----see p461 in js guide book
               }          
        }

    },


      /**********************************
            browser support removeEventListener
      *********************************/
    removeEventListener: function(tart,event,func,bool){
             if(tart.removeEventListener){
                  tart.removeEventListener(event,func,bool);
             }else{
                   tart.detachEvent('on'+event, func);
             }
    },    

      /**********************************
            textContent for setting plain text into ele element
      *********************************/
    setElementText: function(ele,value){
         var content = ele.textContent;//check if textContent is defined
         if(value === undefined){//no value passed, so return current text

          if(content !== undefined) return content;
          else return ele.innerText;

         }else{//a value is passed, so set text

           if(content !== undefined)  ele.textContent = value;
           else ele.innerText = value;

         }
     },  



    /**********************************
         return the current scrollbar offsets as the x and y properties of an object
   *********************************/
      getScrollOffset:  function(w){
             //use the specified window or the current window if no argument which for ie in which there is no argument when using property handler, for  example: a.onclick...

              w = w || window;

            // this works for all browsers except ie version 8 and before
            if(w.pageXOffset != null){
              return {
                x: w.pageXOffset,
                y: w.pageYOffset
              };
            }


            //for ie(or any modern browser) in Standards mode
            var d = w.document;
            if(document.compatMode == 'CSS1Compat'){//using standard mode, seen at p330
              return {
                x: d.documentElement.scrollLeft,
                y: d.documentElement.scrollTop
              };
            }



            //for browsers in Quicks mode if the value of document.compatMode is BackCompact, or undefined
            if(document.body.scrollTop){
               return {
                x: d.body.scrollLeft,
                y: d.body.scrollTop
              };             
            }



            return {
              x: 0,
              y: 0
            };
           
      },

     /*******
     for addevenlister,not handlers as object property(which use return false),ie and modern browsers P464
     *******/
     cancelDefault: function(e){

         var event = e || window.event;
         if(event.preventDefault){
          event.preventDefault();//standard technique, browsers that support addEventListener()
         }else if(event.returnValue){
           event.returnValue = false;//ie prior to ie9
         }
     },






  };//END OF greatApp.tools 
}
());



