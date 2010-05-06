class AdminDashboardController < ApplicationController
  
  
  # Show the admin dashboard home page
  def index
    @employee = Employee.find(params[:employee_id])
    @store = @employee.store
  end
  
  
end
