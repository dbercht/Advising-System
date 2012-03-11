class Calendar < ActiveRecord::Base
	belongs_to :advisor

	has_many :events, :select => [:starttime, :id, :registration_ability_id], :include => [:user], :dependent => :delete_all
	has_many :registration_abilities, :include=>[:events, :user, :calendar], :dependent => :delete_all
	has_many :users, :through => :registration_abilities

	validates :start_date, :presence => true
	validates :end_date, :presence => true
	validates :title, :presence => true

	validate :end_date_after_start_date

	def end_date_after_start_date
	  if self.end_date && (self.end_date <= self.start_date)	
	    self.errors.add(:end_date, "must be after start date.")
 	 end
	end

	#Returning all users in the calendar regardless if they have events or not.
	def users_and_events
		results = ActiveRecord::Base.connection.execute("SELECT users.email, events.id, events.starttime, calendars_users.number_of_events FROM calendars_users INNER JOIN users ON calendars_users.user_id = users.id LEFT OUTER JOIN events ON calendars_users.id = events.registration_ability_id WHERE calendars_users.calendar_id = #{id} ORDER BY users.id")
		return results
	end

	def c_title
		if title.nil?
			advisor.to_title << " " << start_date
		else
			advisor.to_title << " - " << title
		end
	end

	def date_range
		return [start_date.strftime("%A %B %e, %Y"), end_date.strftime("%A %B %e, %Y")].join(" - ")
	end

end
