class CreateShifts < ActiveRecord::Migration
  def self.up
    create_table :shifts do |t|
      t.datetime :start_time
      t.datetime :end_time
      t.references :employee
      t.references :schedule
      t.timestamps
    end
  end

  def self.down
    drop_table :shifts
  end
end
