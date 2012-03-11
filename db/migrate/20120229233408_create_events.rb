class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.datetime :starttime
      t.integer :user_id
      t.integer :calendar_id

      t.timestamps
    end
  end
end
