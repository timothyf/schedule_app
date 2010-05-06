class CreateShiftTrades < ActiveRecord::Migration
  def self.up
    create_table :shift_trades do |t|
      t.references :shift
      t.integer :receiver_id
      t.boolean :approved
      t.timestamps
    end
  end

  def self.down
    drop_table :shift_trades
  end
end
