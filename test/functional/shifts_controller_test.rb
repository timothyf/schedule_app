require 'test_helper'

class ShiftsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:shifts)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create shift" do
    assert_difference('Shift.count') do
      post :create, :shift => { }
    end

    assert_redirected_to shift_path(assigns(:shift))
  end

  test "should show shift" do
    get :show, :id => shifts(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => shifts(:one).to_param
    assert_response :success
  end

  test "should update shift" do
    put :update, :id => shifts(:one).to_param, :shift => { }
    assert_redirected_to shift_path(assigns(:shift))
  end

  test "should destroy shift" do
    assert_difference('Shift.count', -1) do
      delete :destroy, :id => shifts(:one).to_param
    end

    assert_redirected_to shifts_path
  end
end
