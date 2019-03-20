navigator.serviceWorker
  .register("sw.js")
  .then(reg => console.log("SW registered!", reg))
  .catch(err => console.log("Boo!", err));

fetch("https://cmgt.hr.nl:8000/api/projects/")
  .then(resp => resp.json()) // Transform the data into json
  .then(function(data) {
    console.log(data);

    for (let i = 0; i < data.projects.length; i++) {
      const element = data.projects[i];

      let author = data.projects[i].author;
      let description = data.projects[i].description;
      let img = "https://cmgt.hr.nl:8000/" + data.projects[i].headerImage;

      AppendObject(author, description, img);
    }
  });

(function() {
  "use strict";

  //check for support
  if (!("indexedDB" in window)) {
    console.log("This browser doesn't support IndexedDB");
    return;
  }

  console.log("im running");

  var dbPromise = idb.open("pwa-indexDB", 1);
})();


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
