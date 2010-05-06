class Employee < ActiveRecord::Base
  
  
  belongs_to :user
  belongs_to :store
  
  has_many :roles
  has_many :employee_positions
  has_many :postions, :through => :employee_positions
  has_many :shifts
  has_many :schedules, :through => :shifts
  has_many :timeoff_requests
  has_many :availabilities
  
  
end
