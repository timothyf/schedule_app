class EmployeePositionsController < ApplicationController
  # GET /employee_positions
  # GET /employee_positions.xml
  def index
    @employee_positions = EmployeePosition.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @employee_positions }
    end
  end

  # GET /employee_positions/1
  # GET /employee_positions/1.xml
  def show
    @employee_position = EmployeePosition.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @employee_position }
    end
  end

  # GET /employee_positions/new
  # GET /employee_positions/new.xml
  def new
    @employee_position = EmployeePosition.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @employee_position }
    end
  end

  # GET /employee_positions/1/edit
  def edit
    @employee_position = EmployeePosition.find(params[:id])
  end

  # POST /employee_positions
  # POST /employee_positions.xml
  def create
    @employee_position = EmployeePosition.new(params[:employee_position])

    respond_to do |format|
      if @employee_position.save
        flash[:notice] = 'EmployeePosition was successfully created.'
        format.html { redirect_to(@employee_position) }
        format.xml  { render :xml => @employee_position, :status => :created, :location => @employee_position }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @employee_position.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /employee_positions/1
  # PUT /employee_positions/1.xml
  def update
    @employee_position = EmployeePosition.find(params[:id])

    respond_to do |format|
      if @employee_position.update_attributes(params[:employee_position])
        flash[:notice] = 'EmployeePosition was successfully updated.'
        format.html { redirect_to(@employee_position) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @employee_position.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /employee_positions/1
  # DELETE /employee_positions/1.xml
  def destroy
    @employee_position = EmployeePosition.find(params[:id])
    @employee_position.destroy

    respond_to do |format|
      format.html { redirect_to(employee_positions_url) }
      format.xml  { head :ok }
    end
  end
end
