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
            {x: 290, y: 280},
            {x: 260, y: 240}
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


    // Step 2: set y to first scan line with an entry in ET


    // Step 3: Repeat until ET[y] is NULL and AL is NULL
    //   a) Move all entries at ET[y] into AL
    //   b) Sort AL to maintain ascending x-value order
    //   c) Remove entries from AL whose ymax equals y
    //   d) Draw horizontal line for each span (pairs of entries in the AL)
    //   e) Increment y by 1
    //   f) Update x-values for all remaining entries in the AL (increment by 1/m)
}

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
