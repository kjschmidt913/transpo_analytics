const getData = () => {
    fetch('https://data.cityofchicago.org/resource/kn9c-c2s2.json')
        .then(response => response.json())
        .then(data => {
            console.log(data[0]);
            console.log(data[0][1]);
            // let dataset = {
            //     "children": data[0]
            // };
            bubbleChart(data[0]);
        });
};
getData();

const bubbleChart = (data) => {
    let comName = data.community_area_name;
    let dataset = {
        "children": [{
                "title": "Percent occupied housing units with more than one person per room",
                "value": data.percent_of_housing_crowded
            }, {
                "title": "Percent of households living below the federal poverty level",
                "value": data.percent_households_below_poverty
            }, {
                "title": "Percent of persons over the age of 16 years that are unemployed",
                "value": data.percent_aged_16_unemployed
            }, {
                "title": "Percent of persons over the age of 25 years without a high school education",
                "value": data.percent_aged_25_without_high_school_diploma
            }, {
                "title": "Percent of the population under 18 or over 64 years of age (i.e., dependency)",
                "value": data.percent_aged_under_18_or_over_64
            }, {
                "title": "Per capita income",
                "value": data.per_capita_income_
            },
            {
                "title": "Hardship Index",
                "value": data.hardship_index
            }

        ]
    };



    let margin = { top: 35, right: 145, bottom: 35, left: 45 },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // scale to ordinal because x axis is not numerical
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);

    //scale to numerical value by height
    var y = d3.scaleLinear().range([height, 0]);

    var chart = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xAxis = d3.axisBottom(x); //orient bottom because x-axis will appear below the bars

    var yAxis = d3.axisLeft(y);

    x.domain(data.map(function(d) {
        return d.title
    }));
    y.domain([0, d3.max(data, function(d) {
        return d.value
    })]);

    var bar = chart.selectAll("g")
        .data(data)
        .enter();

    bar.append("rect")
        .attr("y", function(d) {
            return y(d.value);
        })
        .attr("x", function(d, i) {
            return x(d.title);
        })
        .attr("height", function(d) {
            return height - y(d.value);
        })
        .attr("width", x.bandwidth()); //set width base on range on ordinal data

    bar.append("text")
        .attr("y", function(d) {
            return y(d.value) - 15;
        })
        .attr("x", function(d, i) {
            return x(d.title);
        })
        .attr("dy", ".75em")
        .text(function(d) {
            return d.value;
        });

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("responses");


};