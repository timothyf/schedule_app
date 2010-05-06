require 'test_helper'

class ShiftTradesControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:shift_trades)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create shift_trade" do
    assert_difference('ShiftTrade.count') do
      post :create, :shift_trade => { }
    end

    assert_redirected_to shift_trade_path(assigns(:shift_trade))
  end

  test "should show shift_trade" do
    get :show, :id => shift_trades(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => shift_trades(:one).to_param
    assert_response :success
  end

  test "should update shift_trade" do
    put :update, :id => shift_trades(:one).to_param, :shift_trade => { }
    assert_redirected_to shift_trade_path(assigns(:shift_trade))
  end

  test "should destroy shift_trade" do
    assert_difference('ShiftTrade.count', -1) do
      delete :destroy, :id => shift_trades(:one).to_param
    end

    assert_redirected_to shift_trades_path
  end
end
