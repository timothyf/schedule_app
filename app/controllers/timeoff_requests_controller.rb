class TimeoffRequestsController < ApplicationController
  # GET /timeoff_requests
  # GET /timeoff_requests.xml
  def index
    @timeoff_requests = TimeoffRequest.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @timeoff_requests }
    end
  end

  # GET /timeoff_requests/1
  # GET /timeoff_requests/1.xml
  def show
    @timeoff_request = TimeoffRequest.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @timeoff_request }
    end
  end

  # GET /timeoff_requests/new
  # GET /timeoff_requests/new.xml
  def new
    @timeoff_request = TimeoffRequest.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @timeoff_request }
    end
  end

  # GET /timeoff_requests/1/edit
  def edit
    @timeoff_request = TimeoffRequest.find(params[:id])
  end

  # POST /timeoff_requests
  # POST /timeoff_requests.xml
  def create
    @timeoff_request = TimeoffRequest.new(params[:timeoff_request])

    respond_to do |format|
      if @timeoff_request.save
        flash[:notice] = 'TimeoffRequest was successfully created.'
        format.html { redirect_to(@timeoff_request) }
        format.xml  { render :xml => @timeoff_request, :status => :created, :location => @timeoff_request }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @timeoff_request.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /timeoff_requests/1
  # PUT /timeoff_requests/1.xml
  def update
    @timeoff_request = TimeoffRequest.find(params[:id])

    respond_to do |format|
      if @timeoff_request.update_attributes(params[:timeoff_request])
        flash[:notice] = 'TimeoffRequest was successfully updated.'
        format.html { redirect_to(@timeoff_request) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @timeoff_request.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /timeoff_requests/1
  # DELETE /timeoff_requests/1.xml
  def destroy
    @timeoff_request = TimeoffRequest.find(params[:id])
    @timeoff_request.destroy

    respond_to do |format|
      format.html { redirect_to(timeoff_requests_url) }
      format.xml  { head :ok }
    end
  end
end
