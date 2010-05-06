class StoresController < ApplicationController

  
  # Show all stores associated with the logged in user
  def index
    user = User.find(params[:user_id])
    @stores = user.stores
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @stores }
    end
  end


  def show
    @store = Store.find(params[:id])
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @store }
    end
  end


  def new
    @store = Store.new
    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @store }
    end
  end


  def edit
    @store = Store.find(params[:id])
  end


  def create
    @store = Store.new(params[:store])
    respond_to do |format|
      if @store.save
        flash[:notice] = 'Store was successfully created.'
        format.html { redirect_to(@store) }
        format.xml  { render :xml => @store, :status => :created, :location => @store }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @store.errors, :status => :unprocessable_entity }
      end
    end
  end


  def update
    @store = Store.find(params[:id])
    respond_to do |format|
      if @store.update_attributes(params[:store])
        flash[:notice] = 'Store was successfully updated.'
        format.html { redirect_to(@store) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @store.errors, :status => :unprocessable_entity }
      end
    end
  end


  def destroy
    @store = Store.find(params[:id])
    @store.destroy
    respond_to do |format|
      format.html { redirect_to(stores_url) }
      format.xml  { head :ok }
    end
  end
  
  
end
