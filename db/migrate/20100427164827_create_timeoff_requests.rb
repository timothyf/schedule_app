class CreateTimeoffRequests < ActiveRecord::Migration
  def self.up
    create_table :timeoff_requests do |t|
      t.date :requested_date
      t.references :employee
      t.boolean :approved
      t.datetime :start_time
      t.datetime :end_time
      t.timestamps
    end
  end

  def self.down
    drop_table :timeoff_requests
  end
end
