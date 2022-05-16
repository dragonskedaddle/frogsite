//json conversion
var request = new XMLHttpRequest();
request.open("GET","./questions.json", false);
request.send(null);
var questions = JSON.parse(request.responseText);

//globals
let questionNumber = 1
response = {}
frogTypes = {
  1: ["pool frog","life is an adventure, and you're going to go out and live it. You're the life of the party, the office, and the office party. Or maybe they can't keep you in an office at all. Wherever you are, you're bringing your A game all the way!"],
  2: ["poison dart frog","you're beautiful but deadly. Everyone notices when you walk in the room, and you like it that way, but you also have an intimidating presence that makes them keep their distance. And they might be right to do so - you're not someone to mess with."],
  3: ["marsh frog", "you are loud and proud. You may have a more rough exterior, but on the inside, you are a big sweetheart. You may enjoy food, or being alone, and may become a bit mean when you don't have your morning coffee. All in all, you're a good person with a hard shell."],
  4: ["breviceps","a darling frog. You look very grumpy, it's true. But that's only because you're world-weary. You've seen a lot of frogs come and go, and you've even gone some places yourself. In fact, you've traversed all seven levels of hell and come back in one squishy piece. Now a days, you sit in a corner of the pond, looking like an angry water balloon, and smoke a cigarette, thinking of all the time that's gone by. And that's ok too."],
  5: ["tree frog", "you're a colorful and personable frog! You are laid back and go with the flow, but also like to try something bold and new every once in a while. Other frogs will often compliment your interesting pattern, but you're nonchalant so you say, \"Oh this? It's not much, but I hear it's becoming all the rage a few ponds over.\" You\'re a very cool frog."],
  6: ["white tree frog", "you are a very polite and cute little frog! You always hold the door for other frogs and tip your hat to the gentlemanly toads squatting near the pond. You probably have a little bow tie."]
}
let socketLink = "localhost:3000"

//frogtype calculator
function frogType(answers, callback){
  frogScore = 0
  answers = Object.values(answers)
  for (let i=0;i<answers.length;i++){
      frogScore = parseInt(frogScore) + parseInt(answers[i])
  }
  console.log(frogScore)
  if(frogScore <= 8){callback(1)}
  if(frogScore > 8 && frogScore <= 15){callback(2)}
  if(frogScore > 15 && frogScore <= 22){callback(3)}
  if(frogScore > 22 && frogScore <= 28){callback(4)}
  if(frogScore > 28 && frogScore <= 34){callback(5)}
  if(frogScore > 34 && frogScore <= 40){callback(6)}
}

//ui elements
$(document).ready(() => {
  $("#back").attr('disabled','disabled');
  $("#next").attr('disabled','disabled');
  
  $("#next").click(() => {
    //if value not submit
    if($("#next").text() != "submit"){
      //change values of question and options
      $("#question").text(`${questionNumber+1}. `+questions[questionNumber+1]["q"])
      for (let i = 1; i<5 ; i++){
        $(`#${i}`).text(`${i}. `+Object.values(questions[questionNumber+1]["a"])[i-1])
      }

      //diable next button
      $("#next").css("cursor","not-allowed")  
      $("#next").attr('disabled',true);
    }

    //emit response
    if($("#next").text()=="submit"){
      let frogScores = {}
      for(let i=1;i<=Object.keys(response).length;i++){
        frogScores[i] = Object.keys(questions[1]["a"])[parseInt(response[i])-1]
      }
      frogType(frogScores, (frog) =>{
        $("#quiz").fadeOut(callback=function(){
          $("#quiz").css("display","none")
          $("#results").css("display","flex")
          $("#result-img").attr("src",`./results/${frog}.jpg`)
          $($($(".description")[0]).children()[0]).text(`you are a ${frogTypes[frog][0]}!`)
          $($($(".description")[0]).children()[1]).text(`${frogTypes[frog][1]}`)
        })
      })
    }

    //progress bar color
    if (!(questionNumber+1 in response)){
      $("#progress-bar").css("background",`linear-gradient(to left, #9EAE98 ${Math.round(100-((questionNumber/7)*100))}%, #607762 0%)`)
      $("#progress-bar").text(`${Math.round((questionNumber/7)*100)}%`)
    }

    //tries to hover over previously selected element 
    $($(`#${response[questionNumber+1]}`).parent()[0]).addClass("option-selected")
    $($(`#${response[questionNumber+1]}`).parent()[0]).click()


    questionNumber = questionNumber + 1
    if (questionNumber == 7){
      $("#next").text("submit")
    }

    //enables back button if not question 1 
    if(questionNumber!=1){
      $("#back").css("cursor","auto")  
      $("#back").removeAttr('disabled');
    }

    $(".option-selected").removeClass("option-selected")
  })

  $("#back").click(() => {
    //change values of question and options
    $("#question").text(`${questionNumber-1}. `+questions[questionNumber-1]["q"])
    for (let i = 1; i<5 ; i++){
      $(`#${i}`).text(`${i}. `+Object.values(questions[questionNumber-1]["a"])[i-1])
    }

    //removes selcted option
    $(".option-selected").removeClass("option-selected")
    //searches response and assigns switches to previously selected option
    $($(`#${response[questionNumber-1]}`).parent()[0]).addClass("option-selected")
    //decrements question number
    questionNumber = questionNumber - 1

    //enables next button
    $("#next").css("cursor","auto")  
    $("#next").removeAttr('disabled');

    //changes value of next button 
    if(questionNumber!=7){
      $("#next").text("next")
    }

    //disables back button if question is 1 
    if(questionNumber==1){
      $("#back").css("cursor","not-allowed")  
      $("#back").attr('disabled',true);
    }
  })

  $(".option").click(function(){
    //changes style of option when selected 
    $(".option-selected").removeClass("option-selected")
    $(this).addClass("option-selected")
    
    //enables next button when option is selected
    $("#next").css("cursor","auto")  
    $("#next").removeAttr('disabled');

    //adds option to response
    response[questionNumber] = $(".option-selected").children()[0].id
  })
});

