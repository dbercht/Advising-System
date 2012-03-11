class Student < User
#	has_and_belongs_to_many :calendars, :include => :advisor, :join_table => 'calendars_users', :foreign_key => 'user_id'

	has_many :advisors, :through => :calendars

	def to_title
		return [last_name, first_name].join(", ")
	end
	
end
