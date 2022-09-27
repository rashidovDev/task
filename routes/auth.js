const {Router} = require("express")
const router = Router()
const users = require("../config/users")
const uuid = require("uuid")
const bcrypt = require("bcryptjs")

router.get("/", (req,res) => {  
    res.json({message : users})
})

async function findByEmail(email) {
    const user = users.filter(user => user.email === email)
    return user[0]
}

// Login route 
router.post("/login", async (req,res) => {
    const {email, password} = req.body
    const user = await findByEmail(email)

    if(!user) {
       return res.status(400).json({message : "User is not exist"})
    }
    const isMatch = user.password === password

    if(!isMatch) {
        return res.status(400).json({message : "Password or Login is incorrect"})
    }
       
    return res.status(200).json({
        message : "You are succesfully logged in",
        user : user
    })
})

//Registeration route

router.post("/signup", async (req,res) => {
    const {email,password,confirmPassword} = req.body
    
    if(!email || !password){
        return res.status(400).json({message : "Please fill all fields"})
    }

    if (password.length < 6 || confirmPassword.length < 6) {
        return res.status(400).json({message : "Please provide at least 6 characters"})
    }

    if (password !== confirmPassword){
        return res.status(400).json({message : "Passwords don't match"})
    }
    
    // hashing password
    
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password,salt)

    const newUser = {
        id : uuid.v4(),
        email,
        passwordHash
    }

    users.push(newUser)
    return res.status(201).json({
        message : "You are succesfully registered",
        newUser
    })

})

module.exports = router
