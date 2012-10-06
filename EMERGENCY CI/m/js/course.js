/* Course
* 
* Models course
*/

//An object for each course
var Course=function(id, name, credit, prof, title, description, time, length, days){
    this.id = id;
    this.name = name;
    this.credit = credit;
    this.prof = prof;
    this.title = title;
    this.description = description;
    this.time = time;
    this.length = length;
    this.days = days;
    this.calendered = false; //Note that the class does not yet exist in the calender
}

//** Return a string of the course time
Course.prototype.getTime = function(){
    //Make a reference to the class object
    var class_ref = this;
    //get the hour part of the time
    var first_time = Number(String(class_ref.time).slice(0, 2));
    //Construct the first time
    var time_string = ((first_time-1)%12+1)+":"+String(class_ref.time).slice(2)+" ";
    //Figure out if the time is am or pm
    time_string+= (first_time<12)? "a.m.": "p.m.";
    //Add the minutes of the class start time to its length
    var second_time = Number(String(class_ref.time).slice(2)) + class_ref.length;
    //if the remaining minutes are less than 10 add a 0 in front
    var third_time = (String(second_time%60).length<2) ? "0"+(second_time%60) : second_time%60;
    //Construct the class ending time and concat it with the starting time
    time_string+= " - "+((first_time+Math.floor(second_time/60)-1)%12+1)+":"+third_time+" ";
    //figure out if the end time is am or pm
    time_string+= (first_time+Math.floor(second_time/60)<12)? "a.m.": "p.m.";
    //return the time string
    return time_string;
}

//** Add a class to the calender
Course.prototype.calenderClass = function(){
    //get a reference to the course
    var class_ref = this;
    //Make sure the course doesn't already exist in the calender
    var conflict_num = this.courseConflict();
    if(!class_ref.calendered&&conflict_num!=2){
	//Mark this course as being calendered
	class_ref.calendered = true;
	//get a reference to the course id
	var id = class_ref.id;
	//Add a block for each day that the class is on
	for(var i=0; i<class_ref.days.length; i++){
	    var day = class_ref.days.slice(i, i+1); //the day of the class
	    var column = 'mtwrfsu'.indexOf(day)+1; //Keep track of which column to manipulate
	    var row = Number(String(class_ref.time).slice(0, 2))-7; //Figure out what row we're on
	    //Increase the column width and adjust the left position
	    expandColumn(column);
	    var left=$('.topcol'+column).position().left-1; //the left position for the class block
	    //create the basic block
	    var classBlock = $('<div class="classBlock classBlock'+id+'" id="classBlock'+id+day+'" class_id="'+id+'" >'+class_ref.name+' <div class="class_time">'+class_ref.getTime()+'</div><div class="classBlockExpand"><img class="classBlockExpandImg" class_id="'+id+'" src="m/img/down_arrow.png"></div></div>');
	    //Determine the block height
	    var height = class_ref.length+Math.round(class_ref.length/15)-1+Math.floor((Number(String(class_ref.time).slice(2))+class_ref.length)/60);
	    //Determine the top position of each element
	    var class_top = $('.row'+row).position().top+Math.round(Number(String(class_ref.time).slice(2)));
	    //Set up the class block's css
	    classBlock.css({
		'height' : height,
		'top' : class_top,
		'left' : left,
		'line-height' : (height/3)+'px'
	    });
	    //If there is a course conflict, highlight it in red
	    if(conflict_num){
		classBlock.css({
		    'background-color' : '#FF6947'
		});
	    }
	    //Append the class block
	    $('.class_schedule').append(classBlock);
	}
    }
}

//** Remove a class from the calender
Course.prototype.uncalenderClass = function(){
    //Remove the block
    $('.classBlock'+this.id).remove();
    //Mark the class as uncalendered
    this.calendered = false;
}

//** Style the course as it would appear in a table and return it, binding_element: the element to append the tabled class to
Course.prototype.tableClass = function(binding_element){
    //get a reference to this
    var self = this;
    
    //layout the class block
    var class_block = $('<div class="course_table_block" title="'+this.description+'">\
			<span class="course_table_title">'+String(this.name).toLocaleUpperCase()+' - '+this.title+'</span>\
			<div class="course_table_prof">by '+this.prof+'</div>\
			<div class="course_table_time">'+this.getTime()+' ('+this.days+')</div>\
			</div>');
    
    //Add a tooltip
    tooltip(class_block, 'e');
    
    //store a reference to the course object the class block's data
    class_block.data('course_object', self)
    //Calender the class on click
    .click(function(){
	if(self.calendered){
	    self.uncalenderClass();
	}
	else{
	    self.calenderClass();
	}
    });
    
    //Append the class block to the binding element
    binding_element.append(class_block);
}

//** Check that course does not conflict with any other calendered course, returns 0 for no conflict, 1 for conflict, 2 for same course
Course.prototype.courseConflict = function(){
    for(var i=0; i<universalClasslist_counter; i++){
	//Check to see if the course is even calendered
	if(universalClasslist[i].calendered){
	    if(universalClasslist[i].id==this.id){
		return 2;
	    }
	    //Check to see if the classes are on the same day
	    var day_collide = false;
	    for(var j=0; j<String(this.days).length; j++){
		if(universalClasslist[i].days.search(String(this.days).charAt(i))>-1){
		    day_collide = true;
		    break;
		}
	    }
	    if(day_collide){ //The courses are on the same day
		if(Number(universalClasslist[i].time)<=Number(this.time)
		   &&Number(this.time)<=(Number(universalClasslist[i].time)+Number(universalClasslist[i].length))){
		    return 1;
		}
		if(Number(Number(this.time)<=universalClasslist[i].time)
		   &&Number(universalClasslist[i].time)<=(Number(this.time)+Number(this.length))){
		    return 1;
		}
	    }
	}
    }
    return 0;
}