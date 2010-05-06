class CreateAvailabilities < ActiveRecord::Migration
  def self.up
    create_table :availabilities do |t|
      t.references :employee
      t.string :day
      t.time :start_time
      t.time :end_time
      t.timestamps
    end
  end

  def self.down
    drop_table :availabilities
  end
end
