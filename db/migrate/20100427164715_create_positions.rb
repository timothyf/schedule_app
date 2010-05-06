class CreatePositions < ActiveRecord::Migration
  def self.up
    create_table :positions do |t|
      t.string :name
      t.references :store
      t.integer :open_time
      t.integer :close_time
      t.timestamps
    end
  end

  def self.down
    drop_table :positions
  end
end
