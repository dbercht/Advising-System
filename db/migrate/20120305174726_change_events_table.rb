class ChangeEventsTable < ActiveRecord::Migration
  def change
		change_table :events do |t|
		  t.rename :user_id, :registration_ability_id
		end
	end
end
