dojo.addOnLoad(function() {
	// Have to move this so that it is only done once
	// currently its being done everytime dlg is displayed causing multiple events to fire
	var button = dijit.byId("shift_submit_btn");
	dojo.connect(button, "onClick", function(event) {
	    //Stop the submit event since we want to control form submission.
	    event.preventDefault();
	    event.stopPropagation();
		save_shift(emp_id, shiftday);
	});
});

function create_shift(id, day) {
	emp_id = id;
	shiftday = day;
	shiftDlg = dijit.byId("shift_dlg");
	shiftDlg.show();
	

}

function save_shift(id, day) {
	var st = document.getElementById('start_time');
	var et = document.getElementById('end_time');
	shiftDlg.hide();
	create_shift_display(id, day, st.value, et.value);	
}
	
function create_shift_display(id, day, start_time, end_time) {
	var shiftDiv = document.createElement('div');
	shiftDiv.className = 'shift';
	shiftDiv.setAttribute('id','shift_' + id + '_' + day);
	
	var start_span = document.createElement('span');
	start_span.className = 'start_time';
	
	var end_span = document.createElement('span');
	end_span.className = 'end_time';
	
	var start_time_nd = document.createTextNode(start_time);
	var end_time_nd = document.createTextNode(end_time);
	
	start_span.appendChild(start_time_nd);
	end_span.appendChild(end_time_nd);
	shiftDiv.appendChild(start_span);
	shiftDiv.appendChild(end_span);
	
	var slotPos = document.getElementById('slot_' + id + '_' + day);
	slotPos.appendChild(shiftDiv);
}
