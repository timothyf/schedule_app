class CreateEmployeePositions < ActiveRecord::Migration
  def self.up
    create_table :employee_positions do |t|
      t.references :employee
      t.references :position
      t.references :role
      t.timestamps
    end
  end

  def self.down
    drop_table :employee_positions
  end
end
