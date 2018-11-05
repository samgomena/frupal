// Overlay class file, should handle start and option screens

function createOverlay() {
  // TODO: Make these elements static in the html.
  document.getElementById("end").style.display = "none";
  let start = document.createElement("div");
  let close = document.createElement("div");
  let options = document.createElement("div");
  let submit = document.createElement("input");
  let choose = document.getElementById("myDropdown");
  let chooseBtn = document.getElementById("dropbtn");

  start.innerHTML = "Start";
  start.setAttribute("style", "cursor:pointer");
  start.id = "update";
  start.addEventListener("click", function(){
    document.getElementById("menu").style.display = "none";
  });

  options.innerHTML = "Options";
  options.setAttribute("style", "cursor:pointer");
  options.addEventListener("click", function(){
    document.getElementById("options").style.display = "block";
  });

  document.getElementById("sub").appendChild(start);
  document.getElementById("sub").appendChild(options);

  // Need to add second options overlay here
  submit.value = "Create";
  submit.type = "button";
  submit.addEventListener("click", function(){
    let input = document.getElementsByName("in");
    let map  = input[0].value;
    let size  = input[1].value;
    let loc  = input[2].value;
    let energy = input[3].value;
    let money = input[4].value;
    let items = input[5].value;
    let tiles = input[6].value;
    // Using stringify for formatting purposes.
    localStorage.setItem(map, JSON.stringify([map,size,loc,energy,money,items,tiles]));
  });

  close.innerHTML = "&times";
  close.setAttribute("href", "javascript:void(0)");
  close.setAttribute("style", "position:absolute;top:0px;right:0px;cursor:pointer;");
  close.addEventListener("click", function(){
    document.getElementById("options").style.display = "none";
  });
  
  chooseBtn.setAttribute("style", "display:inline-block");
  chooseBtn.addEventListener("click", function(){
    while(choose.firstChild){
      choose.removeChild(choose.firstChild);
    }
    if(choose.style.display == "none"){
      for(let i = 0; i < localStorage.length; ++i) {
        if(localStorage.key(i) == "currentMap")
          continue;
        let mapLoad = document.createElement("a");
        mapLoad.innerHTML = localStorage.key(i);
        mapLoad.addEventListener("click", function(){
          localStorage.setItem("currentMap", localStorage.getItem(localStorage.key(i)));
          alert(localStorage.key(i) + " has been loaded.");
        });
        choose.appendChild(mapLoad);
      }
      choose.style.display = "inline-block";
    }
    else
      choose.style.display = "none";
  });
  chooseBtn.addEventListener("mouseleave", function(){
    choose.style.display = "none";
  });
 
  document.getElementById("form").appendChild(submit);
  document.getElementById("options").appendChild(close);
}

export default createOverlay;
