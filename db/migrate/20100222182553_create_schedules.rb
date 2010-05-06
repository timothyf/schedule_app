class CreateSchedules < ActiveRecord::Migration
  def self.up
    create_table :schedules do |t|
      t.integer :week_number
      t.references :position
      t.boolean :published
      t.timestamps
    end
  end

  def self.down
    drop_table :schedules
  end
end
