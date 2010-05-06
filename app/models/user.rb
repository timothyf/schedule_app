class User < ActiveRecord::Base
  
  
  has_many :employees  # 1 employee record per store
  has_many :stores, :through => :employees
  has_many :announcements
  
  
  acts_as_authentic do |c|
    #c.my_config_option = my_value # for available options see documentation in: Authlogic::ActsAsAuthentic
  end # block optional
  
  
end
