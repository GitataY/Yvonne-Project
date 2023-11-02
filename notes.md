# 1. why do we need an async wrapper?----------------------------------------------------------------------

There is repetition of async await in many different parts of our controller.
pseudocode:
why?
const asyncWrappper = (fn)=>{
return async(req,res,next){
try {
await fn(req,res,next);
}
catch(error){
next(error)
}

    }

}

# 2. why and how to build a custom error handler?-----------------------------------------------------------------------

writing a separate error for every single controller leads to bugs.
how we do it? Build a single error handler like
const errorHandler = (err,req,res, next)=>{
return res.status(400).json({msg:err})
}
how to forward the errors?
inside controller:
const error = new Error();
error.status = 404;
error.message = "item not found"
return next(error,message)

# 3. What is the need of creating a custom error handler for every route when we can just extend a custom error from Error

// EXTEND A CLASS FIRST
class CustomError extends Error {
constructor(message,statusCode){
super(message);
this.statuscode = statusCode;
}
}
const customErrorHandler = (message,statusCode)=>{
return new CustomError(message,statusCode)
}
Inside the controller-----------------------

return next(customErrorHandler("product Not found",400));

inside error handler---------------------
if(err instance of CustomError){
return res.status(err.status).json({msg:err.msg})
}

# 4. CASTING ERRORS--------------------------------------------------

There needs to be a way of handling a cast error. e.g trying to fetch a product id that is written wrong.

# 5. How to sort data in express?

first use the sort key word and use an example end point like
"/api/v1/sort-by-name?sort=name"
eg. let result = Products.find()

## sort || fields

if(sort){
const sortList = req.query.sort.split(",").join(" ");
result = result.sort(sortList);
}

# 6. IMPLEMENTING PAGINATION

MAIN THING TO UNDERSTAND
how many products do I have? 50 (product number);
how many pages do I want?(whatever amount);
how many products do I need per page?(limit)
page p having a limit of l
let skip = (p-1)\*l;

# 7.ADDING FILTERS

what is there to understand?
mongo does not understand common operators(>,<...)?It has its own language.
what are the Gotchas?
Get a query from req from e.g numericFilters.
const queryObject = {};

1. replace the common operators with mongo operators. eg.
   const operatorMap = {
   ">": "$gt",
      ">=": "$gte",
   "=": "$eq",
      "<": "$lt",
   "<=": "$lte",
   };
2. come up with a regex that checks for all the operators
   const regEx = /\b(<|>|>=|=|<|<=)\b/g;

3. Replace them with operators
   let filters = numericFilters.replace(regex, (member)=>`-${operatorMap[member]}`);
4. Come up with options for all numeric filters then build a query object with values obtained from filter
   const options = ["price"];
   filters.split(",").forEach(item=>{
   const [field,operator,value] = item.split("-");
   queryObject[field] = {[operator]:[value]}
   })
   const products = await Products.find({category:category},...queryObject);

# 8 HANDLING AUTHENTIFICATION

basics of authentification

1. We want only authorized users to access our app.
2. We set up a database with a user + credentials.
3. Everything happens on log in.

- ------------- we check whether the e.g email and password are correctly put :-
  await Users.findOne({email:email,password:password},
  function(err,user){
  if(error) throw new Error(err)
  if(user){
  res.status(201).json({
  success:true,
  token:jwt.sign({email:user.email,username:user.userName,\_id:user.\_id},process.env.JWT_SECRET,{expiresIn:"30d"})
  })
  }
  })

# 9 Explain authentification to me like a baby;

1. I want to get into Old Trafford. First for me to meet the stars ill need a pass. This means
   ill need to be in the list of guests. This means ill give out my details at the gate, theyll
   check whether ive payed then they will give me the pass which will be verified at the gate.
2. First ill need to use an email & password to login
   const logIn = async (req,res)=>{
   const {email,password} = req.body;
   try {
   await Users.findOne({
   email:email,
   password:password
   }).then((user)=>{
   if(user){
   res.json({
   success:true,
   token: jwt.sign({email:user.email,userName:user.userName},process.env.JWT_SECRET,{expiresIn:"30d"})
   })
   }
   })

}
catch (error){
throw new Error(error)
}

} 3. const dashboard = async(req,res)=>{
const {email,userName} = req.user;
res.json({
success:true,
data:{
email,userName
}
})

} 4. middleware
const authMiddle = (req,res,next)={
const authHeader = req.headers.Authorization;
if(!authHeader || !authHeader.startsWith("Bearer ")){
throw new Error("header not found")
}
const token = authHeader.split(" ").[1]
try {
const decode = jwt.verify(token,process.env.JWT_SECRET);
const {email,userName} = decode;
req.user = {email,userName};
next()
}
catch(error){
throw new Error(error)
}
}
router.route("/auth/dashboard").get(authMiddle,dashboard)

# 10 MONGOOSE SCHEMA METHODS AND BCRYPT

1. bcrypt is used to encrypt our password;

## basic setup

const {email,password} = req.body;
const = await bcrypt.genSalt(10);
cons hashedPswd = await bcrypt.hash(password,)

## using schema

userSchema.methods.pre("save", async function(){
const salt = await bcrypt.gensalt(10);
this.password = await bcrypt.hash(this.password,salt)
return this.password
})
///basically means that before the password is pushed to the DB it must pass through the hashing phase

## SCHEMA METHODS

userSchema.methods.createJWT = function(){
const token = jwt.sign({userId:this.\_userId, userName:this.userName, email:this.email})
}
userSchema.methods.comparePasswords =async function(userPassword){
const pswdBool = await bcrypt.compare(userPassword,this.password);
return pswdBool
}

# 11. SECURITY PACKAGES

- API Security 101. We need to secure our server from all kinds of attacks.
- Packages: HELMET, CORS, XSS, rate limiter.
-
