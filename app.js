//-------------VERY IMPORTANT -------------------
// DEAR FUTURE ME PLEASE READ ALL THE COMMENTS IN THIS WHOLE PROJECT VERY CAREFULLY
// BECAUSE THE WAYS TAUGHT IN THE COURSE ARE OUTDATED AND HENCE I HAD DONE MANY CHANGES TO MAKE SURE 
// IT IS UP TO DATE AND WORKS AS FOR TODAY SO DO NOT COMPLETELY DEPEND ON THE VIDEOS IN THE COURSE
// READ THE COMMENTS LINE BY LINE VERY CAREFULLY I HAVE TRIED MY BEST TO EXPLAIN EVERYTHING IN DETAIL 
// fOR DEPLOYING THE APP THROUGH HEROKU PLEASE WATCH THE VIDEO AS IT STILL IS VERY RELEVANT 
// THE ONLY CHANGES ARE IN PROCESS OF CREATING PROCFILE AND NAMING OUR GIT REPOSITORY AS MAIN ABOUT WHICH I
// HAVE WRITTEN IN DETAIL AT LINE 171 AND BELOW (END OF THE CODE) PLEASE READ IT
// ALSO THERE WILL BE AN IMAGE IN THIS DIRECTORY CALLED AS CHANGES TO BE MADE IN PROCFILE LOOK AT IT HOPEFULLY
// IT WILL HELP YOU TO UNDERSTAND WHAT HAS BEEN DONE AND WHY IT HAS BEEN DONE, WELL ACTUALLY THAT WILL NOT EXPLAIN YOU WHY YOU
// HAVE DONE IT, IT WILL ONLY TELL YOU WHAT TO DO SO ILL EXPLAIN WHY IT HAD TO BE DONE JUST BECAUSE TODAY I CAN
// ACTUALLY AS THE VIDEO IS OLD AND BACK THEN THE PROCFILE USE TO HAVE WEB: NODE AND FILENAME 
// SO PROCFILE WOULD CONTAIN WEB: NODE APP.JS BUT NOW THEY HAVE CHNAGED IT SO THAT PROCFILE WILL HAVE 
// WEB: NPM START AND HENCE WE NEED TO ADD START OBJECT IN SCRIPT OBJECT IN PACKAGE.JSON AND INITIALIZE IT
// WITH NODE APP.JS ------> THIS EXPLAINS WHY YOU DID THOSE SPECIFC CHANGES TO PROCFILE NOW PLEASE READ THE LAST COMMENT
// FOR MORE UNDERSTANDING AND IF YOU MANAGE TO RUN THIS CODE AND UNDERSTAND WHAT IS HAPPENING AND WHY IS IT 
// HAPPENING PLEASE APPRECIATE YOUR PAST SELF IE ME FOR TAKING OUT TIME AND MAKING THE EFFORTS TO WRITE THESE
// COMMENTS AND IF IN CASE YOU DON'T UNDERSTAND WHAT IS HAPPENING EVEN AFTER READING ALL THESE COMMENTS 
// THEN DON'T HATE ME BECAUSE I TIRED MY BEST MAYBE YOU'RE NOT AS SMART AS YOU USED TO BE 
// PEACE OUT 
const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");  
require('dotenv').config()

const app=express();

app.use(bodyParser.urlencoded({extended:true}));//enables express to parse url encoded body ie data from html form
// extended true is used to parse the nested json object 
app.use(express.static("public"));//the images and css files added to our html have local addresses
//hence they are static page in our local machine and we are trying to pull them up as our servere response 
//and thus it will not render
//for solving this problem we need to use a special express function static to keep a static folder
//in static folder we will put all the local files so that they can be rendered 
//the address to these files in html will be provided in the way as we are currently inside the public folder
//and are navigating to these files
// when the files were outside the public folder address looked like
//href="styles.css" now it is changed to href="css/styles.css (we created a folder named css inside public folder from our side)
//the address of image folder is not changed because even if we navigate from the public folder
//the address to images will be images/newsletter1.png

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});



