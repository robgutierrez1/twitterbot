void setup() {
  size(640, 360);
  background(190);
  for(int i = 0; i < 100000; i++) {
    float x = random(width);
    float y = random(height);
    float c = random(20, 255);
    float b = random(100, 255);
    noStroke();
    fill(c, 0, b, 100);
    rect(x, y, 16, 16);
  }
  save("output.png");
  exit();
}