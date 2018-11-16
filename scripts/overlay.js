// Overlay class file, should handle start and option screens

function createOverlay() {
  // TODO: Make these elements static in the html.
  let start = document.getElementById("start");
  let close = document.getElementById("close");
  let options = document.createElement("div");
  let submit = document.getElementById("submit");
  let choose = document.getElementById("myDropdown");
  let chooseBtn = document.getElementById("dropbtn");

  start.addEventListener("click", function(){
    document.getElementById("menu").style.display = "none";
    document.getElementsByClassName("game")[0].style.display = "block";
  });

  options.innerHTML = "Options";
  options.setAttribute("style", "cursor:pointer");
  options.addEventListener("click", function(){
    document.getElementById("options").style.display = "block";
  });

  document.getElementById("sub").appendChild(start);
  document.getElementById("sub").appendChild(options);

  // Need to add second options overlay here
  submit.addEventListener("click", handleSubmit);

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
    if(choose.style.display === "none"){
      for(let i = 0; i < localStorage.length; ++i) {
        if(localStorage.key(i) === "currentMap")
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
 
  document.getElementById("options").appendChild(close);
}

function handleSubmit() {
  // TODO: Validate the form. Ex: make sure player_pos x is not a string.
  // TODO: Fix all the input array things.
  let input = document.getElementsByName("in");
  let size = Number(input[1].value);
  let mapObjInput = input[7].value.split(";");
  let mapObjects = [];
  mapObjInput.forEach((val) => {
    if(val !== "") {
      mapObjects.push({
        x: Number(val.match(/\d+/g)[0]),
        y: Number(val.match(/\d+/g)[1]),
        name: val.match(/[a-zA-Z]+/g).join(" ")
      });
    }
  });
  let config = {
    board_size: size,
    title: input[0].value,
    player: {
      pos: {
        x: Number(input[2].value),
        y: Number(input[3].value)
      },
      energy: Number(input[4].value),
      wiffles: Number(input[5].value),
      items: input[6].value
    },
    map: {
      // FIXME: These two are redundant. Remove in the future
      height: size,
      width: size,
      objects: mapObjects 
    }
  };
  // Using stringify for formatting purposes.
  localStorage.setItem(config.title, JSON.stringify(config));
}

export default createOverlay;