app.post("/",function(req,res){
    const firstname=req.body.fname;
    const lastname=req.body.lname;
    const email=req.body.mail;
    const api_key=process.env.API_KEY;
    const audience_id=process.env.AUDIENCE_ID;
    // THE MAIL CHIMP SERVER EXPECTS DATA FROM US IN FOR OF STRINGIFIED JSON HENCE WE NEED TO MAKE A 
    // DATA OBJECT THEN STRINGIFY IT
    // THE DATA OBJECT CREATED HERE IS COMPLETELY BASED ON MAIL CHIMP DOCUMENTATION 
    // IF WE WANT TO POST DATA TO THEIR API WE NEED TO MAKE SURE THE DATA IS IN THIS PARTICULAR FORMAT
    // THE DATA OBJECT WILL CONTAIN AN ELEMENT MEMBER WHICH IS AN ARRAY OF OBJECTS 
    // MEMEBER WILL HAVE ELEMENTS AS EMAIL_ADDRESS ,STATUS AND ANOTHER OBJECT CALLED MERGE_FIELDS
    // THE MERGE_FIELDS OBJECT WILL CONTAIN ELEMENTS SUCH AS FNAME LNAME TO STORE THE FIRST NAME 
    // AND THE LAST NAME OF THE CLIENT THAT IS POSTED TO OUR SERVER VIA FORM FROM SIGNUP.HTML 
    
    const data={
        members:[
            {
                email_address : email,
                status :"subscribed",
                merge_fields :{
                    FNAME :firstname,
                    LNAME :lastname,
                }
            }
        ]
    };
    

    const jsonData=JSON.stringify(data);


    //NOW HERE WE WILL HAVE TO SEND OUR REQUEST TO MAIL CHIMP API BUT UNLIKE OPEN WEATHER API 
    //HERE WE WILL NOT SEND A GET REQUEST HERE WE WILL HAVE TO SEND A POST REQUEST TO THE 
    //MAIL CHIMP API HENCE WE WILL NEED A NODE.JS INBUILT FUNCTION CALLED AS HTTTPS.REQUEST
    //HTTPS.REQUEST TAKES 3 PARAMETERS -> URL ,OPTIONS & CALLBACK FUNCTION
    //URL TAKES THE URL OF THE API (STRING)
    //OPTION IS A OBJECT THAT HAS DIFFERENT ELEMENTS IN IT HERE IN OUR CASE WE HAVE TO SEND 
    //OUR REQUEST TO MAIL CHIMP SERVER WHICH HAS URL THAT MUST HAVE AUDIENCE ID ALSO REFERRED
    //TO AS LIST ID IN MAIL CHIMPS DOCUMENTATION NEXT WE NEED TWO MORE THINGS THE BASIC HTTPS
    //AUTHENTICATION AND MAKE A POST REQUEST TO SEREVER, THESE TWO THINGS WIIL BE SPECIFIED
    //IN OUR OPTIONS PARAMETER OF OUR HTTPS.REQUEST FUNCTION WHICH IS A OBJECT ITSELF 
    //THE CALL BACK FUNCTION WILL RECEIVE A RESPONSE AND HENCE WILL HAVE A RESPONSE AS ITS PARAMETER
    //THESE RESPONSE IS WHERE WE WILL RECIEVE THE CONFIRMATION THAT OUR DATA IS POSTED AND HAS BEEN LOGGED
    //TO OUR MAILCHIMP AUDIENCE DATA DASHBOARD 


    //https://<dc>.api.mailchimp.com/3.0/ this is the main api adddress and this is where we have to make
    //changes in our url <dc> here stands for data centers the mail chimp server has over 20 servers 
    //they host them to one of them randomly hence we have to specify our data center that will be provided 
    //in the api key given to us in my case it is us9 
    //also at the end of url we will have to specify the route we want to take in our case we are adding
    //subscribers to our news letter hence the route for us provided in api documentation is 
    // lists/{list id} (here it stands for the audience id given to us by mailchimp)
    //source where to find the documentation is here ->(https://mailchimp.com/developer/marketing/api/lists/)
    // refer to the batch subscribe or unsubscribe section


    const url="https://us9.api.mailchimp.com/3.0/lists/"+audience_id;

    // now we have to create a option object with authenticattion id and sending post request
    
    const options={
        method:"POST",
        auth :"priyanshu1:"+api_key
        // the api doumentation for authentication from mail chimp tells to use basic https authentication
        // hence we use auth which is element of the options object 
        // mail chimp asks to write any username in my case priyanshu1 followed by the : and authentiation ID
        // source-> (https://mailchimp.com/developer/marketing/docs/fundamentals/#connecting-to-the-api)
        //look in the authenticate with api key or OAuth2 token
    };


    //uptill here we have created our url option now we will use them to send our request to mail chimop
    //api which in turn will send a response which we will log in form of JSON
    //we have created a request but now we need to send the data along with the request we want to make 
    //to the mail chimp server otherwise what will it store to our auidence dashboard ??  
    //for this we will have to store ou request in a constant then use a method called .write while passing
    // our data as its parameter it will look like request.write(jsonData);
    //to send our request source for the documentation-> (https://nodejs.org/api/https.html#httpsrequesturl-options-callback)
    const request=https.request(url,options,function(response){
        response.on("data",function(data){
            if (response.statusCode===200){
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html");
            }
        });
    });
    
    request.write(jsonData);
    request.end();// used to specify the end of our request

    // UPTILL HERE WE HAVE MADE IT SO THAT IF SOMEONE TRYS TO SIGN IN THROUGH OUR NEWS LETTER SIGN IN PAGE 
    // THEIR INFORMATION GETS ADDED TO OUR MAILCHIMP AUDIENCE DASHBOARD BUT THERE IS STILL A PROBLEM AS
    // AFTER SUCCESFULLY SUBSCRIBING TO OUR NEWS LETTER OUR WEBSITE JUSTS HANGS AND DOES NOT DISPLAY ANY SUCCESS
    // MESSAGE HENCE WE NEED TO CREATE A SUCCESS AND FAILURE PAGE FOR DISPLAYING THE MESASGE AND ADD IT TO OUR
    // POST REQUEST 
    // FOR THIS PURPOSE WE WILL GO BACK TO LINE 111 THAT HAS FUNCTION HTTPS.REQUEST
    // & NOW WE WILL CHECK FOR STATUS CODE RETURNED BY RESPONSE FROM SERVER BY USING RESPONSE.STATUSCODE
    // IF STATUS CODE RETURNED WAS 200 WE WILL DISPLAY SUCCESS.HTML OTHERWISE FAILURE.HTML
});


