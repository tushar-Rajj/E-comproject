const User=require("../Models/user")

module.exports.renderSignupForm= (req, res) => {
    res.render("users/singup.ejs")
}

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        //  After Singup we will directly log in
        req.login(registerUser, (err) => {
            if (err) {
                return next();
            }
            req.flash("success", "Welcome To Wonderlust");
            res.redirect("/listings");
        });
        // req.flash("success","Welcome To Wonderlust");
        // res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs")
}




module.exports.login= (req, res) => {
    req.flash("success", "Welcome to Wonderlust");

    // Use redirectUrl if it exists, otherwise default to "/listings"
    let redirectUrl = res.locals.redirectUrl || "/listings";

    // Clear the redirectUrl from the session after redirecting
    req.session.redirectUrl = null;

     const { username, password, role } = req.body;

    // Validate required fields
    if (!username || !password || !role) {
        req.flash('error', 'Missing credentials');
        return res.redirect('/login');
    }

    // ... other login logic ...

    // Check the selected role and redirect accordingly
    if (role === 'owner') {
        req.flash('success', 'Welcome back, owner!');
        res.redirect('/listings'); // Redirecting correctly after login
    } else {
        req.flash('success', 'Welcome back!');
        res.redirect('/listings'); // Users can also view listings
    }
    
    


    res.redirect(redirectUrl);


}

module.exports.Logout=(req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged Out ! ");
        res.redirect("/listings");
    })
}