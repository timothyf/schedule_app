class CreateEmployeeRoles < ActiveRecord::Migration
  def self.up
    create_table :employee_roles do |t|
      t.references :employee
      t.references :role
      t.timestamps
    end
  end

  def self.down
    drop_table :employee_roles
  end
end
