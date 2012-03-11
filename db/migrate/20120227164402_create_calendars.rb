class CreateCalendars < ActiveRecord::Migration
  def change
    create_table :calendars do |t|
      t.date :start_date
      t.date :end_date
			t.integer :advisor_id

      t.timestamps
    end

		create_table :calendars_users, :id => false do |t|
			t.integer :calendar_id
			t.integer :user_id
		end
  end
end
