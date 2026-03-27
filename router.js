const express=require("express");
const multer = require("multer");
const {v4: uuidv4} = require("uuid");
const router = express.Router();
const regschema = require("./model/registerSchema");
const conschema = require("./model/contactSchema");
const packschema = require("./model/packageSchema");
router.get('/', function(req,res)
{
    res.render("index");
})

router.get('/about', function(req,res){
    res.render("about");
})

router.get('/about', function(req,res)
{
    res.render("about");
})

router.get('/login', function(req,res)
{
    res.render("loginPage");
})

router.post('/login', async(req,res)=>{
    var email = req.body.email,
    pass = req.body.pass;

    try{
        const user = await regschema.findOne({email:email});

        console.log(user);

        if(!user){
            res.redirect("/login")
        }
        user.comparePassword(pass,(error, match) => {
            if(!match) {
                res.redirect("/login");
            }
        });

        req.session.user = user;
        
        
        res.redirect("/dashboard");
    }
    catch(error){
        console.log(error);
    }
});

router.get('/contactUs', function(req,res)
{
    res.render("contactUs");
})
router.get('/packages', async (req, res) => {
    try {
        const packdata = await packschema.find({});
        res.render('Packages', {packdata: packdata})
        console.log(packdata);
    } catch (err) {
        console.log(err);
    }
});


router.get('/registration', function(req,res)
{
    res.render("registration.ejs");
})





router.get('/dashboard', async (req,res)=>{   
    try{
        if (req.session.user && req.cookies.user_sid) {
        res.render("dashboard/index");
    }
    else {
        res.redirect("/login");
    }
    }catch(err){
        console.log(err);
    }

    
})

router.get('/addPackage', function(req,res)
{
     try{
        if (req.session.user && req.cookies.user_sid) {
        res.render("dashboard/addPackage");
    }
    else {
        res.redirect("/login");
    }
    }catch(err){
        console.log(err);
    }

    
})

router.post('/register' , (req,res) => {
    var register = {
        username: req.body.username,
        email: req.body.email,
        country: req.body.country,
        phone: req.body.phone,
        pass: req.body.pass
    };
    var regpost = regschema(register);
    regpost.save()
        .then(() =>
        res.json('registration successfully'))
        .catch((err) => res.status(400).json('error:' + err))
})
router.post('/contact' , (req,res) => {
    var contact = {
        email: req.body.email,
        phone: req.body.phone,
        query: req.body.query,
        member:req.body.member,
        concern: req.body.concern
    };
    var conpost = conschema(contact);
    conpost.save()
        .then(() =>
        res.json('Submit successfully'))
        .catch((err) => res.status(400).json('error:' + err))
})
// upload file

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null,file.originalname);
        //cb(null, uuidv4()+'-'+ Date.now() + path.extname(file.originalname))
    }
});
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}
let upload = multer({storage, fileFilter});

router.post('/package' ,upload.single('image'), (req,res) => {
    var package = {
        package: req.body.package,
        country: req.body.country,
        price: req.body.price,
        duration:req.body.duration,
        phone: req.body.phone,
        image: req.file.filename
        
    };
    var packpost = packschema(package);
    packpost.save()
        .then(() =>
        res.redirect("/viewPackage"))
        .catch((err) => res.status(400).json('error:' + err))
})

router.get('/viewregister', async (req, res) => {
    try {
        const regdata = await regschema.find({});
        if (req.session.user && req.cookies.user_sid){
            res.render('dashboard/viewRegister', {regdata: regdata})
            console.log(regdata);
        }
         else {
        res.redirect("/login");
        }
        } catch (err) {
        console.log(err);
        }
});

router.get('/viewcontact', async (req, res) => {
    try {
        const regdatas = await conschema.find({});
         if (req.session.user && req.cookies.user_sid){
            res.render('dashboard/viewContact', {regdatas: regdatas})
            console.log(regdatas);
         }
          else {
        res.redirect("/login");
        }
        }catch (err) {
        console.log(err);
        }
});


router.get('/viewpackage', async (req, res) => {
    try {
        const packdata = await packschema.find({});
         if (req.session.user && req.cookies.user_sid){
            res.render('dashboard/viewPackage', {packdata: packdata})
            console.log(packdata);
         }
         else {
        res.redirect("/login");
        }
        }catch (err) {
        console.log(err);
        }
});

// Delete API
router.get("/delete/:id", async (req,res)=>{
    try {
        const registerdata = await regschema.findByIdAndDelete
        (req.params.id);

        res.redirect('/viewregister');
    } catch (err) {
                console.log(err);
    }
});

router.get('/delete2/:id', async (req,res)=>{
    try{
        const contactdata = await conschema.findByIdAndDelete
        (req.params.id);

        res.redirect("/viewcontact");
    } catch (err) {
        console.log(err);
    }
});
router.get('/delete3/:id', async (req,res)=>{
    try{
        const packagedata = await packschema.findByIdAndDelete
        (req.params.id);

        res.redirect("/viewpackage");
    } catch (err) {
        console.log(err);
    }
});



router.get('/edit/:id', async (req, res) => {
    try {
        const regdata = await regschema.findById(req.params.id);
        res.render('dashboard/registrationEdit', {regdata: regdata})
        console.log(regdata);
    } catch (error) {
        console.log(err);
    }
});

router.post('/edit/:id', async (req,res)=>{
    const itemId = req.params.id;
    const updatedData ={
        username:req.body.username,
        email:req.body.email,
        country:req.body.country,
        phone:req.body.phone,
        pass:req.body.pass
    }

    try{
        const updatedItem = await regschema.findByIdAndUpdate(itemId, updatedData);
        if(!updatedItem) {
            return res.status(404).json({ message: 'Item not found'});
        }
        res.redirect('/viewregister');
    }catch(err) {
        res.status(500).json({ message: 'server error'});
    }
});

router.get('/edit1/:id', async (req, res) => {
    try {
        const condata = await conschema.findById(req.params.id);
        res.render('dashboard/contactEdit', {condata: condata});
        console.log(condata);
    } catch (err) {
        console.log(err);
    }
});
router.post('/edit1/:id', async (req,res)=>{
    const itemId1 = req.params.id;
    const updatedData1 ={
        email:req.body.email,
        phone:req.body.phone,
        query:req.body.query,
        member:req.body.member,
        concern:req.body.concern
    }

    try{
        const updatedItem1 = await conschema.findByIdAndUpdate(itemId1, updatedData1);
        if(!updatedItem1) {
            return res.status(404).json({ message: 'Item not found'});
        }
        res.redirect('/viewcontact');
    }catch(err) {
        res.status(500).json({ message: 'server error'});
    }
});

router.get('/view/:id', async (req, res) => {
    try {
        const packdatas = await packschema.findById(req.params.id);
        res.render('viewDetails', {packdatas: packdatas});
        console.log(packdatas);
    } catch (err) {
        console.log(err);
    }
});


//logout API

router.get("/logout", (req,res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie("user_sid");
        res.redirect("/")
    } else {
        res.redirect("/login");
    }
});





module.exports = router;

