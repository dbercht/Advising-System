class AdvisorsController < UsersController
	load_and_authorize_resource

	def new
	end

	def create
		if request.post? && params[:file].present?
			Advisor.delete_all
			data = params[:file].read

			err = []
			n = 0
			past_advisor = ""
			arr = []
			#Finding if all advisors are present
	    CSV.parse(data) do |row|
				unless (n == 0)
					@a = Advisor.create(:last_name => row[0].to_s.strip, :first_name => row[1].strip, :email => row[2].strip, :password => 'advising_system', :password_confirmation => 'advising_system')
				end
				n = n+1
			end
		end
		render :text => params.to_json#arr.join("<br />")
	end

  def show
    @advisor = Advisor.find(params[:id], :include => :calendars)
		@calendars = @advisor.advising_periods
  end

	def index
		@users = Advisor.all
		render 'users/index'
	end
end
