class ShiftTradesController < ApplicationController
  # GET /shift_trades
  # GET /shift_trades.xml
  def index
    @shift_trades = ShiftTrade.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @shift_trades }
    end
  end

  # GET /shift_trades/1
  # GET /shift_trades/1.xml
  def show
    @shift_trade = ShiftTrade.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @shift_trade }
    end
  end

  # GET /shift_trades/new
  # GET /shift_trades/new.xml
  def new
    @shift_trade = ShiftTrade.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @shift_trade }
    end
  end

  # GET /shift_trades/1/edit
  def edit
    @shift_trade = ShiftTrade.find(params[:id])
  end

  # POST /shift_trades
  # POST /shift_trades.xml
  def create
    @shift_trade = ShiftTrade.new(params[:shift_trade])

    respond_to do |format|
      if @shift_trade.save
        flash[:notice] = 'ShiftTrade was successfully created.'
        format.html { redirect_to(@shift_trade) }
        format.xml  { render :xml => @shift_trade, :status => :created, :location => @shift_trade }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @shift_trade.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /shift_trades/1
  # PUT /shift_trades/1.xml
  def update
    @shift_trade = ShiftTrade.find(params[:id])

    respond_to do |format|
      if @shift_trade.update_attributes(params[:shift_trade])
        flash[:notice] = 'ShiftTrade was successfully updated.'
        format.html { redirect_to(@shift_trade) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @shift_trade.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /shift_trades/1
  # DELETE /shift_trades/1.xml
  def destroy
    @shift_trade = ShiftTrade.find(params[:id])
    @shift_trade.destroy

    respond_to do |format|
      format.html { redirect_to(shift_trades_url) }
      format.xml  { head :ok }
    end
  end
end
