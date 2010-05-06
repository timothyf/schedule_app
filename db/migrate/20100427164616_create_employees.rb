class CreateEmployees < ActiveRecord::Migration
  def self.up
    create_table :employees do |t|
      t.references :user
      t.references :store
      t.boolean :full_time
      t.integer :target_hours
      t.string :employeeid
      t.timestamps
    end
  end

  def self.down
    drop_table :employees
  end
end
