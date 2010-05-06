class CreateInvites < ActiveRecord::Migration
  def self.up
    create_table :invites do |t|
      t.references :employee
      t.integer :invitee  # the user id of a user being invited
      t.timestamps
    end
  end

  def self.down
    drop_table :invites
  end
end
