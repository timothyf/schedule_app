class EmployeeRolesController < ApplicationController
  # GET /employee_roles
  # GET /employee_roles.xml
  def index
    @employee_roles = EmployeeRole.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @employee_roles }
    end
  end

  # GET /employee_roles/1
  # GET /employee_roles/1.xml
  def show
    @employee_role = EmployeeRole.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @employee_role }
    end
  end

  # GET /employee_roles/new
  # GET /employee_roles/new.xml
  def new
    @employee_role = EmployeeRole.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @employee_role }
    end
  end

  # GET /employee_roles/1/edit
  def edit
    @employee_role = EmployeeRole.find(params[:id])
  end

  # POST /employee_roles
  # POST /employee_roles.xml
  def create
    @employee_role = EmployeeRole.new(params[:employee_role])

    respond_to do |format|
      if @employee_role.save
        flash[:notice] = 'EmployeeRole was successfully created.'
        format.html { redirect_to(@employee_role) }
        format.xml  { render :xml => @employee_role, :status => :created, :location => @employee_role }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @employee_role.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /employee_roles/1
  # PUT /employee_roles/1.xml
  def update
    @employee_role = EmployeeRole.find(params[:id])

    respond_to do |format|
      if @employee_role.update_attributes(params[:employee_role])
        flash[:notice] = 'EmployeeRole was successfully updated.'
        format.html { redirect_to(@employee_role) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @employee_role.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /employee_roles/1
  # DELETE /employee_roles/1.xml
  def destroy
    @employee_role = EmployeeRole.find(params[:id])
    @employee_role.destroy

    respond_to do |format|
      format.html { redirect_to(employee_roles_url) }
      format.xml  { head :ok }
    end
  end
end
