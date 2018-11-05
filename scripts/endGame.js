

function winGame() {
  let theend = document.createElement("div");
  let over  = document.createElement("div");
  let again = document.createElement("div");
  theend.innerHTML = "You just found the jewels! YOU WIN!";
  over.innerHTML = "Congratulations!";
  again.innerHTML = "Click anywhere to reload.";
  document.getElementById("end").style.display = "block";
  document.getElementById("end").appendChild(theend);
  document.getElementById("end").appendChild(over);
  document.getElementById("end").appendChild(again);
  end.innerHTML = "You have run out of energy.\n\nGame Over.";


  end.addEventListener('mousedown', function() {
    location.reload();
  });
}

function loseGame() {
  let theend = document.createElement("div");
  let over  = document.createElement("div");
  let again = document.createElement("div");
  
  theend.innerHTML = "You have run out of energy.";
  over.innerHTML = "Game Over.";
  again.innerHTML = "Click anywhere to reload.";
  document.getElementById("end").style.display = "block";
  document.getElementById("end").appendChild(theend);
  document.getElementById("end").appendChild(over);
  document.getElementById("end").appendChild(again);


  end.addEventListener('mousedown', function() {
    location.reload();
  });
}

export default loseGame;
