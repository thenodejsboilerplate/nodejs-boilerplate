/*
Author: Frank Lee
File name: tabs.js
Description: Tab switch
             Tabs become invisible under mobile view.
             contentSwitch: display the active tab content body
             tabEvent: tab navigation items click event bind and handler

             ## HTML structure example ##
 			 
			 <div class="outerContainer">
                 <h2>our trait:</h2>
			     <p><img src="arrow_down.png"></p>
             </div>
   
             <div class="tabs_wrap">
                <div class="tabs_switch">
                    <div class="tab_options">
                        <ul class="options">
                            <li data-tab="interior" class="active">
                                <a href="#">Interior</a>
                            </li>
                            <li data-tab="exterior">
                                <a href="#">Exterior</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="tabs_content">
                    <div data-tab="interior" class="tab_content active">...</div>
                    <div data-tab="exterior" class="tab_content">...</div>
                </div>
            </div>

Dependencies: jQuery
CSS Required:
        .outerContainer{text-align:center;}//not required but better have it
		.tabs_content .tab_content{display:none;}
		.tabs_content .active{display:inline-block;}
		.options .active{color:orange}
        .tabs_wrap.open {display:block;}
		
        @media only screen and (max-width:768px){
          .tabs_wrap {display:none;}
        }
*/
(function($){
     tabSwitch = {
	    init: function(){
		     if(!$('.tabs_switch').length){return;}
			 var container = $('.tabs_wrap');
			 var options = $('.options',container);
			 var currentTab = $('.active',options);
			 var contentContainer = $('.tabs_content',container);
			 var tabContents = $('.tab_content',contentContainer);
             var currentContent  = $('.tab_content.acitve',tabContents);			 
			 
			 tabSwitch.contentSwitch(currentTab,contentContainer);
			 tabSwitch.tabEvent(options);
			 tabSwitch.tabsContainerShow(container,options,contentContainer);
		},
		
		contentSwitch: function(currentTab,contentContainer){
		     var currentCategory = currentTab.data('tab');
		     var tabContent = $('.tab_content[data-tab ="'+ currentCategory + '"]',contentContainer);
			 
			 tabContent.siblings().removeClass('active');
			 tabContent.addClass('active');
		},		
		
		tabEvent: function(options){
		     var tabItems = $('li',options);
			 tabItems.click(function(e){
			        e.preventDefault();
			        var self = $(this);
					
					tabItems.removeClass('active');
					self.addClass('active');
					tabSwitch.contentSwitch(self);
			 });
			 
			
		     
		},
		
	    tabsContainerShow: function(container,options,contentContainer){ // Tabs become invisible under mobile view.
		   $(function(){
			  
			  window.onresize = function(){
			    if(window.innerWidth <961){
				  container.hide();
				  contentContainer.hide();
				  $('li',options).removeClass('active');

			     }else{
				  container.show();
                 }				  
				  
				  
			  };

              			  
		   });
		   
		   $('.outerContainer').click(function(e){
			    e.preventDefault();
                 container.toggle();	
                
            }); 
			
		   $('li',options).click(function(e){
				   e.preventDefault();
				   
				    
					contentContainer.show();
					  
		
				
			});	
			

		
		
		}

		

	 };
	 
	 tabSwitch.init();
})(jQuery);