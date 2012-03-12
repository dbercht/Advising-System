require 'csv'

class AdvisorsController < UsersController
	load_and_authorize_resource

	def new
	end

	def create
		if request.post? && params[:file].present?
			Advisor.destroy_all
			data = params[:file].read
			pw = params[:password]
			err = []
			n = 0
			past_advisor = ""
			arr = []
			#Finding if all advisors are present
	    CSV.parse(data) do |row|
				unless (n == 0)
					@a = Advisor.create(:last_name => row[0].to_s.strip, :first_name => row[1].strip, :email => row[2].strip, :password => p, :password_confirmation => p)
				end
				n = n+1
			end
		end
		redirect_to root_url, :alert => "Successfully added advisors"
	end

  def show
    @advisor = Advisor.find(params[:id], :include => :calendars)
		@calendars = @advisor.advising_periods.includes(:events).order('events.starttime')
		@events = Event.joins('INNER JOIN calendars on calendars.id = events.calendar_id').where('calendars.advisor_id = ? AND events.registration_ability_id IS NOT NULL', @advisor.id).order('events.starttime').joins('INNER JOIN calendars_users ON events.registration_ability_id = calendars_users.id').joins('INNER JOIN users ON calendars_users.user_id = users.id')
  end

	def index
		@users = Advisor.all
		render 'users/index'
	end
end
