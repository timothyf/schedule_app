class Announcement < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :store
  
end
