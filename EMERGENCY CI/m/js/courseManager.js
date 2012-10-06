/* CourseManager
* 
* Models CourseManager
*/

//** An object to manage all classes
var ClassManager=function(){
    //List of all classes in this manager
    this.classList = new Array();
}
    
//** Add a class object
ClassManager.prototype.addCourse = function(classData){
    this.classList[classData.id] = new Course(classData.id, classData.name, classData.credit, classData.prof, classData.title, classData.description, classData.time, classData.length, classData.days);
    //Add the class list to the universal class list
    universalClasslist[universalClasslist_counter] = this.classList[classData.id];
    universalClasslist_counter++;
}
    
//** Get the total number of classes
ClassManager.prototype.getClassLength = function(){
    return this.classList.length;
}