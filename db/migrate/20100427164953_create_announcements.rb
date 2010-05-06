class CreateAnnouncements < ActiveRecord::Migration
  def self.up
    create_table :announcements do |t|
      t.text :message
      t.boolean :emergency
      t.references :user
      t.references :store
      t.timestamps
    end
  end

  def self.down
    drop_table :announcements
  end
end
