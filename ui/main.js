//Submit Useranme/ password to login
var submit = document.getElementById('submit_btn');
submit.onclick = function(){
    
    //Create a Request Object
    var request = new XMLHttpRequest();
    
    //Capture the Response and store it ina variable    
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE) {
            //Take some action
            if(request.status ===200) {
                alert('Logged in Successfully');
            }
            else if(request.status === 403) {
                alert('Username/Password Incorrect');
            }
            else if(request.status === 500) {
                alert('Something went Wrong on the Server!');
            }
            
        }
        //Not done yet
    };
    //Make the Request
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST', 'http://arnold4.imad.hasura-app.io/login', true);
    request.setRequestHeader('Content-Type', 'applcation/json');
    request.send(JSON.stringify({username: username, password: password}));
};
