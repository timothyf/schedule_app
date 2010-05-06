class EmployeeDashboardController < ApplicationController
  
  
  # Show the employee dashboard home page
  def index
    @employee = Employee.find(params[:employee_id])
    @announcements = Announcement.find(:all)
  end
  
  
end
