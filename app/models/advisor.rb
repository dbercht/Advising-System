class Advisor < User
	has_many :calendars, :dependent => :destroy
	has_many :advising_periods, :class_name => "Calendar", :foreign_key => 'advisor_id', :conditions => ["end_date >= NOW()"], :order => :start_date

	has_many :events, :through => :calendars

	def to_title
		return "Prof. " << last_name
	end
end
