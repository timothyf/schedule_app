class EmployeePosition < ActiveRecord::Base
  
  belongs_to :employee
  belongs_to :position
  
end
