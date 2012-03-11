class ChangeStarttimeToStringFromEvents < ActiveRecord::Migration
  def up
		change_table :events do |t|
			t.change :starttime, :string
		end
  end

  def down
  end
end
