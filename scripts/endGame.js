

export function winGame() {
  let theEnd = document.createElement("div");
  let over  = document.createElement("div");
  let again = document.createElement("div");
  let end = document.getElementById("end");

  theEnd.innerHTML = "You just found the jewels! YOU WIN!";
  over.innerHTML = "Congratulations!";
  again.innerHTML = "Click anywhere to reload.";

  end.style.display = "block";
  end.appendChild(theEnd);
  end.appendChild(over);
  end.appendChild(again);
  end.innerHTML = "You have run out of energy.\n\nGame Over.";


  end.addEventListener("mousedown", function() {
    location.reload();
  });
}

export function loseGame() {
  let theEnd = document.createElement("div");
  let over  = document.createElement("div");
  let again = document.createElement("div");
  let end = document.createElement("div");
  end.setAttribute("id", "end");
  
  // TODO: Use createTextNode
  theEnd.createTextNode("You have run out of energy.");
  over.createTextNode("Game Over.");
  again.createTextNode("Click anywhere to reload.");

  end.appendChild(theEnd);
  end.appendChild(over);
  end.appendChild(again);


  end.addEventListener("mousedown", function() {
    document.getElementById("end").style.display = "none";
    document.getElementById("menu").style.display = "block";
  });
}