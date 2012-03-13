class Ability
  include CanCan::Ability


  def initialize(user)

		user ||= User.new
		if user.role.nil?
			user.type = 'Student'
		elsif user.role?(:admin)
			can :manage, :all
		elsif user.role?(:advisor)
			can :create, RegistrationAbility
			can :manage, Calendar, :advisor_id => user.id, :advisor_editable => true
			can :read, Calendar, :advisor_id => user.id
			can :manage, RegistrationAbility, :calendar_id => user.calendar_ids

			can :manage, Event, :calendar_id => user.calendar_ids

			can :manage, User, :id => user.id
			cannot :index, User

			can :manage, Advisor, :id => user.id
			cannot :index, Advisor


		elsif user.role?(:student)
			can :read, Calendar, :id => user.open_calendar_ids
	
			can :read, Event, :calendar_id => user.open_calendar_ids
			can :update, Event, :id => user.editable_slot_ids

			can :read, User, :id => user.id
			cannot [:index, :new, :create], User

			can :manage, Student, :id => user.id
			cannot [:index, :new, :create], Student
		end
  end
end
