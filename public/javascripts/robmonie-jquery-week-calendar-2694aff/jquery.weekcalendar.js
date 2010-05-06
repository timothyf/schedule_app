/*
 *
 * Requires:
 * - jquery.weekcalendar.css
 * - jquery 1.3.x
 * - jquery-ui 1.7.x (widget, drag, drop, resize)
 *
 */

var employees =  [
	   {"id":11111, "name": "John Smith"},
	   {"id":22222, "name": "Mike Jones"},
	   {"id":33333, "name": "Steve Rogers"},
	   {"id":44444, "name": "Bruce Banner"},
	   {"id":55555, "name": "Peter Parker"},
	   {"id":66666, "name": "Sue Storm"},
	   {"id":77777, "name": "Tony Stark"},
	   {"id":88888, "name": "David Gray"},
	   {"id":99999, "name": "Luke Skywalker"},
	   {"id":10101, "name": "James Kirk"},
	];

(function($) {

   $.widget("ui.weekCalendar", {

       options : {
         date: new Date(),
         timeFormat : "h:i a",
         dateFormat : "M d, Y",
         alwaysDisplayTimeMinutes: true,
         use24Hour : false,
         daysToShow : 10,
         firstDayOfWeek : 0, // 0 = Sunday, 1 = Monday, 2 = Tuesday, ... , 6 = Saturday
         timeSeparator : " to ",
         startParam : "start",
         endParam : "end",
         businessHours : {start: 8, end: 18, limitDisplay : false},
         newShiftText : "New Shift",
         timeslotHeight: 20,
         defaultShiftLength : 2,
         timeslotsPerHour : 4,
         buttons : true,
         buttonText : {
            prevEmployees : "&nbsp;&lt;&nbsp;",
            nextEmployees : "&nbsp;&gt;&nbsp;"
         },
         scrollToHourMillis : 500,
         allowShiftOverlap : false,
         overlapShiftsSeparate: false,
         readonly: false,
         draggable : function(shift, element) {
            return true;
         },
         resizable : function(shift, element) {
            return true;
         },
         shiftClick : function() {
         },
         shiftRender : function(shift, element) {
            return element;
         },
         shiftAfterRender : function(shift, element) {
            return element;
         },
         shiftDrag : function(shift, element) {
         },
         shiftDrop : function(shift, element) {
         },
         shiftResize : function(shift, element) {
         },
         shiftNew : function(shift, element) {
         },
         shiftMouseover : function(shift, $shift) {
         },
         shiftMouseout : function(shift, $shift) {
         },
         calendarBeforeLoad : function(calendar) {
         },
         calendarAfterLoad : function(calendar) {
         },
         noShifts : function() {
         },
         shortMonths : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
         longMonths : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
         shortDays : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
         //longDays : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		 longDays : ['John Smith', 'Paul Jones', 'Steve Night', 'Bill Rogers', 'Joe Bloe', 'Jack Morris', 'Bill Bright']
      },

      /***********************
       * Initialise calendar *
       ***********************/
      _create : function() {
         var self = this;
         self._computeOptions();
         self._setupEventDelegation();
         self._renderCalendar();
         self._loadShifts();
         self._resizeCalendar();
         self._scrollToHour(self.options.date.getHours());
         $(window).unbind("resize.weekcalendar");
         $(window).bind("resize.weekcalendar", function() {
            self._resizeCalendar();
         });
      },


      /********************
       * public functions *
       ********************/
      /*
       * Refresh the shifts for the currently displayed week.
       */
      refresh : function() {
         this._loadShifts(this.element.data("startDate")); //reload with existing week
      },

      /*
       * Clear all shifts currently loaded into the calendar
       */
      clear : function() {
         this._clearCalendar();
      },

      /*
       * Go to this week
       */
      today : function() {
         this._clearCalendar();
         this._loadShifts(new Date());
      },

      /*
       * Go to the previous week relative to the currently displayed week
       */
      prevEmployees : function() {
         //minus more than 1 day to be sure we're in previous week - account for daylight savings or other anomolies
         var newDate = new Date(this.element.data("startDate").getTime() - (MILLIS_IN_WEEK / 6));
         this._clearCalendar();
         this._loadShifts(newDate);
      },

      /*
       * Go to the next week relative to the currently displayed week
       */
      nextEmployees : function() {
         //add 8 days to be sure of being in prev week - allows for daylight savings or other anomolies
         var newDate = new Date(this.element.data("startDate").getTime() + MILLIS_IN_WEEK + (MILLIS_IN_WEEK / 7));
         this._clearCalendar();
         this._loadShifts(newDate);
      },

      /*
       * Remove an shift based on it's id
       */
      removeShift : function(shiftId) {
         var self = this;
         self.element.find(".wc-shift").each(function() {
            if ($(this).data("shift").id === shiftId) {
               $(this).remove();
               return false;
            }
         });
         //this could be more efficient rather than running on all days regardless...
         self.element.find(".wc-employee-column-inner").each(function() {
            self._adjustOverlappingShifts($(this));
         });
      },

      /*
       * Removes any shifts that have been added but not yet saved (have no id).
       * This is useful to call after adding a freshly saved new shift.
       */
      removeUnsavedShifts : function() {
         var self = this;
         self.element.find(".wc-new-shift").each(function() {
            $(this).remove();
         });
         //this could be more efficient rather than running on all days regardless...
         self.element.find(".wc-employee-column-inner").each(function() {
            self._adjustOverlappingShifts($(this));
         });
      },

      /*
       * update a shift in the calendar. If the shift exists it refreshes
       * it's rendering. If it's a new shift that does not exist in the calendar
       * it will be added.
       */
      updateShift : function (shift) {
         this._updateShiftInCalendar(shift);
      },

      /*
       * Returns an array of timeslot start and end times based on
       * the configured grid of the calendar. Returns in both date and
       * formatted time based on the 'timeFormat' config option.
       */
      getTimeslotTimes : function(date) {
         var options = this.options;
         var firstHourDisplayed = options.businessHours.limitDisplay ? options.businessHours.start : 0;
         var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), firstHourDisplayed);
         var times = []
         var startMillis = startDate.getTime();
         for (var i = 0; i < options.timeslotsPerDay; i++) {
            var endMillis = startMillis + options.millisPerTimeslot;
            times[i] = {
               start: new Date(startMillis),
               startFormatted: this._formatDate(new Date(startMillis), options.timeFormat),
               end: new Date(endMillis),
               endFormatted: this._formatDate(new Date(endMillis), options.timeFormat)
            };
            startMillis = endMillis;
         }
         return times;
      },

      formatDate : function(date, format) {
         if (format) {
            return this._formatDate(date, format);
         } 
		 else {
            return this._formatDate(date, this.options.dateFormat);
         }
      },

      formatTime : function(date, format) {
         if (format) {
            return this._formatDate(date, format);
         } 
		 else {
            return this._formatDate(date, this.options.timeFormat);
         }
      },

/*
      getData : function(key) {
         return this._getData(key);
      },
      */

      /*********************
       * private functions *
       *********************/

      _setOption: function(key, value) {
         var self = this;
         if(self.options[key] != value) {

            // this could be made more efficient at some stage by caching the
            // shifts array locally in a store but this should be done in conjunction
            // with a proper binding model.

            var currentShifts = $.map(self.element.find(".wc-shift"), function() {
               return $(this).data("shift");
            });
            var newOptions = {};
            newOptions[key] = value;
            self._renderShifts({shifts:currentShifts, options: newOptions}, self.element.find(".wc-employee-column-inner"))
        }
	   },
      

      // compute dynamic options based on other config values
      _computeOptions : function() {
         var options = this.options;
         if (options.businessHours.limitDisplay) {
            options.timeslotsPerDay = options.timeslotsPerHour * (options.businessHours.end - options.businessHours.start);
            options.millisToDisplay = (options.businessHours.end - options.businessHours.start) * 60 * 60 * 1000;
            options.millisPerTimeslot = options.millisToDisplay / options.timeslotsPerDay;
         } 
		 else {
            options.timeslotsPerDay = options.timeslotsPerHour * 24;
            options.millisToDisplay = MILLIS_IN_DAY;
            options.millisPerTimeslot = MILLIS_IN_DAY / options.timeslotsPerDay;
         }
      },

      /*
       * Resize the calendar scrollable height based on the provided function in options.
       */
      _resizeCalendar : function () {
         var options = this.options;
         if (options && $.isFunction(options.height)) {
            var calendarHeight = options.height(this.element);
            var headerHeight = this.element.find(".wc-header").outerHeight();
            var navHeight = this.element.find(".wc-nav").outerHeight();
            this.element.find(".wc-scrollable-grid").height(calendarHeight - navHeight - headerHeight);
         }
      },

      /*
       * configure calendar interaction events that are able to use event
       * delegation for greater efficiency
       */
      _setupEventDelegation : function() {
         var self = this;
         var options = this.options;
         this.element.click(function(event) {
            var $target = $(event.target);
            if ($target.data("preventClick")) {
               return;
            }
            if ($target.hasClass("wc-shift")) {
               options.shiftClick($target.data("shift"), $target, event);
            } 
			else if ($target.parent().hasClass("wc-shift")) {
               options.shiftClick($target.parent().data("shift"), $target.parent(), event);
            }
         }).mouseover(function(event) {
            var $target = $(event.target);

            if (self._isDraggingOrResizing($target)) {
               return;
            }
            if ($target.hasClass("wc-shift")) {
               options.shiftMouseover($target.data("shift"), $target, event);
            }
         }).mouseout(function(event) {
            var $target = $(event.target);
            if (self._isDraggingOrResizing($target)) {
               return;
            }
            if ($target.hasClass("wc-shift")) {
               if ($target.data("sizing")) return;
               options.shiftMouseout($target.data("shift"), $target, event);
            }
         });
      },

      /*
       * check if a ui draggable or resizable is currently being dragged or resized
       */
      _isDraggingOrResizing : function ($target) {
         return $target.hasClass("ui-draggable-dragging") || $target.hasClass("ui-resizable-resizing");
      },

      /*
       * Render the main calendar layout
       */
      _renderCalendar : function() {
         var $calendarContainer, calendarNavHtml, calendarHeaderHtml, calendarBodyHtml, $employeeColumns;
         var self = this;
         var options = this.options;
         $calendarContainer = $("<div class=\"wc-container\">").appendTo(self.element);
         if (options.buttons) {
            calendarNavHtml = "<div class=\"wc-nav\">\
                    <button class=\"wc-prev\">" + options.buttonText.prevEmployees + "</button>\
                    <button class=\"wc-next\">" + options.buttonText.nextEmployees + "</button>\
                    </div>";

            $(calendarNavHtml).appendTo($calendarContainer);
            $calendarContainer.find(".wc-nav .wc-prev").click(function() {
               self.element.weekCalendar("prevEmployees");
               return false;
            });
            $calendarContainer.find(".wc-nav .wc-next").click(function() {
               self.element.weekCalendar("nextEmployees");
               return false;
            });
         }

         //render calendar header
         calendarHeaderHtml = "<table class=\"wc-header\"><tbody><tr><td class=\"wc-time-column-header\"></td>";
         //for (var i = 1; i <= options.daysToShow; i++) {
		 for (var i = 1; i <= employees.length; i++) {
            calendarHeaderHtml += "<td class=\"wc-employee-column-header wc-day-" + i + "\"></td>";
         }
         calendarHeaderHtml += "<td class=\"wc-scrollbar-shim\"></td></tr></tbody></table>";

         //render calendar body
         calendarBodyHtml = "<div class=\"wc-scrollable-grid\">\
                <table class=\"wc-time-slots\">\
                <tbody>\
                <tr>\
                <td class=\"wc-grid-timeslot-header\"></td>\
                <td colspan=\"" + options.daysToShow + "\">\
                <div class=\"wc-time-slot-wrapper\">\
                <div class=\"wc-time-slots\">";

         var start = options.businessHours.limitDisplay ? options.businessHours.start : 0;
         var end = options.businessHours.limitDisplay ? options.businessHours.end : 24;

         for (var i = start; i < end; i++) {
            for (var j = 0; j < options.timeslotsPerHour - 1; j++) {
               calendarBodyHtml += "<div class=\"wc-time-slot\"></div>";
            }
            calendarBodyHtml += "<div class=\"wc-time-slot wc-hour-end\"></div>";
         }

         calendarBodyHtml += "</div></div></td></tr><tr><td class=\"wc-grid-timeslot-header\">";

         for (var i = start; i < end; i++) {
            var bhClass = (options.businessHours.start <= i && options.businessHours.end > i) ? "wc-business-hours" : "";
            calendarBodyHtml += "<div class=\"wc-hour-header " + bhClass + "\">"
            if (options.use24Hour) {
               calendarBodyHtml += "<div class=\"wc-time-header-cell\">" + self._24HourForIndex(i) + "</div>";
            } else {
               calendarBodyHtml += "<div class=\"wc-time-header-cell\">" + self._hourForIndex(i) + "<span class=\"wc-am-pm\">" + self._amOrPm(i) + "</span></div>";
            }
            calendarBodyHtml += "</div>";
         }
         calendarBodyHtml += "</td>";
         for (var i = 1; i <= options.daysToShow; i++) {
            calendarBodyHtml += "<td class=\"wc-employee-column day-" + i + "\"><div class=\"wc-employee-column-inner\"></div></td>"
         }
         calendarBodyHtml += "</tr></tbody></table></div>";

         //append all calendar parts to container
         $(calendarHeaderHtml + calendarBodyHtml).appendTo($calendarContainer);

         $employeeColumns = $calendarContainer.find(".wc-employee-column-inner");
         $employeeColumns.each(function(i, val) {
            $(this).height(options.timeslotHeight * options.timeslotsPerDay);
            if (!options.readonly) {
               self._addDroppableToEmployeeCol($(this));
               self._setupShiftCreationForEmployee($(this));
            }
         });
         $calendarContainer.find(".wc-time-slot").height(options.timeslotHeight - 1); //account for border
         $calendarContainer.find(".wc-time-header-cell").css({
            height :  (options.timeslotHeight * options.timeslotsPerHour) - 11,
            padding: 5
         });
      },

      /*
       * setup mouse events for capturing new shifts
       */
      _setupShiftCreationForEmployee : function($weekDay) {
         var self = this;
         var options = this.options;
         $weekDay.mousedown(function(event) {
            var $target = $(event.target);
            if ($target.hasClass("wc-employee-column-inner")) {

               var $newShift = $("<div class=\"wc-shift wc-new-shift wc-new-shift-creating\"></div>");

               $newShift.css({lineHeight: (options.timeslotHeight - 2) + "px", fontSize: (options.timeslotHeight / 2) + "px"});
               $target.append($newShift);

               var columnOffset = $target.offset().top;
               var clickY = event.pageY - columnOffset;
               var clickYRounded = (clickY - (clickY % options.timeslotHeight)) / options.timeslotHeight;
               var topPosition = clickYRounded * options.timeslotHeight;
               $newShift.css({top: topPosition});

               $target.bind("mousemove.newevent", function(event) {
                  $newShift.show();
                  $newShift.addClass("ui-resizable-resizing");
                  var height = Math.round(event.pageY - columnOffset - topPosition);
                  var remainder = height % options.timeslotHeight;
                  //snap to closest timeslot
                  if (remainder < (height / 2)) {
                     var useHeight = height - remainder;
                     $newShift.css("height", useHeight < options.timeslotHeight ? options.timeslotHeight : useHeight);
                  } else {
                     $newShift.css("height", height + (options.timeslotHeight - remainder));
                  }
               }).mouseup(function() {
                  $target.unbind("mousemove.newevent");
                  $newShift.addClass("ui-corner-all");
               });
            }

         }).mouseup(function(event) {
            var $target = $(event.target);
            var $weekDay = $target.closest(".wc-employee-column-inner");
            var $newShift = $weekDay.find(".wc-new-shift-creating");
            if ($newShift.length) {
               //if even created from a single click only, default height
               if (!$newShift.hasClass("ui-resizable-resizing")) {
                  $newShift.css({height: options.timeslotHeight * options.defaultShiftLength}).show();
               }
               var top = parseInt($newShift.css("top"));
               var shiftDuration = self._getShiftDurationFromPositionedShiftElement($weekDay, $newShift, top);
               $newShift.remove();
               var newShift = {start: shiftDuration.start, end: shiftDuration.end, title: options.newShiftText};
               var $renderedShift = self._renderShift(newShift, $weekDay);
               if (!options.allowShiftOverlap) {
                  self._adjustForShiftCollisions($weekDay, $renderedShift, newShift, newShift);
                  self._positionShift($weekDay, $renderedShift);
               } else {
                  self._adjustOverlappingShifts($weekDay);
               }
               options.shiftNew(shiftDuration, $renderedShift);
            }
         });
      },

      /*
       * load shifts for the week based on the date provided
       */
      _loadShifts : function(dateWithinWeek) {
         var date, weekStartDate, endDate, $employeeColumns;
         var self = this;

         var options = this.options;
         date = dateWithinWeek || options.date;
         weekStartDate = self._dateFirstDayOfWeek(date);

         weekEndDate = self._dateLastMilliOfWeek(date);

         options.calendarBeforeLoad(self.element);

         self.element.data("startDate", weekStartDate);
         self.element.data("endDate", weekEndDate);

         $employeeColumns = self.element.find(".wc-employee-column-inner");

         self._updateEmployeeColumnHeader($employeeColumns);

         //load shifts by chosen means
         if (typeof options.data == 'string') {
            if (options.loading) options.loading(true);
            var jsonOptions = {};
            jsonOptions[options.startParam || 'start'] = Math.round(weekStartDate.getTime() / 1000);
            jsonOptions[options.endParam || 'end'] = Math.round(weekEndDate.getTime() / 1000);
            $.getJSON(options.data, jsonOptions, function(data) {
               self._renderShifts(data, $employeeColumns);
               if (options.loading) options.loading(false);
            });
         }
         else if ($.isFunction(options.data)) {
            options.data(weekStartDate, weekEndDate,
                  function(data) {
                     self._renderShifts(data, $employeeColumns);
                  });
         }
         else if (options.data) {
               self._renderShifts(options.data, $employeeColumns);
         }
         self._disableTextSelect($employeeColumns);
      },

      /*
       * update the display of each employee column header based on the employee
       */
      _updateEmployeeColumnHeader : function ($employeeColumns) {
         var self = this;
         var options = this.options;

         self.element.find(".wc-header td.wc-employee-column-header").each(function(i, val) {
            var employeeName = employees[i].name;
            $(this).html(employeeName + "<br/><span style='color:#888888;'>Emp #" + employees[i].id + "</span>");
         });

         var currentDay = self._dateFirstDayOfWeek(self._cloneDate(self.element.data("startDate")));

         $employeeColumns.each(function(i, val) {
            $(this).data("startDate", self._cloneDate(currentDay));
            $(this).data("endDate", new Date(currentDay.getTime() + (MILLIS_IN_DAY)));
            currentDay = self._addDays(currentDay, 1);
         });
      },


      /*
       * Render the shifts into the calendar
       */
      _renderShifts : function (data, $employeeColumns) {
         this._clearCalendar();
         var self = this;
         var options = this.options;
         var shiftsToRender;
         if ($.isArray(data)) {
            shiftsToRender = self._cleanShifts(data);
         } 
		 else if (data.shifts) {
            shiftsToRender = self._cleanShifts(data.shifts);
         }
         if (data.options) {
            var updateLayout = false;
            //update options
            $.each(data.options, function(key, value) {
               if (value !== options[key]) {
                  options[key] = value;
                  updateLayout = true;
               }
            });
            self._computeOptions();
            if (updateLayout) {
               self.element.empty();
               self._renderCalendar();
               $employeeColumns = self.element.find(".wc-time-slots .wc-employee-column-inner");
               self._updateEmployeeColumnHeader($employeeColumns);
               self._resizeCalendar();
            }
         }
         $.each(shiftsToRender, function(i, shift) {
            var $weekDay = self._findEmployeeForShift(shift, $employeeColumns);
            if ($weekDay) {
               self._renderShift(shift, $weekDay);
            }
         });
         $employeeColumns.each(function() {
            self._adjustOverlappingShifts($(this));
         });
         options.calendarAfterLoad(self.element);
         if (!shiftsToRender.length) {
            options.noShifts();
         }
      },

      /*
       * Render a specific shift into the employee column provided. Assumes correct
       * employee column for shift employee
       */
      _renderShift: function (shift, $weekDay) {
         var self = this;
         var options = this.options;
         if (shift.start.getTime() > shift.end.getTime()) {
            return; // can't render a negative height
         }
         var shiftClass, shiftHtml, $shift, $modifiedShift;
         shiftClass = shift.id ? "wc-shift" : "wc-shift wc-new-shift";
         shiftHtml = "<div class=\"" + shiftClass + " ui-corner-all\">\
                <div class=\"wc-time ui-corner-all\"></div>\
                <div class=\"wc-title\"></div></div>";

         $shift = $(shiftHtml);
         $modifiedShift = options.shiftRender(shift, $shift);
         $shift = $modifiedShift ? $modifiedShift.appendTo($weekDay) : $shift.appendTo($weekDay);
         $shift.css({lineHeight: (options.timeslotHeight - 2) + "px", fontSize: (options.timeslotHeight / 2) + "px"});
         self._refreshShiftDetails(shift, $shift);
         self._positionShift($weekDay, $shift);
         $shift.show();
         if (!options.readonly && options.resizable(shift, $shift)) {
            self._addResizableToShift(shift, $shift, $weekDay)
         }
         if (!options.readonly && options.draggable(shift, $shift)) {
            self._addDraggableToCalShift(shift, $shift);
         }
         options.shiftAfterRender(shift, $shift);
         return $shift;
      },

      _adjustOverlappingShifts : function($weekDay) {
         var self = this;
         if (self.options.allowShiftOverlap) {
            var groupsList = self._groupOverlappingShiftElements($weekDay);
            $.each(groupsList, function() {
               var curGroups = this;
               $.each(curGroups, function(groupIndex) {
                  var curGroup = this;

                  // do we want shifts to be displayed as overlapping
                  if (self.options.overlapShiftsSeparate) {
                     var newWidth = 100 / curGroups.length;
                     var newLeft = groupIndex * newWidth;
                  } else {
                     // TODO what happens when the group has more than 10 elements
                     var newWidth = 100 - ( (curGroups.length - 1) * 10 );
                     var newLeft = groupIndex * 10;
                  }
                  $.each(curGroup, function() {
                     // bring mouseovered event to the front
                     if (!self.options.overlapShiftsSeparate) {
                        $(this).bind("mouseover.z-index", function() {
                           var $elem = $(this);
                           $.each(curGroup, function() {
                              $(this).css({"z-index":  "1"});
                           });
                           $elem.css({"z-index": "3"});
                        });
                     }
                     $(this).css({width: newWidth + "%", left:newLeft + "%", right: 0});
                  });
               });
            });
         }
      },


      /*
       * Find groups of overlapping shifts
       */
      _groupOverlappingShiftElements : function($weekDay) {
         var $shifts = $weekDay.find(".wc-shift:visible");
         var sortedShifts = $shifts.sort(function(a, b) {
            return $(a).data("shift").start.getTime() - $(b).data("shift").start.getTime();
         });
         var lastEndTime = new Date(0, 0, 0);
         var groups = [];
         var curGroups = [];
         var $curShift;
         $.each(sortedShifts, function() {
            $curShift = $(this);
            //checks, if the current group list is not empty, if the overlapping is finished
            if (curGroups.length > 0) {
               if (lastEndTime.getTime() <= $curShift.data("shift").start.getTime()) {
                  //finishes the current group list by adding it to the resulting list of groups and cleans it
                  groups.push(curGroups);
                  curGroups = [];
               }
            }
            //finds the first group to fill with the shift
            for (var groupIndex = 0; groupIndex < curGroups.length; groupIndex++) {
               if (curGroups[groupIndex].length > 0) {
                  //checks if the shift starts after the end of the last shift of the group
                  if (curGroups[groupIndex][curGroups [groupIndex].length - 1].data("shift").end.getTime() <= $curShift.data("shift").start.getTime()) {
                     curGroups[groupIndex].push($curShift);
                     if (lastEndTime.getTime() < $curShift.data("shift").end.getTime()) {
                        lastEndTime = $curShift.data("shift").end;
                     }
                     return;
                  }
               }
            }
            //if not found, creates a new group
            curGroups.push([$curShift]);
            if (lastEndTime.getTime() < $curShift.data("shift").end.getTime()) {
               lastEndTime = $curShift.data("shift").end;
            }
         });
         //adds the last groups in result
         if (curGroups.length > 0) {
            groups.push(curGroups);
         }
         return groups;
      },


      /*
       * find the employee in the current calendar that the shift falls within
       */
      _findEmployeeForShift : function(shift, $employeeColumns) {
         var $employeeCol;
         $employeeColumns.each(function() {
            if ($(this).data("startDate").getTime() <= shift.start.getTime() && 
			    $(this).data("endDate").getTime() >= shift.end.getTime()) {
               $employeeCol = $(this);
               return false;
            }
         });
         return $employeeCol;
      },

      /*
       * update the shifts rendering in the calendar. Add if does not yet exist.
       */
      _updateShiftInCalendar : function (shift) {
         var self = this;
         var options = this.options;
         self._cleanShift(shift);

         if (shift.id) {
            self.element.find(".wc-shift").each(function() {
               if ($(this).data("shift").id === shift.id || $(this).hasClass("wc-new-shift")) {
                  $(this).remove();
                  return false;
               }
            });
         }

         var $weekDay = self._findEmployeeForShift(shift, self.element.find(".wc-time-slots .wc-employee-column-inner"));
         if ($weekDay) {
            var $shift = self._renderShift(shift, $weekDay);
            self._adjustForShiftCollisions($weekDay, $shift, shift, shift);
            self._refreshShiftDetails(shift, $shift);
            self._positionShift($weekDay, $shift);
            self._adjustOverlappingShifts($weekDay);
         }
      },

      /*
       * Position the shift element within the employee column based on it's start / end dates.
       */
      _positionShift : function($employeeCol, $shift) {
         var options = this.options;
         var shift = $shift.data("shift");
         var pxPerMillis = $employeeCol.height() / options.millisToDisplay;
         var firstHourDisplayed = options.businessHours.limitDisplay ? options.businessHours.start : 0;
         var startMillis = shift.start.getTime() - new Date(shift.start.getFullYear(), shift.start.getMonth(), shift.start.getDate(), firstHourDisplayed).getTime();
         var shiftMillis = shift.end.getTime() - shift.start.getTime();
         var pxTop = pxPerMillis * startMillis;
         var pxHeight = pxPerMillis * shiftMillis;
         $shift.css({top: pxTop, height: pxHeight});
      },

      /*
       * Determine the actual start and end times of a shift based on it's
       * relative position within the employee column and the starting hour of the
       * displayed calendar.
       */
      _getShiftDurationFromPositionedShiftElement : function($employeeCol, $shift, top) {
         var options = this.options;
         var startOffsetMillis = options.businessHours.limitDisplay ? options.businessHours.start * 60 * 60 * 1000 : 0;
         var start = new Date($employeeCol.data("startDate").getTime() + startOffsetMillis + Math.round(top / options.timeslotHeight) * options.millisPerTimeslot);
         var end = new Date(start.getTime() + ($shift.height() / options.timeslotHeight) * options.millisPerTimeslot);
         return {start: start, end: end};
      },

      /*
       * If the calendar does not allow shift overlap, adjust the start or end date if necessary to
       * avoid overlapping of shifts. Typically, shortens the resized / dropped shift to it's max possible
       * duration  based on the overlap. If no satisfactory adjustment can be made, the shift is reverted to
       * it's original location.
       */
      _adjustForShiftCollisions : function($weekDay, $shift, newShift, oldShift, maintainShiftDuration) {
         var options = this.options;
         if (options.allowShiftOverlap) {
            return;
         }
         var adjustedStart, adjustedEnd;
         var self = this;
         $weekDay.find(".wc-shift").not($shift).each(function() {
            var currentShift = $(this).data("shift");
            //has been dropped onto existing shift overlapping the end time
            if (newShift.start.getTime() < currentShift.end.getTime()
                  && newShift.end.getTime() >= currentShift.end.getTime()) {
               adjustedStart = currentShift.end;
            }

            //has been dropped onto existing shift overlapping the start time
            if (newShift.end.getTime() > currentShift.start.getTime()
                  && newShift.start.getTime() <= currentShift.start.getTime()) {
               adjustedEnd = currentShift.start;
            }
            //has been dropped inside existing shift with same or larger duration
            if (oldShift.resizable == false || (newShift.end.getTime() <= currentShift.end.getTime()
                  && newShift.start.getTime() >= currentShift.start.getTime())) {
               adjustedStart = oldShift.start;
               adjustedEnd = oldShift.end;
               return false;
            }
         });
         newShift.start = adjustedStart || newShift.start;
         if (adjustedStart && maintainShiftDuration) {
            newShift.end = new Date(adjustedStart.getTime() + (oldShift.end.getTime() - oldShift.start.getTime()));
            self._adjustForShiftCollisions($weekDay, $shift, newShift, oldShift);
         } 
		 else {
            newShift.end = adjustedEnd || newShift.end;
         }
         //reset if new shift has been forced to zero size
         if (newShift.start.getTime() >= newShift.end.getTime()) {
            newShift.start = oldShift.start;
            newShift.end = oldShift.end;
         }
         $shift.data("shift", newShift);
      },

      /*
       * Add draggable capabilities to a shift
       */
      _addDraggableToCalShift : function(shift, $shift) {
         var self = this;
         var options = this.options;
         var $weekDay = self._findEmployeeForShift(shift, self.element.find(".wc-time-slots .wc-employee-column-inner"));
         $shift.draggable({
            handle : ".wc-time",
            containment: ".wc-scrollable-grid",
            revert: 'valid',
            opacity: 0.5,
            grid : [$shift.outerWidth() + 1, options.timeslotHeight ],
            start : function(event, ui) {
               var $shift = ui.draggable;
               options.shiftDrag(shift, $shift);
            }
         });
      },

      /*
       * Add droppable capabilites to employee columns to allow dropping of shifts only
       */
      _addDroppableToEmployeeCol : function($weekDay) {
         var self = this;
         var options = this.options;
         $weekDay.droppable({
            accept: ".wc-shift",
            drop: function(event, ui) {
               var $shift = ui.draggable;
               var top = Math.round(parseInt(ui.position.top));
               var shiftDuration = self._getShiftDurationFromPositionedShiftElement($weekDay, $shift, top);
               var shift = $shift.data("shift");

               var newShift = $.extend(true, {}, shift, {start: shiftDuration.start, end: shiftDuration.end});
               self._adjustForShiftCollisions($weekDay, $shift, newShift, shift, true);
               var $employeeColumns = self.element.find(".wc-employee-column-inner");

                //trigger drop callback
               options.shiftDrop(newShift, shift, $newShift);
			   // is the order of these 2 lines wrong????  above line and below ling
               var $newShift = self._renderShift(newShift, self._findEmployeeForShift(newShift, $employeeColumns));	   
               $shift.hide();          
               $shift.data("preventClick", true);
               var $weekDayOld = self._findEmployeeForShift($shift.data("shift"), 
			                                                self.element.find(".wc-time-slots .wc-employee-column-inner"));
               if ($weekDayOld.data("startDate") != $weekDay.data("startDate")) {
                  self._adjustOverlappingShifts($weekDayOld);
               }
               self._adjustOverlappingShifts($weekDay);

               setTimeout(function() {
                  $shift.remove();
               }, 1000);
            }
         });
      },

      /*
       * Add resizable capabilities to a shift
       */
      _addResizableToShift : function(shift, $shift, $weekDay) {
         var self = this;
         var options = this.options;
         $shift.resizable({
            grid: options.timeslotHeight,
            containment : $weekDay,
            handles: "s",
            minHeight: options.timeslotHeight,
            stop :function(event, ui) {
               var $shift = ui.element;
               var newEnd = new Date($shift.data("shift").start.getTime() + ($shift.height() / options.timeslotHeight) * options.millisPerTimeslot);
               var newShift = $.extend(true, {}, shift, {start: shift.start, end: newEnd});
               self._adjustForShiftCollisions($weekDay, $shift, newShift, shift);
               self._refreshShiftDetails(newShift, $shift);
               self._positionShift($weekDay, $shift);
               self._adjustOverlappingShifts($weekDay);
               //trigger resize callback
               options.shiftResize(newShift, shift, $shift);
               $shift.data("preventClick", true);
               setTimeout(function() {
                  $shift.removeData("preventClick");
               }, 500);
            }
         });
      },

      /*
       * Refresh the displayed details of a shift in the calendar
       */
      _refreshShiftDetails : function(shift, $shift) {
         var self = this;
         var options = this.options;
         var one_hour = 3600000;
         var displayTitleWithTime = shift.end.getTime()-shift.start.getTime() <= (one_hour/options.timeslotsPerHour);
         if (displayTitleWithTime){
           $shift.find(".wc-time").html(self._formatDate(shift.start, options.timeFormat) + ": " + shift.title);
         }
         else {
           $shift.find(".wc-time").html(self._formatDate(shift.start, options.timeFormat) + options.timeSeparator + self._formatDate(shift.end, options.timeFormat));
         }
         $shift.find(".wc-title").html(shift.title);
         $shift.data("shift", shift);
      },

      /*
       * Clear all shifts from the calendar
       */
      _clearCalendar : function() {
         this.element.find(".wc-employee-column-inner div").remove();
      },

      /*
       * Scroll the calendar to a specific hour
       */
      _scrollToHour : function(hour) {
         var self = this;
         var options = this.options;
         var $scrollable = this.element.find(".wc-scrollable-grid");
         var slot = hour;
         if (self.options.businessHours.limitDisplay) {
            if (hour <= self.options.businessHours.start) {
               slot = 0;
            } 
			else if (hour > self.options.businessHours.end) {
               slot = self.options.businessHours.end -
               self.options.businessHours.start - 1;
            } 
			else {
               slot = hour - self.options.businessHours.start;
            }        
         }

         var $target = this.element.find(".wc-grid-timeslot-header .wc-hour-header:eq(" + slot + ")");

         $scrollable.animate({scrollTop: 0}, 0, function() {
            var targetOffset = $target.offset().top;
            var scroll = targetOffset - $scrollable.offset().top - $target.outerHeight();
            $scrollable.animate({scrollTop: scroll}, options.scrollToHourMillis);
         });
      },

      /*
       * find the hour (12 hour day) for a given hour index
       */
      _hourForIndex : function(index) {
         if (index === 0) { //midnight
            return 12;
         } else if (index < 13) { //am
            return index;
         } else { //pm
            return index - 12;
         }
      },

      _24HourForIndex : function(index) {
         if (index === 0) { //midnight
            return "00:00";
         } else if (index < 10) {
            return "0" + index + ":00";
         } else {
            return index + ":00";
         }
      },

      _amOrPm : function (hourOfDay) {
         return hourOfDay < 12 ? "AM" : "PM";
      },

      _isToday : function(date) {
         var clonedDate = this._cloneDate(date);
         this._clearTime(clonedDate);
         var today = new Date();
         this._clearTime(today);
         return today.getTime() === clonedDate.getTime();
      },

      /*
       * Clean shifts to ensure correct format
       */
      _cleanShifts : function(shifts) {
         var self = this;
         $.each(shifts, function(i, shift) {
            self._cleanShift(shift);
         });
         return shifts;
      },

      /*
       * Clean specific shift
       */
      _cleanShift : function (shift) {
         if (shift.date) {
            shift.start = shift.date;
         }
         shift.start = this._cleanDate(shift.start);
         shift.end = this._cleanDate(shift.end);
         if (!shift.end) {
            shift.end = this._addDays(this._cloneDate(shift.start), 1);
         }
      },

      /*
       * Disable text selection of the elements in different browsers
       */
      _disableTextSelect : function($elements) {
         $elements.each(function() {
            if ($.browser.mozilla) {//Firefox
               $(this).css('MozUserSelect', 'none');
            } else if ($.browser.msie) {//IE
               $(this).bind('selectstart', function() {
                  return false;
               });
            } else {//Opera, etc.
               $(this).mousedown(function() {
                  return false;
               });
            }
         });
      },

      /*
       * returns the date on the first millisecond of the week
       */

      _dateFirstDayOfWeek : function(date) {
         var self = this;
         var midnightCurrentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
         var adjustedDate = new Date(midnightCurrentDate);
         adjustedDate.setDate(adjustedDate.getDate() - self._getAdjustedDayIndex(midnightCurrentDate));

         return adjustedDate;

      },

       /*
       * returns the date on the first millisecond of the last day of the week
       */
       _dateLastDayOfWeek : function(date) {


         var self = this;
         var midnightCurrentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
         var adjustedDate = new Date(midnightCurrentDate);
         adjustedDate.setDate(adjustedDate.getDate() + (6 - this._getAdjustedDayIndex(midnightCurrentDate)));

         return adjustedDate;
          
       },

      /*
       * gets the index of the current day adjusted based on options
       */
      _getAdjustedDayIndex : function(date) {

         var midnightCurrentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
         var currentDayOfStandardWeek = midnightCurrentDate.getDay();
         var days = [0,1,2,3,4,5,6];
         this._rotate(days, this.options.firstDayOfWeek);
         return days[currentDayOfStandardWeek];
      },

      /*
       * returns the date on the last millisecond of the week
       */
      _dateLastMilliOfWeek : function(date) {
         var lastDayOfWeek = this._dateLastDayOfWeek(date);
         return new Date(lastDayOfWeek.getTime() + (MILLIS_IN_DAY));

      },

      /*
       * Clear the time components of a date leaving the date
       * of the first milli of day
       */
      _clearTime : function(d) {
         d.setHours(0);
         d.setMinutes(0);
         d.setSeconds(0);
         d.setMilliseconds(0);
         return d;
      },

      /*
       * add specific number of days to date
       */
      _addDays : function(d, n, keepTime) {
         d.setDate(d.getDate() + n);
         if (keepTime) {
            return d;
         }
         return this._clearTime(d);
      },

      /*
       * Rotate an array by specified number of places.
       */
      _rotate : function(a /*array*/, p /* integer, positive integer rotate to the right, negative to the left... */) {
         for (var l = a.length, p = (Math.abs(p) >= l && (p %= l),p < 0 && (p += l),p), i, x; p; p = (Math.ceil(l / p) - 1) * p - l + (l = p)) {
            for (i = l; i > p; x = a[--i],a[i] = a[i - p],a[i - p] = x);
         }
         return a;
      },

      _cloneDate : function(d) {
         return new Date(d.getTime());
      },

      /*
       * return a date for different representations
       */
      _cleanDate : function(d) {
         if (typeof d == 'string') {
            return $.weekCalendar.parseISO8601(d, true) || Date.parse(d) || new Date(parseInt(d));
         }
         if (typeof d == 'number') {
            return new Date(d);
         }
         return d;
      },

      /*
       * date formatting is adapted from
       * http://jacwright.com/projects/javascript/date_format
       */
      _formatDate : function(date, format) {
         var options = this.options;
         var returnStr = '';
         for (var i = 0; i < format.length; i++) {
            var curChar = format.charAt(i);
            if ($.isFunction(this._replaceChars[curChar])) {
	           var res = this._replaceChars[curChar](date, options);

	           if (res === '00' && options.alwaysDisplayTimeMinutes === false) {
		          //remove previous character
		          returnStr = returnStr.slice(0, -1);
		        } else {
                 
	               returnStr += res;
	           }
            } else {
               returnStr += curChar;
            }
         }

         return returnStr;
      },

      _replaceChars : {

         // Day
         d: function(date) {
            return (date.getDate() < 10 ? '0' : '') + date.getDate();
         },
         D: function(date, options) {
            return options.shortDays[date.getDay()];
         },
         j: function(date) {
            return date.getDate();
         },
         l: function(date, options) {
            return options.longDays[date.getDay()];
         },
         N: function(date) {
            return date.getDay() + 1;
         },
         S: function(date) {
            return (date.getDate() % 10 == 1 && date.getDate() != 11 ? 'st' : (date.getDate() % 10 == 2 && date.getDate() != 12 ? 'nd' : (date.getDate() % 10 == 3 && date.getDate() != 13 ? 'rd' : 'th')));
         },
         w: function(date) {
            return date.getDay();
         },
         z: function(date) {
            return "Not Yet Supported";
         },
         // Week
         W: function(date) {
            return "Not Yet Supported";
         },
         // Month
         F: function(date, options) {
            return options.longMonths[date.getMonth()];
         },
         m: function(date) {
            return (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
         },
         M: function(date, options) {
            return options.shortMonths[date.getMonth()];
         },
         n: function(date) {
            return date.getMonth() + 1;
         },
         t: function(date) {
            return "Not Yet Supported";
         },
         // Year
         L: function(date) {
            return "Not Yet Supported";
         },
         o: function(date) {
            return "Not Supported";
         },
         Y: function(date) {
            return date.getFullYear();
         },
         y: function(date) {
            return ('' + date.getFullYear()).substr(2);
         },
         // Time
         a: function(date) {
            return date.getHours() < 12 ? 'am' : 'pm';
         },
         A: function(date) {
            return date.getHours() < 12 ? 'AM' : 'PM';
         },
         B: function(date) {
            return "Not Yet Supported";
         },
         g: function(date) {
            return date.getHours() % 12 || 12;
         },
         G: function(date) {
            return date.getHours();
         },
         h: function(date) {
            return ((date.getHours() % 12 || 12) < 10 ? '0' : '') + (date.getHours() % 12 || 12);
         },
         H: function(date) {
            return (date.getHours() < 10 ? '0' : '') + date.getHours();
         },
         i: function(date) {
            return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
         },
         s: function(date) {
            return (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
         },
         // Timezone
         e: function(date) {
            return "Not Yet Supported";
         },
         I: function(date) {
            return "Not Supported";
         },
         O: function(date) {
            return (date.getTimezoneOffset() < 0 ? '-' : '+') + (date.getTimezoneOffset() / 60 < 10 ? '0' : '') + (date.getTimezoneOffset() / 60) + '00';
         },
         T: function(date) {
            return "Not Yet Supported";
         },
         Z: function(date) {
            return date.getTimezoneOffset() * 60;
         },
         // Full Date/Time
         c: function(date) {
            return "Not Yet Supported";
         },
         r: function(date) {
            return date.toString();
         },
         U: function(date) {
            return date.getTime() / 1000;
         }
      }

   });

   $.extend($.ui.weekCalendar, {
      version: '1.2.2-pre'

   });

   var MILLIS_IN_DAY = 86400000;
   var MILLIS_IN_WEEK = MILLIS_IN_DAY * 7;

   $.weekCalendar = function() {
      return {
         parseISO8601 : function(s, ignoreTimezone) {

            // derived from http://delete.me.uk/2005/03/iso8601.html
            var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
                         "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
                         "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
            var d = s.match(new RegExp(regexp));
            if (!d) return null;
            var offset = 0;
            var date = new Date(d[1], 0, 1);
            if (d[3]) {
               date.setMonth(d[3] - 1);
            }
            if (d[5]) {
               date.setDate(d[5]);
            }
            if (d[7]) {
               date.setHours(d[7]);
            }
            if (d[8]) {
               date.setMinutes(d[8]);
            }
            if (d[10]) {
               date.setSeconds(d[10]);
            }
            if (d[12]) {
               date.setMilliseconds(Number("0." + d[12]) * 1000);
            }
            if (!ignoreTimezone) {
               if (d[14]) {
                  offset = (Number(d[16]) * 60) + Number(d[17]);
                  offset *= ((d[15] == '-') ? 1 : -1);
               }
               offset -= date.getTimezoneOffset();
            }
            return new Date(Number(date) + (offset * 60 * 1000));
         }
      };
   }();

})(jQuery);
