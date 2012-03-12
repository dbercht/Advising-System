require 'csv'

class AdvisingPeriodsController < ApplicationController
	load_and_authorize_resource :registration_ability

	def new
	end
	
	def create
		@advisors = Advisor.all
		if request.post? && params[:file].present?
			student_id_row = params[:student_id_row].to_i
			student_email_row = params[:student_email_row].to_i
			student_name_row = params[:student_name_row].to_i
			advisor_name_row = params[:advisor_name_row].to_i

			data = params[:file].read

			err = []
			n = 0
			past_advisor = ""
			arr = []
			#Finding if all advisors are present
	    CSV.parse(data) do |row|
				unless (n == 0) || (past_advisor == row[advisor_name_row])
							if(params[:advisor_reference_email])
								a = Advisor.where('email = ?', row[advisor_name_row]) 
							else
								a = Advisor.where('last_name like :last_name AND first_name like :first_name', {:last_name => row[advisor_name_row].split(" ").last, :first_name => row[advisor_name_row].split(" ").first.strip << "%" }) 
							end
					if (a.length == 0) || (a.length > 1)
	 					err << "#{row[advisor_name_row]} is not unique or non-existant in the system. #{a.map{ |k| k.first_name << ' ' << k.last_name << ' ' << k.email}.join(', ')}"
					else
						@advisors = @advisors - a
					end
	 				past_advisor = row[advisor_name_row]
				end
				n = n + 1
			end	
			#So if no errors were found, load the student data into the system
			if(err.length == 0 )
				n = 0
				past_advisor = ""
				advising_period = nil
				CSV.parse(data) do |row|
					logger.info "Parsing row #{n}"
					unless (n == 0)
						if(past_advisor != row[advisor_name_row])
							#Find advisor by email or name						
							if(params[:advisor_reference_email])
								a = Advisor.where('email = ?', row[advisor_name_row]) 
							else
								a = Advisor.where('last_name like :last_name AND first_name like :first_name', {:last_name => row[advisor_name_row].split(" ").last, :first_name => row[advisor_name_row].split(" ").first.strip << "%" }) 
							end
							a = a.first
						@start_date = Date.new(params[:start_date][:year].to_i, params[:start_date][:month].to_i, params[:start_date][:day].to_i)
						@end_date = Date.new(params[:end_date][:year].to_i, params[:end_date][:month].to_i, params[:end_date][:day].to_i)
							logger.info "Creating advising_period #{params[:start_date]} - #{params[:end_date]}"
							advising_period = a.calendars.create(:start_date => @start_date, :end_date => @end_date, :title => params[:advising_period_title])
						end
						if advising_period.nil?
							err << "#{row[student_name_row]} was not assigned to any advising period."
						else
							logger.info "Creating student"
							s = Student.where("email = ?", row[student_email_row])
							if(s.size == 0)
								logger.info "Creating student "
								s = Student.create(:email => row[student_email_row], :password => row[student_id_row], :password_confirmation => row[student_id_row],  :first_name => row[student_name_row].split(", ").last, :last_name => row[student_name_row].split(", ").first)
							else
								s = s.first
							end
							s.registration_abilities.create(:calendar_id => advising_period.id, :number_of_events => 1)
						end
		 				past_advisor = row[advisor_name_row]
					end
					n = n + 1
				end
				if(err.length > 1)
					arr = err
				end
		 	else
				arr = err
			end
			arr = err
    end
		if(err.length > 0)
			render 'new', :error => err
		else 
			redirect_to root_url, :alert => "Successfully created advising period"
		end
	end
end
