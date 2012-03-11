class AddEditableToCalendar < ActiveRecord::Migration
  def change
    add_column :calendars, :advisor_editable, :boolean, :default => false

  end
end
