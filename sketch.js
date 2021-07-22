//Create variables here
var dogImg, dogHappyImg, feed;
var database, foodS, foodStock;
var dog, fedTime, lastFed, foodObj;

function preload() {
  dogHappyImg = loadImage ("images/dogImg1.png");
  dogImg = loadImage ("images/dogImg.png");
}

function setup() {
	createCanvas(1500, 750);
  foodObj = new Food();
  database = firebase.database();
  foodStock = database.ref("Food");
  foodStock.on("value",readStock);

  dog = createSprite(1200, 500, 10, 60);

  dog.scale = 0.4;

  feed = createButton ("Feed The Dog");
  feed.position(1000, 100);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(900,100);
  addFood.mousePressed(addFoods, dog.addImage(dogImg));
}

function draw() {
  background (46, 139, 87);
    textSize(20);
    fill("White");
    text("Food Remaining: "+foodS, 1100, 300);
    foodObj.display();

    fedTime = database.ref('FeedTime');
    fedTime.on("value", function (data){
    lastFed = data.val();
    })

    fill("White");
    textSize(15);
    if (lastFed >= 12){
      text("Last Feed: " + lastFed %12 + "PM", 1000, 30);
    }
    else if(lastFed == 0){
      text("Last Feed: 12AM", 350, 30);
    }
    else{
      text("Last Feed: " + lastFed + "AM", 1000, 30)
    }

    drawSprites();

    if (foodS > 10){
      foodS=10;
    }
    if (foodS < 0){
      foodS=0;
    }
    
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
dog.addImage(dogHappyImg);

foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
Food: foodObj.getFoodStock(),
FeedTime : hour()
})
}

function addFoods(){
dog.addImage(dogImg);
foodS++;
database.ref('/').update({
Food: foodS
})
}