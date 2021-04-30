const btn = document.querySelector('.search');
const input = document.querySelector('.user-input');

const users = document.querySelector('.users');
const modalBody= document.querySelector('.modal-img');

const spinner = '<div class="spinner-border" role="status"></div>';

const API_ROOT = 'https://api.github.com';

function sendRequest(path="",cb, isArray=true){
  cb(true);
  const http = new XMLHttpRequest();
  http.open('GET', API_ROOT + path);
  http.withCredentials = false;
  http.send();
  
  http.onreadystatechange = function(){
    if(http.readyState ===4){
      if(isArray){
         cb(false,JSON.parse(http.response));
        }else{
          cb(false,JSON.parse(http.response).items);
        }
    }
  }
}

sendRequest('/users', displayUsers);


function displayUsers(isLoading=false,data=[]){
  
  users.innerHTML = '';
  
  if(isLoading){
    users.insertAdjacentHTML('beforeend',spinner);
  }else 
  if(data.length){
    
    data.forEach(function(user,index){
      
        var html = '<div class="col-md-3 col-sm-6">'+
        '<div class="card">'+
          '<img src="%img%" data-index="%index%" data-bs-toggle="modal" data-bs-target="#myModal" alt="" class="card-img-top">'+
          '<div class="card-body">'+
            '<h4 class="card-title">%username%</h4>'+
            '<small class="text-muted">Type: %type%</small><hr>'+
            '<a target="_blank" href="%link%" class="btn btn-dark">See portfolio</a>'+
          '</div>'+
        '</div>'+
      '</div>';    
      
      html = html.replace('%img%',user.avatar_url);
      html = html.replace('%username%',user.login);
      html = html.replace('%type%',user.type);
      html = html.replace('%link%',user.html_url);
      html = html.replace('%index%',index);
      
      users.insertAdjacentHTML('beforeend',html);
      
      const img = users.querySelector('img[data-index="' + index + '"]');
      
      img.addEventListener('click',function(){
        sendRequest('/users/'+user.login,displaySingle);
      });
    });
    
  }
}

function displaySingle(isLoading="false",data={}){
  
  modalBody.innerHTML = '';
  
  if(isLoading){
    modalBody.insertAdjacentHTML('beforeend',spinner);
  }else 
  if(Object.keys(data).length){
    
    var rasm =  '<div class="col-md-4">'+
      '<img class="w-100" src="%img%" alt="">'+
    '</div>'+
    '<div class="col-md-8">'+
       '<h4 class="card-title">User name: %username%</h4>'+
       '<h4 class="card-title">User id: %id% </h4>'+
       '<small class="text-muted">Type: %type%</small><br>'+
       '<small class="text-muted">Following: %following%</small><br>'+
       '<small class="text-muted">Followers: %followers%</small><br>'+
       '<small class="text-muted">Loaction: %location%</small>'+
    '</div>';
    
    rasm = rasm.replace('%img%',data.avatar_url);
    rasm = rasm.replace('%username%',data.login);
    rasm = rasm.replace('%id%',data.id);
    rasm = rasm.replace('%type%',data.type);
    rasm = rasm.replace('%following%',data.following);
    rasm = rasm.replace('%followers%',data.followers);
    rasm = rasm.replace('%location%',data.location);
    
    modalBody.insertAdjacentHTML('beforeend',rasm);
  }
  
  
}

btn.addEventListener('click',function(){
  sendRequest('/search/users?q='+input.value, displayUsers, false);
});

