class RegistrationAbility < ActiveRecord::Base
	self.table_name = 'calendars_users'

  before_save :default_values

	belongs_to :user
	belongs_to :calendar
	has_many :events
	before_destroy { |record| events.each do |e| e.update_attribute(:registration_ability_id, nil) end   }

 	def editable_slots
		@s = events.count
		@n = number_of_events
    if @s < @n
			return calendar.events.where("registration_ability_id IS NULL OR registration_ability_id = ?", id)
		else
			return events
		end
  end

	def editable_slot_ids
		editable_slots.map{|s| s.id}
	end

  def default_values
    self.number_of_events ||= 1
  end
  

#	def self.find(user_id, calendar_id)
#		all(:conditions => {:user_id => user_id, :calendar_id => calendar_id}).first
#	end

#	def destroy
#		RegistrationAbility.connection.execute("DELETE FROM `calendars_users` WHERE `calendars_users`.`user_id` = #{user_id} AND `calendars_users`.`calendar_id` = #{calendar_id} ")
#	end

#	def update_attributes(params = {})
#		RegistrationAbility.connection.execute("UPDATE `calendars_users` SET `number_of_events` =  #{params[:number_of_events]} WHERE `calendars_users`.`user_id` = #{user_id} AND `calendars_users`.`calendar_id` = #{calendar_id} ")
#		true
#	end
end
