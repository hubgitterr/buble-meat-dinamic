
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var data;
var bubbles;
var years;

// Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
function preload() 
{
	data = loadTable("for-buble-int-food-meat.csv", "csv", "header");
}

function setup()
{
	// Create a canvas to fill the content div from index.html.
    var c = createCanvas(1000, 1000);
    c.parent('canvas-div');
    bubbles = [];
    
    years = [];
    
    // Iterate over the columns and add proportions
    for(var i = 5; i < data.getColumnCount(); i++)
    {
        var s = data.columns[i];
        years.push(s);
        
        var b = createButton(s);
        b.parent('year-div')
        
        b.mousePressed(function()
        {
            console.log(this.elt.innerHTML);
            var yearString = this.elt.innerHTML;
            var yearIndex = years.indexOf(yearString);
            

            
            for(var i = 0; i < bubbles.length; i++)
            {
                bubbles[i].setYear(yearIndex);
            }            
        })
    }
    
    // Iterate over the rows and add proportions
    for(var i = 0; i < data.getRowCount(); i++)
    {
        var r = data.getRow(i);
        var name = r.getString("M-One");
        
        if(name != "")
        {
            var d = [];
            
            for(var j = 0; j < years.length; j++)
            {
                var v = Number(r.get(years[j]));
                d.push(v);
                
            }

            var b = new Bubble(name, d);
            b.setYear(0);
            
            bubbles.push(b);
        }
    }

}

function draw() 
{
    background(100);
    
    push();
    textAlign(CENTER);
    translate(width/2, height/2);
    
    // for loop to draw bubbles on canvas
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].updateDirection(bubbles);
        bubbles[i].draw();
    }
    pop();
}

// This is a constructor function, it is left on purpose here, so we can see that it is possible to have it within the sketch file
// In other segments this is separated from sketch file
function Bubble(_name, _data)
{
    this.size = 20;
    this.id = getRandomID();
    this.pos = createVector(0, 0);
    this.dir = createVector(0,0);
    
    this.data = _data;
    
    this.name = _name;
    this.color = color(random(0,255), random(0,255), random(0,255));
    
    this.target_size = this.size;
    
    this.draw = function()
    {

        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
        fill(0);
        text(this.name,this.pos.x,this.pos.y);

        
        this.pos.add(this.dir);
        
        if(this.size < this.target_size)
        {
            this.size += 1;
        }
        else if(this.size > this.target_size)
        {
            this.size -= 1;
        }
                
    }
    
    this.setYear = function(year_index)
    {
        var v = this.data[year_index];
        this.target_size = map(v, 0, 3600, 5, 200);
    }
    
    this.updateDirection = function(_bubbles)
    {
        this.dir = createVector(0,0);
        
        // Iterate over the length of _bubbles, and makes them to be side by side, from one to another
        for(var i = 0; i < _bubbles.length; i++)
        {
            if(_bubbles[i].id != this.id)
            {
                var v = p5.Vector.sub(this.pos,_bubbles[i].pos);
                var d = v.mag();
                
                if(d < this.size/2 + _bubbles[i].size/2)
                {
                    if(d == 0)
                    {
                        this.dir.add(p5.Vector.random2D());
                    }
                    else
                    {
                        this.dir.add(v);
                    }
                }
            }
        }
        
        this.dir.normalize();
        
    }
}

// This function creates a unique ID
function getRandomID()
{
    var alpha = "abcdefghijklmnopqrstuvwxyz0123456789"
    var s = "";
        
    for(var i = 0; i < 10; i++)
    {
        s += alpha[floor(random(0,alpha.length))];
    }
    
    return s;
}