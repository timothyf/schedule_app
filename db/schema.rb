# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100427164953) do

  create_table "announcements", :force => true do |t|
    t.text     "message"
    t.boolean  "emergency"
    t.integer  "user_id"
    t.integer  "store_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "availabilities", :force => true do |t|
    t.integer  "employee_id"
    t.string   "day"
    t.time     "start_time"
    t.time     "end_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "employee_positions", :force => true do |t|
    t.integer  "employee_id"
    t.integer  "position_id"
    t.integer  "role_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "employee_roles", :force => true do |t|
    t.integer  "employee_id"
    t.integer  "role_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "employees", :force => true do |t|
    t.integer  "user_id"
    t.integer  "store_id"
    t.boolean  "full_time"
    t.integer  "target_hours"
    t.string   "employeeid"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "invites", :force => true do |t|
    t.integer  "employee_id"
    t.integer  "invitee"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "position_thresholds", :force => true do |t|
    t.integer  "position_id"
    t.integer  "target_hours"
    t.string   "day"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "positions", :force => true do |t|
    t.string   "name"
    t.integer  "store_id"
    t.integer  "open_time"
    t.integer  "close_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "schedule_requests", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "schedule_slots", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "schedules", :force => true do |t|
    t.integer  "week_number"
    t.integer  "position_id"
    t.boolean  "published"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "shift_trades", :force => true do |t|
    t.integer  "shift_id"
    t.integer  "receiver_id"
    t.boolean  "approved"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "shifts", :force => true do |t|
    t.datetime "start_time"
    t.datetime "end_time"
    t.integer  "employee_id"
    t.integer  "schedule_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stores", :force => true do |t|
    t.string   "name"
    t.string   "address_1"
    t.string   "address_2"
    t.string   "city"
    t.string   "state"
    t.string   "zip"
    t.string   "phone"
    t.string   "url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "timeoff_requests", :force => true do |t|
    t.date     "requested_date"
    t.integer  "employee_id"
    t.boolean  "approved"
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email",                             :null => false
    t.string   "login",                             :null => false
    t.string   "phone_cell"
    t.string   "phone_home"
    t.string   "preferred_contact"
    t.boolean  "active"
    t.string   "crypted_password",                  :null => false
    t.string   "password_salt",                     :null => false
    t.string   "persistence_token",                 :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "login_count",        :default => 0, :null => false
    t.integer  "failed_login_count", :default => 0, :null => false
    t.datetime "last_request_at"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.string   "current_login_ip"
    t.string   "last_login_ip"
  end

end
