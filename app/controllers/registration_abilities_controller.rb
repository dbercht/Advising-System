class RegistrationAbilitiesController < ApplicationController
	load_and_authorize_resource :calendar
	load_and_authorize_resource :registration_ability

	def index
		@calendar = Calendar.find(params[:calendar_id])

		@registration_ability = @calendar.registration_abilities.build
		@registration_abilities = @calendar.registration_abilities(:include => [:user])
		respond_to do |format|
			format.json do render :json => @registration_abilities.order('users.last_name').as_json(:include => [:user, :events]) end
			format.html do 
				@students = Student.all(:order => 'last_name') - @calendar.users
				render "index" 
				end
		end
	end

	def new
		@advisor = User.find(params[:advisor_id])
		@advising_period = Calendar.find(params[:calendar_id])
		@registration_ability = RegistrationAbility.new
	end

	def create

		@advisor = User.find(params[:advisor_id])
		@advising_period = Calendar.find(params[:calendar_id])
		@registration_ability = @advising_period.registration_abilities.build(params[:registration_ability])

		if @registration_ability.save
				redirect_to advisor_calendar_registration_abilities_path(current_user, @advising_period)
		else
			render action: 'new'
		end
	end

	def edit
		@advisor = User.find(params[:advisor_id])
		@advising_period = Calendar.find(params[:calendar_id])
		@registration_ability = RegistrationAbility.find(params[:id])
	end

	def update
		@advisor = User.find(params[:advisor_id])
		@advising_period = Calendar.find(params[:calendar_id])
		@registration_ability = RegistrationAbility.find(params[:id])
		if @registration_ability.update_attributes(params[:registration_ability])
				redirect_to advisor_calendar_registration_abilities_path(params[:advisor_id], @advising_period)
		else
			render action: 'edit'
		end
	end


	def destroy
		@advisor = User.find(params[:advisor_id])
		@advising_period = Calendar.find(params[:calendar_id])
		@registration_ability = RegistrationAbility.find(params[:id])
		@registration_ability.delete
		redirect_to advisor_calendar_registration_abilities_path(@advisor, @advising_period)
	end
end
