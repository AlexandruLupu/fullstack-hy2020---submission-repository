const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// Get all

usersRouter.get("/", async (request, response) => {
	const users = await User.find({}).populate("blogs", {
		url: 1,
		title: 1,
		author: 1,
		id: 1,
	});
	response.json(users);
});

usersRouter.get("/:id", async (request, response) => {
	const user = await User.findById(request.params.id);
	if (user) {
		response.json(user);
	} else {
		response.status(204).end();
	}
});

// Post
usersRouter.post("/", async (request, response) => {
	const body = request.body;

	if (body.password.length <= 2) {
		return response
			.status(400)
			.json({ error: "password must be at least 3 characters long" });
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(body.password, saltRounds);

	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash,
	});

	const savedUser = await user.save();

	response.json(savedUser);
});

module.exports = usersRouter;
