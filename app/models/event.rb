class Event < ActiveRecord::Base
	before_save :validate_number_of_events

	belongs_to :calendar
	belongs_to :registration_ability
	has_one :user, :through => :registration_ability

	validates_uniqueness_of :starttime, :scope => :calendar_id

	def validate_number_of_events
		if (registration_ability_id == registration_ability) || (registration_ability.events.count < registration_ability.number_of_events)
			return true
		else
			errors.add(:registration_ability, "Reached the maximum limit of events for user. Either delete other events or ask the calendar administrator to allow #{registration_ability.user.email} to create more events.")
			return false
		end
	end

	def after_now?
		if((Time.at(starttime.to_i/1000)+5.hours) > (Time.now))
			return true
		end
	end
	
	def event_starttime
		return (Time.at(starttime.to_i/1000)+5.hours).strftime("%l:%M %P on %a %b %e, %Y")
	end

end