//HERE WE ARE CREATING A REDIRECT ROUTE FOR OUR FAILURE.HTML PAGE SO THAT IF THERE IS A FAILURE 
//WHILE SUBSCRIBING TO OUR NEWSLETTER IT REDIRECTS THE USER TO OUR SIGNUP PAGE AGAIN 
app.post("/failure",function(req,res){
    res.redirect("/");
});



//AS HERE WE WILL BE HOSTING OUR SERVER ON HEROKU WE CANNOT LISTEN ON PORT 3000 AS HEROKU WILL
//HOST IT ON SOME DIFFERENT PORT SO FOR THAT WE NEED TO USE PROCESS.ENV.PORT WHICH IS A HEROKU COMMAND
//IT ALLOWS HEROKU TO HOST THE WEBSITE ON THEIR DEFINED SERVER ALSO WE CAN LISTEN TO PORT 3000 LOCALLY 
//BY USING OR ||



app.listen(process.env.PORT || 3000,function(){
    console.log("server is running at port 3000");
});

//12bcfafc003fcb836bcb5ba70a0d3fbf-us9 (api key)(disabled)
//audience id:-

//We need to create a procfile because heroku uses procfile to run the code on the server 
//in the heroku file we have written web :npm start to specify from where heroku should start deploying
//thus in package .json we have specifid a start element in script object where we have written node app.js
//to specify which file to open 
//also to deploy the app by heroku we need to write git push heroku main or master in commandline hence we need to add this
//name to our repository main or master for this purpose we used git branch -m main to name it main and thus
//we can execute git push heroku main in our command line to deploy our page on live server 