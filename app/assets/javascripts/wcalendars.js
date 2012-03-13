


(function( $ ) {

  $.widget( "ui.advisingCalendar", $.ui.mouse, {
		

		 
    // These options will be used as defaults
    options: { 
			is_owner: false,
			title: "Calendar",
			csrf: 0,
			advisor_id: 0,
			user_id: 0,
			ra_id: 0,
			calendar_id: 0,
      clear: null,
			daysToShow: 7,
			startDate: new Date(),
			startHour: 8,
			endHour: 18,
			slotTime: 15,
			reloadInterval: 30000,
//Adjusting UTC time to EST time
			EST_TIME: 5
    },

    vars: {
            form: jQuery( '<div id="ui-advising-calendar-form">' ),
            dialog: jQuery( '<div id="ui-advising-calendar-dialog">' ),
            loading: jQuery( '<div id="ui-advising-calendar-loading"><p>loading</p><img /></div>' ),
            stats: jQuery( '<div id="ui-advising-calendar-stats"><span class="ui-advising-stats-slots-taken" /><span class="ui-advising-stats-text">   out of </span><span class="ui-advising-stats-slots-open" /><span class="ui-advising-stats-text"> slots are taken</span></div>' ),
						listViewButton: jQuery( '<div id="ui-advising-calendar-list-button"><button></button></div>' ),
						controlBar: jQuery("<div id='ui-advising-calendar-main-bar' />" ),
						title: jQuery("<div id='ui-advising-calendar-title'><h2></h2></div>" ),
						shadow: jQuery("<div class='ui-advising-calendar-shadow' />" ),
						helpButton: jQuery("<button id='help-button'>Help </ button>"),
						help: jQuery("<div id='help' class='ui-widget ui-corner-all' />"),
						count: 0,
						slotsOpen: 0,
						slotsTaken: 0,
			MAX_NAME_CHARS: 14
		 },
 
    _create: function() {
			this._renderAssistantElements();
			this._getUserInformation();
			this._renderCalendar();
			this._loadEventsToCalendar();
			this._createLoadTimer();
			this.closeAjaxLoadingWidget(this.vars.loading);
			this._updateSlotStats(this.vars.slotsOpen, this.vars.slotsTaken);

    },
 
    _setIntervalWithContext: function (code, delay, context) {
            return setInterval(function () {
                code.call(context);
            }, delay);
        },
 
		_createLoadTimer: function(){
            var $this = this;
            $this.interval = $this._setIntervalWithContext(function () {
                $this._loadEventsToCalendar();
            }, $this.options.reloadInterval, $this);
        },
 

		//JSON request to server to fetch the events for the given 
		_loadEventsToCalendar: function(){

         var self = this;
					this.vars.slotsOpen = 0;
					this.vars.slotsTaken = 0;

					$(".ui-advising-calendar-not-blank").remove();

			var eventsUrl = document.URL + "/events.json";
			$.getJSON(eventsUrl, function(data) {
				$numEvents = 0;
				$.each(data, function(key, val) {
					if(!val.user){
						sName = "";
					}else{
						sName = val.user.last_name + ", " + val.user.first_name;
					}
					var s = self.createEventSlot(val.starttime, val.id, sName, val.registration_ability_id);
				});
			});
  		//FsetTimeout ( self._loadEventsToCalendar(), 10000 );

		},

		createEventSlot: function(starttime, id, email, ra_id){

					var self = this;

					var $slot = jQuery("#"+starttime);
					$slot.children().remove();

					var s = jQuery( '<div ></ div> ' );
					s.attr("event_id", id).attr("ra_id", ra_id)
					s.addClass("ui-advising-calendar-not-blank");
	
					$slot.append(s);

					if(!email){
						email = "";
					}
//Defining open slot or not
					if(email.length === 0){
						s.addClass('ui-advising-calendar-open-slot');
						s.text("Open Slot");
						self.vars.slotsOpen++;
					} else{
						s.addClass('ui-advising-calendar-taken-slot');
						s.text(this.capStringLength(email, this.vars.MAX_NAME_CHARS));
						self.vars.slotsTaken++;
					}
					s.addClass("unselectable");
					$slot.unbind('click');
					$slot.bind('click', {context: this}, this.editAdvisingSlot);
					self._updateSlotStats(self.vars.slotsOpen, self.vars.slotsTaken);
					return s;
		},
		
		_updateSlotStats: function(open, taken){
	//		jQuery(this.vars.stats).find('.ui-advising-stats-slots-open').text(open+taken);
		//	jQuery(this.vars.stats).find('.ui-advising-stats-slots-taken').text(taken);
			
		},

		capStringLength: function(str, maxLen){
			if(str.indexOf('@')>2){
				str = str.substring(0, str.indexOf('@'));
			}
			if(str.length < maxLen){
				return str;
			}else{
				return str.substring(0, maxLen-2) + "..";
			}
		},
		
		//Renders assistant ajax, dialog, and form elements
		_renderAssistantElements: function(){

			loading = this.vars.loading
				.ajaxStart(function() {
					$(this).show();
				})
				.ajaxStop(function() {
					$(this).hide();
				})
				.appendTo(this.element);

			dialog = this.vars.dialog
				.appendTo(this.element);
			form = this.vars.form
				.appendTo(this.element);
			help = this.vars.help
				.appendTo(this.element).append(jQuery("<h2/>").text("Help"));
			helpButton = this.vars.helpButton
				.appendTo(this.element).button().hover(function () {
						helpButton.html("<span class='ui-button-text'>Hide</span>");
						help.show();
					}, function () {
						helpButton.html("<span class='ui-button-text'>Help</span>");
						help.hide();
    			});

			helpText = jQuery("<p />");
			if(this.options.is_owner){
				$ul = jQuery( "<ul />");
				$li1 = jQuery( "<li>Click on desired timeslot to create an open time slot.</li>" );
				$li2 = jQuery( "<li>Click on open/taken appointment to edit the time slot.</li>" );
				$ul.append($li1).append($li2);
				helpText.append($ul);
			}else{
				$ul = jQuery( "<ul />");
				$li1 = jQuery( "<li>Click on open timeslot to create an appointment.</li>" );
				$ul.append($li1);
				helpText.append($ul);
			}
			help.append(helpText);
			help.hide();

			controlBar = jQuery('#nav-bar');
//this.vars.controlBar
//				.appendTo(this.element);
			

				
			if(this.options.is_owner){
				listView = this.vars.listViewButton
					.appendTo(controlBar);
				listView.find('button').text("View Appointments List");
				listView.find('button').bind('click', {context: this, list: true}, this.listViewToggle);
				listView.find('button').button(); 
				emailView = listView.clone().appendTo(controlBar);
				emailView.find('button').text("View Email List");
				emailView.find('button').bind('click', {context: this, list: false}, this.listViewToggle);
				emailView.find('button').button();
			}


			//stats = this.vars.stats
			//	.appendTo(controlBar);
			stats= jQuery("<div id='ui-advising-calendar-stats'>This calendar will refresh every "+this.options.reloadInterval/1000 + " seconds.</div>")
				.appendTo(controlBar);


			controlBar.append($("<div class='clear' />"));
			controlBar.width("100px");

title = this.vars.title.appendTo(this.element);
				title.find("h2")
				.text(this.options.title);

	

		},

		listViewToggle: function(event){
			var context = event.data.context;	
			var list = event.data.list;
			var registrationAbilitiesURL = document.URL + "/registration_abilities.json";

					$noEventList = [];
					$pastEventList = [];
					$futureEventList = [];
					var $n;

			$info = $("<div class='diag-height'/>");
			$table = $("<table id='ui-advising-calendar-registrations-info' />");
      $table.addClass('tablesorter');   
    	$head = $('<thead/>');
    	$headRow = $('<tr/>');
    	$headRow.appendTo($head);
			$head.appendTo($table);

			str = [ 'Name', '# of Appt', '# Allowed', 'Appts' ];
			for(var i = 0 ; i<str.length; i++){

				$headR = $('<th/>');
				$headR.text(str[i]);
				$headR.appendTo($headRow);
			}

			var studentsRegistered = true;
			//URL returns json of registration abilities with access to user information and all events linked to registration ability
			$.getJSON(registrationAbilitiesURL, function(data) {
				$table_r = $table;
				if(data.length == 0){
					studentsRegistered = false;
				}
				$.each(data, function(key, val) {	
						$user_name = val.user.last_name + ", " + val.user.first_name;
						$n_events = val.events.length;
						$events_allowed = val.number_of_events;
						$user = $("<tr class='ui-advising-user-info'/>");
							$td = $("<td/>");
							$td.addClass('ui-advising-user-name');
							$td.text($user_name);
							$td.appendTo($user);

							$td = $("<td/>");
							$td.addClass('ui-advising-number-of-events');
							$td.text($n_events);
							$td.appendTo($user);

							$td = $("<td/>");
							$td.addClass('ui-advising-allowed');
							$td.text($events_allowed);
							$td.appendTo($user);

							var futE = true;
						$.each(val.events, function(key, val) {
							var d = new Date(parseInt(val.starttime) - context.options.EST_TIME*60*60*1000);

							$clone = $user.clone();
							if(d < (new Date()) ){
								futE = false;
							}
							$event = jQuery("<td/>");
							$event.html(context._getDateFromMillisecondsTable(val.starttime));
							$event.appendTo($clone);		
							$clone.appendTo($table_r);	
						});
						if(val.events.length===0){
							$td.addClass('ui-advising-information-event');
							$event = jQuery("<td '/>");
							$event.html("No appointments");
							$event.appendTo($user);

							$user.appendTo($table_r);
							$noEventList.push(val.user.email);
						}else{
							if(futE){
									$futureEventList.push(val.user.email);
							}else{
									$pastEventList.push(val.user.email);
							}
							
						}
					});
				if(!studentsRegistered){
					context.displayMessage("Alert", jQuery("<p>No students registered to this calendar</p>"));
					return ;
				}
				if(list){
					$table_r.tablesorter();
					$table.appendTo($info);
				}else{
				var $noE = jQuery("<div class='ui-advising-calendar-no-event-list' />");
				var $nE = jQuery("<button>No events list ("+$noEventList.length + ")</button>").click(function(){ $emailText.html($noEventList.join(", ")) });
				var $fE = jQuery("<button>Future events list ("+$futureEventList.length + ")</button>").click(function(){ $emailText.html($futureEventList.join(", ")) });
				var $pE = jQuery("<button>Past events list ("+$pastEventList.length + ")</button>").click(function(){ $emailText.html($pastEventList.join(", ")) });
				var $emailText = jQuery("<p style='text-align:center;'/>");

					$info.append($nE).append($fE).append($pE);
					$noE.html($emailText);
					$noE.appendTo($info);
			
				}
				context.displayMessage("List View", $info);
			});


			
		},
	
		closeAjaxLoadingWidget: function(el){
					$(el).hide();
		},
	
		openAjaxLoadingWidget: function(el){			
					$(el).show();
		},
		
		_getUserInformation: function(){
			
		},
 
    // Use the _setOption method to respond to changes to options
    _setOption: function( key, value ) {
      switch( key ) {
        case "clear":
          // handle changes to clear option
          break;
      }
 
      // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
      $.Widget.prototype._setOption.apply( this, arguments );
      // In jQuery UI 1.9 and above, you use the _super method instead
      this._super( "_setOption", key, value );
    },
 
    // Use the destroy method to clean up any modifications your widget has made to the DOM
    destroy: function() {
      // In jQuery UI 1.8, you must invoke the destroy method from the base widget
      $.Widget.prototype.destroy.call( this );
      // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method
    },

		_renderCalendar: function(){
			//Appending container to the element
			this.$calendarContainer = $( '<div id="ui-advising-calendar-container">' )
				.appendTo(this.element);
			//Initializing table to hold all elements of the calendar
			$calendarHeader = $( '<table id="ui-advising-calendar-header" >' )
				.appendTo(this.$calendarContainer);
			$calendarTable = $( '<table id="ui-advising-calendar-table" >' )
				.appendTo(this.$calendarContainer);
			$calendarRows = this._generateCalendarHeader($calendarHeader);
			$calendarRows
				.appendTo($calendarTable);
			//Passing only the first row (time row)
			this._generateTimeSlots($calendarRows.find(":first"));
			//Passing all other rows other than the first one
			this._generateEventSlots($calendarRows.find("td:not[:first]"));
			
		},
		
		//generating bins for every hour
		_generateEventSlots: function(eventRows) {
			//Number of days
			var numberOfDays = this.options.daysToShow;
			for(var day = 0; day < numberOfDays+1; day++){

					var currDay = this._getDay(day);
					var d = Date.UTC(currDay.getFullYear(), currDay.getMonth(), currDay.getDate())
					if(!this._isWeekendOrHoliday(day)){
						$hourBins = this._generateHourlyEventSlots(d)
							.appendTo(eventRows[day+1]);
				}
			}
		},

		_generateIndividualSlots: function(d, hour) {
			//Must be divisible by 60, defaults to 15.
			if(60%this.options.slotTime != 0){
				this.options.slotTime = 15;
			}
			var slotsPerHour = 60/this.options.slotTime ;
			
			$hourBin = $( '<div class="ui-advising-calendar-hourly-event-container" >' );

			//Adding what hour it currently is
			$hourBin.attr("id", hour);

			for(var i = 0; i<slotsPerHour; i++){
				$timeSlot = this._timeSlotObject(this._addTimeId(d, hour, i*this.options.slotTime))
					.appendTo($hourBin);
				if(i%2 == 0){
					$timeSlot.addClass("odd-slot");
				}

					$timeSlot.attr("title", this._getDateFromMilliseconds($timeSlot.attr("id")));
			}
			return $hourBin;
		},

		//function creates a timeSlot obejct for valid time slots
		_timeSlotObject: function(id){

			var o = this.options;
			o.context = this;

			$timeSlot = $( '<div class="ui-advising-calendar-time-slot">' );
			$timeSlot.attr("id", id);
			if(o.is_owner == true){
				$timeSlot.bind('click', {context: this}, this.createAdvisingSlot);
			}
			return $timeSlot;
		},

		//Clicking on advising slot
		createAdvisingSlot : function (event) {
		
			//Fetching timeslot event target
			var ts = jQuery(event.target);

			//Fetching widget context
			var context = event.data.context;
			
			var createEventUrl = document.URL + "/events.json";
			$.ajax({
  			type: 'POST',
  			url: createEventUrl,
				data: { event: { starttime : ts.attr("id"), calendar_id: context.options.calendar_id} },
				headers: {
    			'X-CSRF-Token': context.options.csrf
		  	},
				success: function(data){
						var s = context.createEventSlot(data.starttime, data.id, data.email);
				}
			});

		},

		//Clicking on open advising slot
		editAdvisingSlot : function (event) {
			//Fetching timeslot event target
			var ts = jQuery(event.target);

			//Fetching widget context
			var context = event.data.context;			
			diag = context.vars.dialog;
			diag.html("");

			loading = context.vars.loading
				.ajaxStart(function() {
					$(this).show();
				})
				.ajaxStop(function() {
					$(this).hide();
				})
				.appendTo(diag);

			$table = jQuery("<table/>");
			$row = jQuery("<tr/>");
			$row.appendTo($table);

			$time = jQuery("<td class='ui-advising-calendar-event-date-info'><h3>"+context._getDateFromMilliseconds(ts.parent().attr("id")) + "</h3></td>");
			$row.append("<td>Event Time</td>");
			$row.append($time);
			$row = jQuery("<tr/>");
			$row.appendTo($table);

			if(context.options.is_owner){
				$td = jQuery("<td/>");
				form = jQuery( "<select/>");
				$td.append(form);
				if(ts.hasClass("ui-advising-calendar-taken-slot") == true){
					form.append('<option value="'+ts.attr("ra_id")+'">'+ts.text()+'</option>');
					form.append('<option>Remove Student From Slot</option>');
				}else{
					form.append('<option>Open Slot</option>');			
				}
				var calendarUserURL = document.URL + "/registration_abilities.json";
				$.getJSON(calendarUserURL, function(data) {
					$.each(data, function(key, val) {
								form.append('<option value="'+val.id+'">'+val.user.last_name + ", " + val.user.first_name +'</option>');
							
					});
				});

				$row.append("<td>Assigned to:</td>");
				$row.append($td);
				diag.append($table);

				diag.dialog({
									modal: true,
									width: 600,
									buttons: {
										"Delete this slot": function() {
											if(confirm("Are you sure you want to delete this slot?")){
												var deleteEventUrl = document.URL + "/events/" + ts.attr("event_id").toString() + "/delete.json";
												$.ajax({
													type: "POST",
													url: deleteEventUrl,
													headers: {
														'X-CSRF-Token': context.options.csrf
													},
													success: function(){
														ts.parent().unbind('click');
														ts.parent().bind('click', {context: context}, context.createAdvisingSlot);
														if(ts.attr("ra_id")){
															context.vars.slotsTaken--;		
														}else{
															context.vars.slotsOpen--;
														}
														ts.parent().find("div").remove();
														form.remove();
														$( diag ).dialog( "destroy" );
														
														context._updateSlotStats(context.vars.slotsOpen, context.vars.slotsTaken);
														
													}
												});	
										}	
									},
										"Update": function() {
												
													var updateEventUrl = document.URL + "/events/" + ts.attr("event_id") + "/update.json";

														$.ajax({
															type: "POST",
															url: updateEventUrl,
															data: { event : {calendar_id: context.options.calendar_id, registration_ability_id : form.val()} },
															headers: {
																'X-CSRF-Token': context.options.csrf
															},
															success: function(data){
																		if(!!data.registration_ability){
																			$e = $("<div class='ui-advising-calendar-error'/>");
																			$e.text(data.registration_ability.toString());
																			context.displayMessage("Error", $e);
																		}else{
																			$id = data.id;

																				$ra_id = "remove";
																			try{
																				$sName = data.user.last_name + ", " + data.user.first_name;
																				$ra_id = data.registration_ability_id;
																				
																					if(!!ts.attr("ra_id")){
																						context.vars.slotsTaken--;		
																					}else{
																						context.vars.slotsOpen--;
																					}	
																			}catch(e){
																				$sName = "";
																				context.vars.slotsTaken--;
																			}
																			var s = context.createEventSlot(ts.parent().attr("id"), ts.attr("event_id"), $sName, $ra_id);
																		form.remove();
																		$( diag ).dialog( "destroy" );
																	}
															}
														});	
								
										},
											Cancel: function(){
														$( diag ).dialog( "destroy" );
											}
									},
									resizable: false,
									title: "Edit Appointment"
						});
			}else if(ts.attr("ra_id")==null | ts.attr("ra_id") == context.options.ra_id) {
				
														var updateEventUrl = document.URL + "/events/" + ts.attr("event_id") + "/update.json";
														if(ts.attr("ra_id")==null){
															event_data = {calendar_id: context.options.calendar_id, registration_ability_id: context.options.ra_id};
														}else{
															event_data = {calendar_id: context.options.calendar_id, registration_ability_id: "remove"};
														}
														$.ajax({
															type: "POST",
															url: updateEventUrl,
															data: { event : event_data },
															headers: {
																'X-CSRF-Token': context.options.csrf
															},
															success: function(data){
																		$id = data.id;

																		if(!!data.registration_ability){
																			$e = $("<div class='ui-advising-calendar-error'/>");
																			$e.text(data.registration_ability.toString());
																			context.displayMessage("Error", $e);
																		}
																		else{
																			try{
																				$sName = data.user.last_name + ", " + data.user.first_name;
	$ra_id = data.registration_ability_id;

																				context.vars.slotsOpen--;
																			}catch(e){
																				$sName = "";
																				$ra_id = null;
																				context.vars.slotsTaken--;
																			}
																			var s = context.createEventSlot(ts.parent().attr("id"), ts.attr("event_id"), $sName, $ra_id);
																}
															}
														});	

			}


		},
	
		//Generating a 'bin' for slots within the hour
		_generateHourlyEventSlots: function(d) {
			startHour = this.options.startHour;
			endHour = this.options.endHour;
			$hours = $( '<div class="ui-advising-calendar-daily-event-container">' );
			for(var hour = startHour; hour < endHour + 1; hour++){
				$hourSlot = $( '<div class="ui-advising-calendar-hourly-event-slot ui-advising-calendar-slot-height">' );
				$minuteSlots = this._generateIndividualSlots(d, hour)
					.appendTo($hourSlot);
				$hours.append($hourSlot);
			}
			return $hours;
		},
		
			//Generating Time slot row
		_generateTimeSlots: function(calendarTimeRow){
			var $header, $slots;

			startHour = this.options.startHour
			endHour = this.options.endHour;

			$header = $( '<div id="ui-advising-calendar-time-header"> ')
				.appendTo(calendarTimeRow);

			for(var currentHour = startHour; currentHour<endHour+1;currentHour++){
				$currTimeSlot = $( '<div class="ui-advising-calendar-hour-slot ui-advising-calendar-slot-height">' )
					.appendTo(calendarTimeRow);
				$currTimeSlotText = this._generateTimeText(currentHour)
					.appendTo($currTimeSlot);
			}
		},

		//Method will generate the text for hour
		_generateTimeText: function(hour){
			//Geting number of hour
			$hourText = $( '<span class="ui-advising-calendar-hour">' ).text(this._amOrPm(hour, 1));
			//Getting am or pm variable
			$amPmText = $( '<span class="ui-advising-calendar-ampm">' ).text(this._amOrPm(hour, 2));
			$hourText.append($amPmText);
			$hourSlot = $( '<div class="ui-advising-calendar-hour-container">' ).append($hourText);
			
			return $hourSlot;
		},

		//Method will generate the rows of the calendar with the specified dates
		_generateCalendarHeader: function(calTable){
			currStartDate = this.options.startDate;
			numOfDays = this.options.daysToShow;
			//Adding time row to the table

			var header = $( '<tr id="ui-advising-calendar-header-row">' );
			var days = $( '<tr id="ui-advising-calendar-data-row">' );

			header.append($( '<th class="ui-advising-calendar-time-header">' ));
			days.append($( '<td class="ui-advising-calendar-times">' ));

			for(var i = 0; i<numOfDays + 1; i++){
				$dayText = this._getDayToString(i);
				if(this._isWeekendOrHoliday(i)){
				//Adding day header to the calendar
					$dayHeader = $( '<th class="ui-advising-calendar-disabled">');
					$dayRow = $( '<td class="ui-advising-calendar-disabled">');

				}else{
					//Adding day header to the calendar
					$dayHeader = $( '<th class="ui-advising-calendar-day">');
					$dayRow = $( '<td class="ui-advising-calendar-day">');
				}
				
				$dayHeader.html($dayText);
				$dayHeader.appendTo(header);
				days.append($dayRow);
			}
			header.appendTo(calTable);

			return days;

		},

		_getDateFromMilliseconds: function(milliseconds){
			var d = new Date(parseInt(milliseconds, 10));
			return(this._getDateName(d.getUTCDay(), 0) + ", " + this._getDateName(d.getUTCMonth(), 1) + " " + d.getUTCDate() + " " + this._amOrPm(d.getUTCHours(), 1) + ":" + (d.getUTCMinutes()==0?"00":d.getUTCMinutes()) + " " + this._amOrPm(d.getUTCHours(), 2));
		},

		_getDateFromMillisecondsTable: function(milliseconds){
			var d = new Date(parseInt(milliseconds, 10));
			return("<span style='visibility:hidden;z-index:100;float:right;'>" + milliseconds + "</span>" + this._getDateName(d.getUTCDay(), 0) + ", " + this._getDateName(d.getUTCMonth(), 1) + " " + d.getUTCDate() + " " + this._amOrPm(d.getUTCHours(), 1) + ":" + (d.getUTCMinutes()==0?"00":d.getUTCMinutes()) + " " + this._amOrPm(d.getUTCHours(), 2));
		},
		_isWeekendOrHoliday: function(day){
			var d = this._getDay(day);
			if (d.getDay() == 0 || d.getDay() == 6){
				return true;
			}
		},
		
		_getDayToString: function (day){
			var d = this._getDay(day);
			var dayVar = 0, monthVar = 1;
			return this._getDateName(d.getDay(), dayVar)+ " " +(d.getDate()) + " " + this._getDateName(d.getMonth(), monthVar);
		},

		//get day given the offset and the options.startDate
		_getDay: function(day){
			var sD = this.options.startDate;
			var d = new Date(sD.getFullYear(), sD.getMonth(), sD.getDate()+day);
			return d;
		},

		_addTimeId: function(d, h, minute){
			//Adjust from UTC to EST
		//	h -= this.options.EST_TIME;

			var minHour = 60, msMin = 60000;
			var hourMs = h*minHour*msMin;
			var secMs = minute*msMin;
			return d+hourMs+secMs;
		},

		_getDateName: function (number, type){
			//types
			var dayName = 0, monthName = 1;
			//Days = 0
			//Months = 1
			if(type == dayName){
				switch(number){
					case 0: return 'Sun';
					case 1: return 'Mon';
					case 2: return 'Tue';
					case 3: return 'Wed';
					case 4: return 'Thu';
					case 5: return 'Fri';
					case 6: return 'Sat';
				}
			}else if(type == monthName){
				switch(number){
					case 0: return 'Jan';
					case 1: return 'Feb';
					case 2: return 'Mar';
					case 3: return 'Apr';
					case 4: return 'May';
					case 5: return 'Jun';
					case 6: return 'Jul';
					case 7: return 'Aug';
					case 8: return 'Sep';
					case 9: return 'Oct';
					case 10: return 'Nov';
					case 11: return 'Dec';
				}
			}
		},


		_amOrPm: function(hour, type){
			var string = "";
			if(type == 1){
				if(hour <=12 ){
					string = string.concat(hour.toString());
				}else{
					string = string.concat((hour - 12).toString());
				}
			}else{
				if(hour<12){
					string = string.concat(' AM');
				}else{
					string = string.concat(' PM');
				}
			}
			return string;
		},

		displayMessage: function (tit,msg,klass){
			diag = this.vars.dialog;
			diag.html("");
			msg.appendTo(diag);
			diag.dialog({
								modal: true,
								width: 600,
								buttons: {
									Ok: function() {
										diag.html("");
										$( this ).dialog( "destroy" );
									}
								},
								resizable: false,
								title: tit,
								dialogClass: klass
				})
		}

  });
	
}( jQuery ) );
	


