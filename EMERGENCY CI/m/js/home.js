/* Handles user interaction on the home page
  Created By Winston Howes
*/

var universalClasslist = new Array(); //Keep a list of every class involved with the page
var universalClasslist_counter = 0; //Keep track of the size of the universal class list

$(function(){
    
    //Hide the extra search parameters
    $('.search_box_content_extra').hide();
    var student = new Student("Winston", "Howes", "720056338", "CS", "winhowes@live.unc.edu");
    var center = new CenteredElementManager;  //Keep a reference to the centered element manager
    var mycourses = student.courses; //Keep a reference to the user's class manager
    var searched_courses = new ClassManager; //Keep a reference to the searched classes' class manager
    var animspeed = 1000; //a common animation speed (1 second)
    
    //Center the search box
    center.centerElement($('.search_box'), 'left');
    
    //Center the class schedule
    center.centerElement($('.class_schedule'), 'left');
    
    //Hide the popup
    $('.classInfoPopup').css('display', 'block').hide();
    
    //Hide the search results
    $('.search_results').css({
	'display' : 'block',
	'overflow' : 'auto',
	'max-height' : ($(window).innerHeight()-85)+'px'
    }).hide();
    
    //Scroll to the top to initialize the page
    $(window).scrollTop(0);
    
    //Get the user's courses
    $.ajax({
        url: 'index.php/home/getClasses',
        type: 'GET',
        data: {
        },
        success: function(data,textStatus,jqXHR) {
            //Successful
            if(data.status[0].code==0){
                //Add the courses and push them to the calender
                for(var i=0; i<data.classes.length; i++){
                    mycourses.addCourse(data.classes[i]);
		    student.hours+=data.classes[i].hours;
		    mycourses.classList[data.classes[i].id].calenderClass();
                }
                //Center the class schedule
                center.centerElement($('.class_schedule'), 'left');
            }
            //Handle error
            else{
                
            }
        },
        error: function(jqXHR,textStatus,errorThrown) {
           //Handle Error
	}
    });
    
    $('.search_btn').click(function(){
	//Show the search results and clear its inner html
	$('.search_results').show().html("Loading...");
	
	//Get the user's courses
	$.ajax({
	    url: 'index.php/home/searchClasses',
	    type: 'GET',
	    data: {
	    },
	    success: function(data,textStatus,jqXHR) {
		//Successful
		if(data.status[0].code==0){
		    //Add the courses to the search results and table them in the search results
		    var temp_elem = $("<div></div>");
		    for(var i=0; i<data.classes.length; i++){
			searched_courses.addCourse(data.classes[i]);
			searched_courses.classList[data.classes[i].id].tableClass(temp_elem);
		    }
		    $('.search_results').html(temp_elem.children()).prepend("<div class='search_results_title'>Search Results:</div>");
		}
		//Handle error
		else{
		    
		}
	    },
	    error: function(jqXHR,textStatus,errorThrown) {
	       //Handle Error
	    }
	});
    });
    
    //Setup the tooltip for the searchbox footer
    tooltip($('.search_box_footer'), 'n');
    
    //Setup the the sidebar_icon and the sidebar sliding
    $('.sidebar_icon').data({
        'open' : false,
        'unclicked' : true
    }).click(function(){
        //Get a reference for the $(this)
        var sidebar_icon = $(this);
        // don't let the click work until the animation is complete
        if(sidebar_icon.data('unclicked')){
            sidebar_icon.data('unclicked', false);
            //determine the direction of the animation
            var direction = (sidebar_icon.data('open'))? "-=" : "+=";
            //animate the sidebar and main content appropriately
            $('.sidebar_wrapper, .wrapper, .search_box').animate({
                'left' : direction+$('.sidebar_wrapper').outerWidth()
            }, animspeed/2, function(){
                //animation complete, let them click again
                sidebar_icon.data('unclicked', true);
            });
            //Switch the sidebar open/close state
            sidebar_icon.data('open', !sidebar_icon.data('open'));
        }
    });
    
    //Close the sidebar if they click in the main content area
    $('.wrapper').click(function(){
        //Only slide the sidebar if it's open
        if($('.sidebar_icon').data('open')){
            $('.sidebar_icon').trigger('click');
        }
    });
    
    //Setup the open and closing of the search bar
    $('.search_box_footer').data({
            'open' : false,
            'unclicked' : true
    }).click(function(){
        //Get a reference for the $(this)
        var searchbox_footer = $(this);
        // don't let the click work until the animation is complete
        if(searchbox_footer.data('unclicked')){
            searchbox_footer.data('unclicked', false);
            //Trigger the mouseleave event
            searchbox_footer.trigger('mouseleave');
            //determine the direction of the animation
            var direction = (searchbox_footer.data('open'))? "+=" : "-=";
            //animate the search box and main content appropriately
            $('.search_box').animate({
                'top' : direction+($('.search_box_content').outerHeight()+$('.search_more').outerHeight())
            }, animspeed/2, function(){
                //animation complete, let them click again
                searchbox_footer.data('unclicked', true);
            });
            //Change the title attribute
            if(direction == "+="){
                searchbox_footer.attr('title', 'Hide Search Box');
            }
            else{
                searchbox_footer.attr('title', 'Show Search Box');
            }
            //Switch the search box open/close state
            searchbox_footer.data('open', !searchbox_footer.data('open'));
        }
    });
    
    //Setup the search by more options open/close functinality
    $('.search_more').data({
        'open': false,
        'unclicked' : true
    }).click(function(){
        //Get a reference for the $(this)
        var search_more = $(this);
        
        //** Reallow the user to click this feature again
        var allow_click = function(){
            //animation complete, let them click again
            search_more.data('unclicked', true);
        }
        
        // don't let the click work until the animation is complete
        if(search_more.data('unclicked')){
            search_more.data('unclicked', false);
            //trigger the mouse leave event
            search_more.trigger('mouseleave');
            //determine the direction of the animation
            var show = (search_more.data('open'))? false : true;
            //show more options by sliding them open
            if(show){
                $('.search_box_content_extra').show('slide', {direction: 'up'}, animspeed/2, allow_click);
            }
            else{
                 $('.search_box_content_extra').hide('slide', {direction: 'up'}, animspeed/2, allow_click);
            }
            //Change the title attribute and internal text
            if(show){
                search_more.attr('title', 'Show Less Options');
                search_more.text('- Less Options');
            }
            else{
                search_more.attr('title', 'Show More Options');
                search_more.text('+ More Options');
            }
            //Switch the search more open/close state
            search_more.data('open', !search_more.data('open'));
        }
    });
    //Add the search more tooltip
    tooltip($('.search_more'), 'e');
    
    //Highlight everything in a row in the class schedule
    $('.time_slot').hover(function(){
        //Make sure the time slot entered was an actual time
        if($(this).hasClass('row_highlight')){
            //Highlight the row
            $('.row'+$(this).attr('row')).css({
                'background-color' : '#FFF9D7'
            });
        }
    }, function(){
        //Make sure the time slot left was an actual time
        if($(this).hasClass('row_highlight')){
            //Return the row background color to what it was
            $('.row'+$(this).attr('row')).css({
                'background-color' : '#FFFFFF'
            });
        }
    });
    
    //Highlight everything in a column in the class schedule
    $('.time_slot').hover(function(){
        //Highlight the column
        $('.col'+$(this).attr('col')).css({
            'background-color' : '#FFF9D7'
        });
    }, function(){
        //Return the column background color to what it was
        $('.col'+$(this).attr('col')).css({
            'background-color' : '#FFFFFF'
        });
    });
    
    //Setup the more course information expansion
    $('.classBlockExpandImg').live({
	mouseenter: function(){
            //get a reference to the class block
            var class_block = $(this).parent().parent();
            //Get a reference to the class
            var class_id = class_block.attr('class_id');
            var class_ref = mycourses.classList[class_id];
            //remove the old active class if it hasnt been removed
            $('.activeClassBlock').removeClass('activeClassBlock');
            //Add a class signaling this is the block being looking at
            class_block.addClass('activeClassBlock');
            //establish that it is moused over
            class_block.data('mouseover', true);
            //Show the popup and position it and establish that this is not moused over
	    $('.classInfoPopup').data('mouseover', false).css({
                'left' : class_block.position().left-($('.classInfoPopup').outerWidth()/2 - class_block.outerWidth()/2),
                'top' : 10+class_block.position().top+class_block.outerHeight()
            }).stop(true, true).show();
            //Add in the popup's content
            $('.classInfoPopup_content').html(class_ref.length+" minutes<br>"+class_ref.prof);
            //Adjust the css
            $(this).css({
                'opacity' : 1
            });
        },
        mouseleave: function(){
            //trigger the close popup
            classBlockpopup($(this).parent().parent());
        }
    });
    
    $('.classInfoPopup').hover(function(){
        //set its mouseover state to true
        $(this).data('mouseover', true);
    }, function(){
        //trigger the close popup
        classBlockpopup($(this));
    });
});

