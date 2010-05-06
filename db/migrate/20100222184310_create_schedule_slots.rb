class CreateScheduleSlots < ActiveRecord::Migration
  def self.up
    create_table :schedule_slots do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :schedule_slots
  end
end
