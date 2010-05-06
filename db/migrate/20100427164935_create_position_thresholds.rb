class CreatePositionThresholds < ActiveRecord::Migration
  def self.up
    create_table :position_thresholds do |t|
      t.references :position
      t.integer :target_hours
      t.string :day
      t.timestamps
    end
  end

  def self.down
    drop_table :position_thresholds
  end
end
