  /*
Author:     Frank Lee
File name:    _inputFilter.js
Description:  utility for filtering all input field
Dependencies:   none
Usage:    


           Zipcode: <input type="text" data-allowed-chars="1234567890" data-messageid="zipwarn">
          <span id="zipwarn" style="visibility:hidden;">Digits Only</span>

           Number: <input type="number" data-allowed-chars="1234567890" data-messageid="numberwarn">
          <span id="numberwarn" style="visibility:hidden;">Number Only</span>  

           password: <input type="password" data-allowed-chars="abcdefg" data-messageid="pwwarn">
          <span id="pwwarn" style="visibility:hidden;">a-f Only</span> 

*/
(function(){
	var inputEles = document.getElementsByTagName('input');
  if(inputEles){
      for(var i=0;i<inputEles.length;i++){
        var ele = inputEles[i];
        //skip those not text fields or donot have a data-allowed-chars attribute
        //if(ele.type != 'text' || !ele.getAttribute('data-allowed-chars') ) continue;
            if(!ele.getAttribute('data-allowed-chars') ) continue;

        //register a event handler function on this input element, keypress is a legacy event handler
            //textInput is supported by safaari and chrome in 2010;  textinput is the version in the dom level 3 events draft;
            greatApp.compatible.addEventListener(ele, 'keypress', filterInput, false);


            //textinput not supported versions of ie w/o addEventListener
            if(ele.addEventListener){

              ele.addEventListener('textInput',filterInput,false);
              ele.addEventListener('textinput',filterInput,false);

            }
      }

      //keypress and textInput handler that filters the user's input
      function filterInput(event){
        //get the event object and the target element target

        //standard or ie model
             var e = event || window.event;
             var target = e.target || e.srcElement;
             var text = null;

             //get the character or text that was entered
             if(e.type === 'textInput' || e.type === 'textinput') text = e.data;

             else{//legacy keypress event
             // firefox uses charCode for printable key press events; most browser use keycode
               var code = e.charCode || e.keyCode;

               //if this keystroke is a function key of any kind, do not filter it
               if(code <32 || e.charCode == 0 || e.ctrlKey || e.altKey) return;


                //convert character code into a string
               text = String.fromCharCode(code);

             }//end of else



             //now look up information we need from this input element
             var allowed = target.getAttribute('data-allowed-chars');
             var messageid = target.getAttribute('data-messageid');
             //console.log(messageid);

             if(messageid){ //if any message id, get the element
              var messageElement = document.getElementById(messageid);

                //console.log(messageElement.innerHTML);
             }//end of if(messageid)
      


            //loop through the characters of the input text
            for(var i = 0 ; i<text.length; i++){
              var c = text.charAt(i);
              if(allowed.indexOf(c) == -1){


                    if(messageElement){

                       // console.log('hi');
                        messageElement.style.visibility = 'visible';

                    }
                

                    //cancel the default action so the text isn't inserted
                    if(e.preventDefault) e.preventDefault();
                    if(e.returnValue) e.returnValue = false;

                    return false;

              }
            }//end of for



            if(messageElement){
                messageElement.style.visibility = 'hidden';
            }
      } 
  }

}());