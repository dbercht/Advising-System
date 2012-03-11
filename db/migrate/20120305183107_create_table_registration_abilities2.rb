class CreateTableRegistrationAbilities2 < ActiveRecord::Migration
  def change
		@ra = RegistrationAbility.all
		drop_table :calendars_users		
		create_table :calendars_users do |t|
			t.integer :calendar_id
			t.integer :user_id
			t.integer :number_of_events
		end

		@ra.each do |ra|
			RegistrationAbility.create(:user_id => ra.user_id, :calendar_id => ra.calendar_id)
		end

  end
end

