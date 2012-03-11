class ChangeStarttimeFromEvents < ActiveRecord::Migration
  def up
		change_table :events do |t|
			t.change :starttime, :integer
		end
  end

  def down
  end
end
