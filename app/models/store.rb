class Store < ActiveRecord::Base
  
  
  has_many :employees
  has_many :positions
  has_many :schedules, :through=>:positions
  has_many :announcements
  
  
end
