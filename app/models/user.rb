class User < ActiveRecord::Base
  
  
  has_many :employees  # 1 employee record per store
  has_many :stores, :through => :employees
  has_many :announcements
  
  
end
