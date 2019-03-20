navigator.serviceWorker
  .register("sw.js")
  .then(reg => console.log("SW registered!", reg))
  .catch(err => console.log("Boo!", err));

// Fetch function get the data!
fetch("https://cmgt.hr.nl:8000/api/projects/")
  .then(resp => resp.json()) // Transform the data into json
  .then(function(data) {
    console.log(data);

    for (let i = 0; i < data.projects.length; i++) {
      const element = data.projects[i];

      let author = data.projects[i].author;
      let description = data.projects[i].description;
      let img = "https://cmgt.hr.nl:8000/" + data.projects[i].headerImage;

      let projectID = i;

      AppendObject(author, description, img);
      addToIndexDB(projectID, author, description, img);
    }
  });

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

function addToIndexDB(projectID, author, description, img){

  let data = {
    Id: String(projectID),
    Author: String(author),
    Description: String(description),
    Img: String(img)
  };

  localforage.setItem(String(projectID), data).then(function (value) {
    console.log(value.Author);
  }).catch(function(err) {
    console.error(err);
  });

}

/* 
Localforage
*/

// var hexColors = {
//   red: 'ff0000',
//   green: '00ff00',
//   yellow: 'ffff00'
// };

// localforage.setItem('colors', hexColors).then(function (value) {
//   console.log(value.red);
// }).catch(function(err) {
//   console.error(err);
// });

// localforage.getItem('colors').then(function (value) {
//   console.log(value.red); 
// }).catch(function(err) {
//   console.error(err);
// });