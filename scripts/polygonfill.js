var view;
var ctx;
var polygons = {
    convex: {
        color: '#ed9fab', // choose color here!
        vertices: [
            {x: 120, y: 150},
            {x: 150, y: 120},
            {x: 170, y: 150},
            {x: 140, y: 180}
            // fill in vertices here!
        ]
    },
    concave: {
        color: '#85b8d6', // choose color here!
        vertices: [
            {x: 220, y: 260},
            {x: 250, y: 220},
            {x: 280, y: 230},
            {x: 290, y: 280},
            {x: 250, y: 250}

            // fill in vertices here!
        ]
    },
    self_intersect: {
        color: '#c5ebcb', // choose color here!
        vertices: [
            {x: 20, y: 50},
            {x: 50, y: 20},
            {x: 90, y: 80},
            {x: 90, y: 40},
            {x: 40, y: 80}
            // fill in vertices here!
        ]
    },
    interior_hole: {
        color: '#dcd1e3', // choose color here!
        vertices: [
            {x: 320, y: 320},
            {x: 380, y: 390},
            {x: 300, y: 380},
            {x: 360, y: 340},
            {x: 340, y: 420}
            // fill in vertices here!
        ]
    }
};

// Init(): triggered when web page loads
function Init() {
    var w = 800;
    var h = 600;
    view = document.getElementById('view');
    view.width = w;
    view.height = h;

    ctx = view.getContext('2d');

    SelectNewPolygon();
}

// DrawPolygon(polygon): erases current framebuffer, then draws new polygon
function DrawPolygon(polygon) {
    // Clear framebuffer (i.e. erase previous content)
    ctx.clearRect(0, 0, view.width, view.height);

    // Set line stroke color
    ctx.strokeStyle = polygon.color;

    // Create empty edge table (ET)
    var edge_table = [];
    var i;
    for (i = 0; i < view.height; i++) {
        edge_table.push(new EdgeList());
    }

    // Create empty active list (AL)
    var active_list = new EdgeList();


    // Step 1: populate ET with edges of polygon
    for(i = 0; i < polygon.vertices.length; i++){
        var ymax;
        var ymin;
        var xmin;
        var deltaX;
        var deltaY;
//      console.log("hello " + polygon.vertices[i].x + " " + polygon.vertices[i].y);
//      console.log(edge_table[1]);
        if(polygon.vertices[i].y > polygon.vertices[(i+1)%polygon.vertices.length].y){
            ymax = polygon.vertices[i].y;
            ymin = polygon.vertices[(i+1)%polygon.vertices.length].y;
            xmin = polygon.vertices[(i+1)%polygon.vertices.length].x;
        }
        else {
            ymax = polygon.vertices[(i+1)%polygon.vertices.length].y;
            ymin = polygon.vertices[i].y;
            xmin = polygon.vertices[i].x;
        }
        deltaX = polygon.vertices[i].x - polygon.vertices[(i+1)%polygon.vertices.length].x;
        deltaY = polygon.vertices[i].y - polygon.vertices[(i+1)%polygon.vertices.length].y;
//        console.log(ymin);
//        console.log(edge_table[ymin]);
      edge_table[ymin].InsertEdge(new EdgeEntry(ymax, xmin, deltaX, deltaY));
    }

    console.log(edge_table);

    // Step 2: set y to first scan line with an entry in ET
    var y;
    var j=0;
    while(edge_table[j].first_entry === null)
    {
        //console.log(edge_table[j]);
        if (edge_table[j+1].first_entry !== null){ y = j+1; }
        j++;
    }
//    console.log("y is: " + y);

    // Step 3: Repeat until ET[y] is NULL and AL is NULL
    while(edge_table[y].first_entry !== null || active_list.first_entry !== null) {
        //   a) Move all entries at ET[y] into AL
        console.log("y: " + y);
        var current = edge_table[y].first_entry;
        if(current !== null ) {
            active_list.InsertEdge(current);
 //           console.log("added new edge: ");
//            console.log(active_list.first_entry);
        }

        while(current !== null && current.next_entry !== null){
            active_list.InsertEdge(current.next_entry);
            current = current.next_entry;
//            console.log("added another new edge: ");
//            console.log(active_list.first_entry);
        }

    //    console.log("moved entries into ET: " + active_list.first_entry);
//        console.log(active_list.first_entry);

        //   b) Sort AL to maintain ascending x-value order
        active_list.SortList();
//        console.log("active sorted :");
//        console.log(active_list.first_entry);
        //   c) Remove entries from AL whose ymax equals y
        active_list.RemoveCompleteEdges(y);
//        console.log("active after: ");
//        console.log(active_list.first_entry);

//    console.log("removed from AL: " + active_list.first_entry);
        //   d) Draw horizontal line for each span (pairs of entries in the AL)
        current = active_list.first_entry;

        while(current !== null){
            var x1 = Math.ceil(current.x);
            var x2 = Math.ceil(current.next_entry.x) -1;
            if(x1 <= x2){
                DrawLine(x1 , y, x2, y);
            }
            current = current.next_entry.next_entry;
        }
        //   e) Increment y by 1
        y++;
        //   f) Update x-values for all remaining entries in the AL (increment by 1/m)
        current = active_list.first_entry;
        while(current !== null)
        {
//            console.log(current.x);
            current.x = current.x + current.inv_slope;
            current = current.next_entry;
        }
//        console.log(active_list);

   }//while
}//Draw Polygon

// SelectNewPolygon(): triggered when new selection in drop down menu is made
function SelectNewPolygon() {
    var polygon_type = document.getElementById('polygon_type');
    DrawPolygon(polygons[polygon_type.value]);
}

function DrawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