//** Expands the column given and the columns to the left of it, colnum: the column number to start on
var expandColumn = function(colnum){
    var block_width = 152; //width to expand the columns to
    var column; //reference to the column
    for(var i=colnum; i>0; i--){
	column = $('.col'+i);
	//Only adjust the width if it has not previously been adjusted
	if(column.width()<152){
	    column.width(block_width);
	}
    }
}

//** Adds a styled tooltip to an element, [direction]: the gravity of the tooltip [n/ne/nw/se/s/sw/e/w] defaults to s
var tooltip = function(element, direction){
    //default direction to s
    if(direction == null){
	direction = 's';
    }
    //Add the tooltip to the element
    element.tipsy({gravity : direction, delayIn : 500});
}

//** hide the class info popup if the mouse is not over the class info popup or the arrow, element: the element who had the mouse leave
var classBlockpopup = function(element){
    //get a reference to the active class block
    var class_block = $('.activeClassBlock');
    //establish that it is not moused over
    element.data('mouseover', false);
    //if after 300 miliseconds the mouse is not over either the popup or the arrow after having left one of them, hide the popup
    window.setTimeout(function(){
        if(!$('.classInfoPopup').data('mouseover')&&!class_block.data('mouseover')){
            //Hide the popup
            $('.classInfoPopup').fadeOut(200);
            //Readjust the css
            class_block.find('.classBlockExpandImg').css({
                'opacity' : .3
            });
        }
    }, 200);
}