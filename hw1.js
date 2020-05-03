const getData = (term) => {
    fetch('https://data.cityofchicago.org/resource/kn9c-c2s2.json')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            commStats(data[term - 1]);
            bubbleChart(data[term - 1]);
        });
};
getData(1);



const commStats = (data) => {
    let comName = data.community_area_name;
    let capitaIncome = '$' + data.per_capita_income_.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    let hardship = data.hardship_index;

    if (!hardship) {
        hardship = "Not available";
    }


    let community_template = `<div class="row">
    <div class="col-4">
        <h3>${comName}</h3>
        <p>Per Capita Income: ${capitaIncome}</p>
        <p>Hardship Index: ${hardship}</p>
    </div>
    <div class="col-6" id="bubble">
    </div>
</div>`;
    document.querySelector("#community").innerHTML = community_template;


};

const bubbleChart = (data) => {
    let comName = data.community_area_name;
    let dataset = {
        "children": [{
                "title": "Crowded housing",
                "description": "Percent occupied housing units with more than one person per room",
                "value": data.percent_of_housing_crowded
            }, {
                "title": "Living below poverty",
                "description": "Percent of households living below the federal poverty level",
                "value": data.percent_households_below_poverty
            }, {
                "title": "Unemployed",
                "description": "Percent of persons over the age of 16 years that are unemployed",
                "value": data.percent_aged_16_unemployed
            }, {
                "title": "No high school education",
                "description": "Percent of persons over the age of 25 years without a high school education",
                "value": data.percent_aged_25_without_high_school_diploma
            }, {
                "title": "Age under 18 or over 64",
                "description": "Percent of the population under 18 or over 64 years of age (i.e., dependency)",
                "value": data.percent_aged_under_18_or_over_64
            }

        ]
    };


    var diameter = 500;
    var color = d3.scaleOrdinal(d3.schemeCategory20b);

    //edited the responsive bar code to apply to bubble chart
    default_height = 500;


    var bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(.5);

    var svg = d3.select("#bubble")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var nodes = d3.hierarchy(dataset)
        .sum(function(d) {
            return d.value;
        });


    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d) {
            return !d.children
        })
        .append("g")
        .on('mouseover', function(d, i) {
            d3.select(this).transition()
                .duration('100')
                .attr('opacity', '.8');
        })
        .on('mouseout', function(d, i) {
            d3.select(this).transition()
                .duration('100')
                .attr('opacity', '1');
        })
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("title")
        .text(function(d) {
            return d.title;
        });

    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d, i) {
            return color(i);
        });

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.title;
        })
        .attr("font-size", function(d) {
            return d.r / 6;
        })
        .attr("fill", "white");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.value.toString() + '%';
        })
        .attr("font-size", function(d) {
            return d.r / 5;
        })
        .attr("fill", "white");

    d3.select(self.frameElement)
        .style("height", diameter + "px");

};