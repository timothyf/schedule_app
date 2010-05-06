class SuperUserDashboardController < ApplicationController
  
  
  # Show the super user dashboard home page
  def index
    @user = User.find(params[:user_id])
    @stores = Store.find(:all)
  end
  
  
end
