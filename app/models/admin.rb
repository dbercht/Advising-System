class Admin < User

	def to_title
		return ["Admin", email].join(", ")
	end
end
