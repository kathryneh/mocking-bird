<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Connect Carolina</title>
        <link href="m/css/main.css" rel="stylesheet" type="text/css" charset="utf-8" />
        <link href="m/css/ui-lightness/jquery-ui-1.8.23.custom.css" rel="stylesheet" type="text/css" charset="utf-8" />
        <link href="m/css/tipsy.css" rel="stylesheet" type="text/css" />
        <script src="m/js/lib/jquery-1.7.2.min.js" type="text/javascript"></script>
        <script src="m/js/lib/jquery-ui-1.8.23.custom.min.js" type="text/javascript"></script>
        <script src="m/js/plugin.js" type="text/javascript"></script>
	<script src="m/js/student.js" type="text/javascript"></script>
	<script src="m/js/teacher.js" type="text/javascript"></script>
	<script src="m/js/course.js" type="text/javascript"></script>
	<script src="m/js/courseManager.js" type="text/javascript"></script>
	<script src="m/js/centeredElementManager.js" type="text/javascript"></script>
        <script src="m/js/home.js" type="text/javascript"></script>
    </head>
    <body>
        <header>
            <div id="sidebar_icon" class="sidebar_icon" ></div>
            <span class="user_name">
                Winston Howes
            </span>
            <span class="page_location">Weekly Schedule</span>
            <div class="sidebar_wrapper">
                <div class="Nav_head">
                        Navigation
                </div>
                <div class="Nav_options">
                    <div id="nav_schedule" >View Schedule</div>
                        <div id="nav_search" >Course Search</div>
                        <div id="nav_shopping" >Shopping Cart/Planner</div>
                    </div>
                </div>
        </header>
        <div class="wrapper">
            <div class="search_box">
                    <div class="search_box_content">
                        <table class="search_box_table" cellpadding="2" cellspacing="0">
                                <tr>
                                    <td class="dept_search search_criteria">
                                        <label for="dept">Department: </label>
                                    </td>
                                    <td class="dept_search search_input" >
                                        <input type="text" maxlength="4" id="dept" name="dept">
                                        <span class="Course_department"></span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="course_num_search search_criteria">
                                        <label for="course_num">Course Number: </label>
                                    </td>
                                    <td class="course_num_search search_input" >
                                        <input type="text" maxlength="4" id="course_num" name="course_num">
                                        <span class="course_num_compare">
                                            <div>
                                                <input checked="checked" type="radio" name="course_num_compare" id="equal_to" value="0">
                                                <label for="equal_to">Equal To</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="course_num_compare" id="less_than" value="1">
                                                <label for="less_than">Less Than</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="course_num_compare" id="greater_than" value="2">
                                                <label for="greater_than">Greater Than</label>
                                            </div>
                                        </span>
                                    </td>
                                </tr>
                        </table>
                        <button class="search_btn">Search</button>
                        <div class="search_box_content_extra">
                            MORE STUFF!
                        </div>
                        <div class="search_more" title="Show More Options">
                            + More Options
                        </div>
                    </div>
                    <div class="search_box_footer" title="Hide Search Box">
                        <hr>
                        <hr>
                    </div>
            </div>
	    <span class="search_results"></span>
            <span class="class_schedule">
                <table class="class_schedule_table" cellpadding='0' cellspacing='0' >
                    <?php
                        $days = array('Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'); //The list of content in the first row
                        //Setup the first row
                        echo "<tr><td class='time_row' colspan='8'></td></tr>"; //the row divider html string
                        echo "<tr>";
                        for($i=0; $i<8; $i++){
                            //don't have too thick a border
                            $extra_class = ($i) ? ' day_slot' : '';
                            //add in the top row cells
                            echo "<td class='hour_block_wrapper time_slot$extra_class topcol$i' col=$i >$days[$i]</td>";
                        }
                        echo "</tr>";
                        
                        //Setup all subsequent rows
                        for($i=7; $i<20; $i++){
                            echo "<tr>";
                            //Figure out if we're in the am or pm
                            $time = ($i<11)? 'a.m.' : 'p.m.';
                            //echo the appropriate time
                            echo "<td class='time_slot hour_block_wrapper row_highlight' row='".($i-6)."'>".(($i%12)+1)." $time</td>";
                            //Create of the 7 hour blocks for that time throughout the week
                            for($j=0; $j<7; $j++){
                                echo "<td class='hour_block_wrapper row".($i-6)." col".($j+1)."'>";
                                echo "<table class='hour_block' cellspacing='0' cellpadding='0'>";
                                //Create the smaller 15 minute blocks throughout each hour block
                                for($k=0; $k<4; $k++){
                                        echo "<tr><td class='fifteen_min ";
                                    if($k>0){
                                        echo "fifteen_bar";
                                    }
                                    echo "'></td></tr>";
                                }
                                echo "</table>";
                                echo "</td>";
                            }
                            echo "</tr>";
                        }
                    ?>
                </table>
                <div class="classInfoPopup">
                    <span class="classInfoPopup_border"></span>
                    <span class="classInfoPopup_content"></span>
                </div>
            </span>
        </div>
    </body>
</html>