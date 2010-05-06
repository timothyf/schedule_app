class CreateStores < ActiveRecord::Migration
  def self.up
    create_table :stores do |t|
      t.string :name
      t.string :address_1
      t.string :address_2
      t.string :city
      t.string :state
      t.string :zip
      t.string :phone
      t.string :url
      t.timestamps
    end
  end

  def self.down
    drop_table :stores
  end
end
