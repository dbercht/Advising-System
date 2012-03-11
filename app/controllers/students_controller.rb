class StudentsController < UsersController
	load_and_authorize_resource

  def show
    @student = Student.find(params[:id], :include => :open_calendars)
		@calendars = @student.open_calendars
		@registration_abilities = @student.registration_abilities(:include => [:events, :calendar]).order('events.starttime')	
  end

	def index
		@users = Student.all

		render 'users/index'
	end
end
