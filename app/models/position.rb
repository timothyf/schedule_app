class Position < ActiveRecord::Base
  
  belongs_to :store
  
  has_many :employees
  has_many :schedules
  has_many :position_thresholds
  
end
