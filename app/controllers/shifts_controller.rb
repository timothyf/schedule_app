class ShiftsController < ApplicationController
  # GET /shifts
  # GET /shifts.xml
  def index
    @shifts = Shift.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @shifts }
    end
  end

  # GET /shifts/1
  # GET /shifts/1.xml
  def show
    @shift = Shift.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @shift }
    end
  end

  # GET /shifts/new
  # GET /shifts/new.xml
  def new
    @shift = Shift.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @shift }
    end
  end

  # GET /shifts/1/edit
  def edit
    @shift = Shift.find(params[:id])
  end

  # POST /shifts
  # POST /shifts.xml
  def create
    @shift = Shift.new(params[:shift])

    respond_to do |format|
      if @shift.save
        flash[:notice] = 'Shift was successfully created.'
        format.html { redirect_to(@shift) }
        format.xml  { render :xml => @shift, :status => :created, :location => @shift }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @shift.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /shifts/1
  # PUT /shifts/1.xml
  def update
    @shift = Shift.find(params[:id])

    respond_to do |format|
      if @shift.update_attributes(params[:shift])
        flash[:notice] = 'Shift was successfully updated.'
        format.html { redirect_to(@shift) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @shift.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /shifts/1
  # DELETE /shifts/1.xml
  def destroy
    @shift = Shift.find(params[:id])
    @shift.destroy

    respond_to do |format|
      format.html { redirect_to(shifts_url) }
      format.xml  { head :ok }
    end
  end
end
