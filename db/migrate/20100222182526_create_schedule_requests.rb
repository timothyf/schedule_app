class CreateScheduleRequests < ActiveRecord::Migration
  def self.up
    create_table :schedule_requests do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :schedule_requests
  end
end
