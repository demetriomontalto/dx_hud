$(document).ready(function () {
  HealthIndicator = new ProgressBar.Circle("#HealthIndicator", {
    color: "rgb(0, 255, 100)",
    trailColor: "rgb(35,35,35)",
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  ArmorIndicator = new ProgressBar.Circle("#ArmorIndicator", {
    color: "rgb(0, 140, 255)",
    trailColor: "rgb(35,35,35)",
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  HungerIndicator = new ProgressBar.Circle("#HungerIndicator", {
    color: "rgb(255, 164, 59)",
    trailColor: "rgb(35,35,35)",
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  ThirstIndicator = new ProgressBar.Circle("#ThirstIndicator", {
    color: "rgb(0, 140, 170)",
    trailColor: "rgb(35,35,35)",
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  StressIndicator = new ProgressBar.Circle("#StressIndicator", {
    color: "rgb(255, 74, 104)",
    trailColor: "rgb(35,35,35)",
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  OxygenIndicator = new ProgressBar.Circle("#OxygenIndicator", {
    color: "rgb(0, 140, 255)",
    trailColor: "rgb(35,35,35)",
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  SpeedIndicator = new ProgressBar.Circle("#SpeedIndicator", {
    color: "rgb(255, 255, 255)",
    trailColor: "rgb(35,35,35)",
    strokeWidth: 10,
    trailWidth: 10,
    duration: 250,
    easing: "easeInOut",
  });

  FuelIndicator = new ProgressBar.Circle("#FuelIndicator", {
    color: "rgba(222, 222, 222, 1)",
    trailColor: "rgba(184, 184, 184, 0.082)",
    strokeWidth: 8,
    duration: 250,
    trailWidth: 8,
    easing: "easeInOut",
  });

  VoiceIndicator = new ProgressBar.Circle("#VoiceIndicator", {
    color: "#4a4a4a",
    trailColor: "rgb(35,35,35)",
    strokeWidth: 12,
    trailWidth: 12,
    duration: 250,
    easing: "easeInOut",
  });

  VoiceIndicator.animate(0.33);
});

window.addEventListener("message", function (event) {
  let data = event.data;

  if (data.action == "update_hud") {
    HealthIndicator.animate(data.hp / 100);
    ArmorIndicator.animate(data.armor / 100);
    HungerIndicator.animate(data.hunger / 100);
    ThirstIndicator.animate(data.thirst / 100);
    StressIndicator.animate(data.stress / 100);
    OxygenIndicator.animate(data.oxygen / 100);
    FuelIndicator.animate(data.fuel / 100);
  }

  // Get current voice level and animate path
  if (data.action == "voice_level") {
    switch (data.voicelevel) {
      case 1:
        data.voicelevel = 33;
        break;
      case 2:
        data.voicelevel = 66;
        break;
      case 3:
        data.voicelevel = 100;
        break;
      default:
        data.voicelevel = 33;
        break;
    }
    VoiceIndicator.animate(data.voicelevel / 100);
  }

  if (data.connection == false) {
    $("#VoiceIcon").removeClass("fa-microphone");
    $("#VoiceIcon").addClass("fa-times");
  } else if(data.connection == true) {
    $("#VoiceIcon").removeClass("fa-times");
    if (data.radio == true) {
      $("#VoiceIcon").removeClass("fa-microphone");
      $("#VoiceIcon").addClass("fa-headset");
    } else if (data.radio == false) {
      $("#VoiceIcon").removeClass("fa-headset");
      $("#VoiceIcon").addClass("fa-microphone");
    }
  }

  if (data.talking == 1) {
    VoiceIndicator.path.setAttribute("stroke", "yellow");
  } else if (data.talking == false) {
    VoiceIndicator.path.setAttribute("stroke", "darkgrey");
  }

  if (data.speed > 0) {
    let multiplier = data.maxspeed * 0.1;
    let SpeedLimit = data.maxspeed + multiplier;
    SpeedIndicator.animate(data.speed / SpeedLimit);
    $("#SpeedIcon").removeClass("fa-tachometer-alt");
    $("#SpeedIcon").text(data.speed);
  } else if (data.speed == 0) {
    SpeedIndicator.animate(0);
    $("#SpeedIcon").addClass("fa-tachometer-alt");
    $("#SpeedIcon").text("");
  }

  if (data.action == "disable_stress") {
    $("#StressIndicator").hide();
  }

  if (data.action == "disable_voice") {
    $("#VoiceIndicator").hide();
  }

  if (data.showOxygen == true) {
    $("#OxygenIndicator").fadeIn();
  } else if (data.showOxygen == false) {
    $("#OxygenIndicator").fadeOut();
  }

  if (data.showSpeedo == true) {
    $("#SpeedIndicator").fadeIn();
  } else if (data.showSpeedo == false) {
    $("#SpeedIndicator").fadeOut();
  }

  // Hide armor if 0
  if (data.armor == 0) {
    $("#ArmorIndicator").fadeOut();
  } else if (data.armor > 0) {
    $("#ArmorIndicator").fadeIn();
  }

  if (data.hp < 0) {
    HealthIndicator.animate(0);
    HealthIndicator.trail.setAttribute("stroke", "red");
    $("#HealthIcon").removeClass("fa-heart");
    $("#HealthIcon").addClass("fa-skull");
  } else if (data.hp > 0) {
    HealthIndicator.trail.setAttribute("stroke", "rgb(39,39,39)");
    $("#HealthIcon").removeClass("fa-skull");
    $("#HealthIcon").addClass("fa-heart");
  }


  if (data.thirst < 25) {
    $("#ThirstIcon").toggleClass("flash");
  }

  if (data.hunger < 25) {
    $("#HungerIcon").toggleClass("flash");
  }

  if (data.oxygen < 50) {
    $("#OxygenIcon").toggleClass("flash");
  }

  if (data.stress > 75) {
    $("#StressIcon").toggleClass("flash");
  }

  if (data.fuel < 0.2) {
    FuelIndicator.path.setAttribute("stroke", "red");
  } else if (data.fuel > 0.2) {
    FuelIndicator.path.setAttribute("stroke", "white");
  }

  if (data.showFuel == true) {
    $("#FuelCircle").show();
  } else if (data.showFuel == false) {
    $("#FuelCircle").hide();
  }

  if (data.showUi == true) {
    $(".container").show();
  } else if (data.showUi == false) {
    $(".container").hide();
  }
});
