require 'test_helper'

class PositionThresholdsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:position_thresholds)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create position_threshold" do
    assert_difference('PositionThreshold.count') do
      post :create, :position_threshold => { }
    end

    assert_redirected_to position_threshold_path(assigns(:position_threshold))
  end

  test "should show position_threshold" do
    get :show, :id => position_thresholds(:one).to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => position_thresholds(:one).to_param
    assert_response :success
  end

  test "should update position_threshold" do
    put :update, :id => position_thresholds(:one).to_param, :position_threshold => { }
    assert_redirected_to position_threshold_path(assigns(:position_threshold))
  end

  test "should destroy position_threshold" do
    assert_difference('PositionThreshold.count', -1) do
      delete :destroy, :id => position_thresholds(:one).to_param
    end

    assert_redirected_to position_thresholds_path
  end
end
