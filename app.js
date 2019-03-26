let IamOnline = navigator.onLine;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function(reg) {
  
      if(reg.installing) {
        console.log('Service worker installing');
      } else if(reg.waiting) {
        console.log('Service worker installed');
      } else if(reg.active) {
        console.log('Service worker active');
      }
  
    }).catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  }

let AmIConnected = new Promise(function(resolve, reject) {
  if (IamOnline == true) {
    resolve("We are online");
  } else {
    reject("We are offline");
  }
 });

 AmIConnected.then(function(result) {
  console.log(result); 
  getFromNetwork();
}, function(err) {
  getFromCache();
});

let getFromNetwork = function() {
  fetch("https://cmgt.hr.nl:8000/api/projects/")
  .then(resp => resp.json()) // Transform the data into json
  .then(function(data) {
  
    // LocalForage put in indexDB 
    localforage
      .setItem("Projects", data)
      .then(function(value) {
      })
      .catch(function(err) {
        console.error(err);
      });
  
      // For loop to post all data in html 
    for (let i = 0; i < data.projects.length; i++) {
      const element = data.projects[i];
  
      let author = element.author;
      let description = element.description;
      let img = "https://cmgt.hr.nl:8000/" + element.headerImage;
  
      AppendObject(author, description, img);
    }});
}

let getFromCache = function() {

  localforage.getItem('Projects', function (err, data) {
    // if err is non-null, we got an error. otherwise, value is the value
    for (let i = 0; i < data.projects.length; i++) {
      const element = data.projects[i];

      let author = element.author;
      let description = element.description;

      let preIMG = String(element.headerImage);

      let img = preIMG.slice(0);
      img = "assets/" + img;

      AppendObject(author, description, img);
    }
  });
}


// Function to append object to html
function AppendObject(ProjectTitle, ProjectDescription, ProjectImage) {
  let div = document.createElement("div");
  let title = document.createElement("h2");
  let description = document.createElement("p");
  let img = document.createElement("img");

  title.innerHTML = ProjectTitle;
  description.innerHTML = ProjectDescription;
  img.src = ProjectImage;

  title.className = "projectTitle";
  description.className = "projectDescription";
  img.className = "projectImage";

  div.appendChild(title);
  div.appendChild(img);
  div.appendChild(description);

  document.getElementById("projects").appendChild(div);
}

if (IamOnline == true) {
  appendTags();
} 

function appendTags() {
  
  let div = document.createElement("div");
  let tag  = document.createElement("h2");
  tag.innerHTML = "tag";

  div.appendChild(tag);
  document.getElementById("tags").appendChild(div);
}
