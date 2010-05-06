require 'test_helper'

class TimeoffRequestsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:timeoff_requests)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create timeoff_request" do
    assert_difference('TimeoffRequest.count') do
      post :create, :timeoff_request => { }
    end

    assert_redirected_to timeoff_request_path(assigns(:timeoff_request))
  end

  test "should show timeoff_request" do
    get :show, :id => timeoff_requests(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => timeoff_requests(:one).to_param
    assert_response :success
  end

  test "should update timeoff_request" do
    put :update, :id => timeoff_requests(:one).to_param, :timeoff_request => { }
    assert_redirected_to timeoff_request_path(assigns(:timeoff_request))
  end

  test "should destroy timeoff_request" do
    assert_difference('TimeoffRequest.count', -1) do
      delete :destroy, :id => timeoff_requests(:one).to_param
    end

    assert_redirected_to timeoff_requests_path
  end
end
