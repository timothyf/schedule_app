class PositionThresholdsController < ApplicationController
  # GET /position_thresholds
  # GET /position_thresholds.xml
  def index
    @position_thresholds = PositionThreshold.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @position_thresholds }
    end
  end

  # GET /position_thresholds/1
  # GET /position_thresholds/1.xml
  def show
    @position_threshold = PositionThreshold.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @position_threshold }
    end
  end

  # GET /position_thresholds/new
  # GET /position_thresholds/new.xml
  def new
    @position_threshold = PositionThreshold.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @position_threshold }
    end
  end

  # GET /position_thresholds/1/edit
  def edit
    @position_threshold = PositionThreshold.find(params[:id])
  end

  # POST /position_thresholds
  # POST /position_thresholds.xml
  def create
    @position_threshold = PositionThreshold.new(params[:position_threshold])

    respond_to do |format|
      if @position_threshold.save
        flash[:notice] = 'PositionThreshold was successfully created.'
        format.html { redirect_to(@position_threshold) }
        format.xml  { render :xml => @position_threshold, :status => :created, :location => @position_threshold }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @position_threshold.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /position_thresholds/1
  # PUT /position_thresholds/1.xml
  def update
    @position_threshold = PositionThreshold.find(params[:id])

    respond_to do |format|
      if @position_threshold.update_attributes(params[:position_threshold])
        flash[:notice] = 'PositionThreshold was successfully updated.'
        format.html { redirect_to(@position_threshold) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @position_threshold.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /position_thresholds/1
  # DELETE /position_thresholds/1.xml
  def destroy
    @position_threshold = PositionThreshold.find(params[:id])
    @position_threshold.destroy

    respond_to do |format|
      format.html { redirect_to(position_thresholds_url) }
      format.xml  { head :ok }
    end
  end
end
