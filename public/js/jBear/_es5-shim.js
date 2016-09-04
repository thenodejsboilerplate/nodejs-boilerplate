  /*
Author:     Frank Lee
File name:    _compatible.js
Description:  Global tools
Dependencies:  ''
Usage:     
*/ 

  /**********************************
  #001
         insert a string of arbitrary HTML markUp 'adjacent'(next) to the specified element

         implementing insertAdjacentHTML() using innerHTML
         insertAdjacentHTML(): insert a string of arbitrary HTML markUp 'adjacent' to the specified element
        e.x. :
        var div = document.createElement('div');
        div.insertAdjacentHTML('beforebegin', '<h2>hello</h2>');

 *********************************/
    /********
        if we have no native insertAdjacentHTML : implement the same four insertion functions and then use them to define insertAdjacentHTML
    ******/
        if(!document.createElement('div').insertAdjacentHTML){
            HTMLElement.prototype.insertAdjacentHTML = function(position,  htmlString){

                   //if you pass a DocumentFragment to appendChild(), insertBefore or replaceChild(), it's the children of the fragment that are inserted into the document, not the fragment itself;           so first define a utility method that takes a string of HTML and returns a DocumentFragment containing the parsed representation of that HTML
                   var this_element = this;
                   function fragment(htmlString){
                        var ele = document.createElement('div');
                        var frag = document.createDocumentFragment();
                        ele.innerHTML = htmlString;

                        //move all nodes from ele to frag
                        while(ele.firstChild)
                           //in appendChild node method, if given child is a reference to an existing node in the document, appendChild moves it from its current position to the new position. so there is no requirement to remove the node from its parent node before appending it to some other node
                        frag.appendChild(ele.firstChild);
                        return frag;
                   }        
                   
                   var insertHTMLString = {
                      beforeOpeningTag: function(this_element,htmlString){
                        this_element.parentNode.insertBefore(fragment(htmlString),this_element);
                      },
                      afterOpeningTag:  function(element,htmlString){
                        this_element.parentNode.insertBefore(fragment(htmlString),this_element.firstChild);
                      },
                      beforeClosingTag:  function(this_element,htmlString){
                        this_element.parentNode.appendChild(fragment(htmlString));
                      },
                      afterClosingTag:  function(element,htmlString){
                        this_element.parentNode.insertBefore(fragment(htmlString),this_element.nextSibling);
                      }                
                   };

                  switch(position.toLowerCase()){
                    case "beforebegin": return insertHTMLString.beforeOpeningTag(this_element, htmlString);
                    case "afterbegin": return insertHTMLString.afterOpeningTag(this_element, htmlString);
                    case "beforeend": return insertHTMLString.beforeClosingTag(this_element, htmlString);
                    case "afterend": return insertHTMLString.beforeClosingTag(this_element, htmlString);

                  }               

            }
        }//end if 






    /**********************************
         outerHMTL property only works on element

         implementing the outerHMTL property(for browsers that don't support it) using innerHMTL
         assumes that browser does support innerHMTL, has an extensible Element.prototype, and allows getter and setters to be defined.
   *********************************/

         // if(!Element.outerHTML){
         //      Object.defineProperty(Element.prototype,'outerHTML',{
         //          value: (function(){
         //              var wrapper = document.createElement('div');
         //              wrapper.appendChild(this.cloneNode(true));
         //              return wrapper.innerHTML;                    
         //          }()),
         //          writable: true,
         //          enumerable: false,
         //          configurable: false
         //      })  
         //  }   


         //  (function(){
            
         //    if(document.createElement('div').outerHTML) return;

         //    function outerHTMLGetter(){
         //      var container = document.createElement('div');
         //      container.appendChild(this.cloneNode(true));
         //      return container.innerHTML;  
         //    }

         //    function outerHTMLSetter(value){
         //           var container = document.createElement('div');
         //           container.innerHTML = value;
         //           while(container.firstChild){
         //            this.parentNode.insertBefore();
         //          }
         //          this.parentNode.removeChild(this);
         //    }


         //    if(Object.defineProperty){
         //      Object.defineProperty(Element.prototype, 'outerHTML',{
         //        get: outerHTMLGetter,
         //        set: outerHTMLSetter,
         //        enumerable:false,
         //        configurable: true
         //      });
         //    }else{
         //      Element.prototype.__defineGetter__('outerHTML', outerHMTLGetter);
         //      Element.prototype.__defineSetter__('outerHTML', outerHMTLSetter);

         //    }
         //  }());  

