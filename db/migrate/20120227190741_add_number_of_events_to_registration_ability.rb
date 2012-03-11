class AddNumberOfEventsToRegistrationAbility < ActiveRecord::Migration
  def change
    add_column :calendars_users, :number_of_events, :integer, :default => 1
  end
end
