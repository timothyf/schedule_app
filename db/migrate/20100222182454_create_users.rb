class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :login
      t.string :phone_cell
      t.string :phone_home
      t.string :preferred_contact
      t.boolean :active
      t.timestamps
    end
  end

  def self.down
    drop_table :users
  end
end
