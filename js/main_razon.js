init();

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C',
COLOR_COMP_1 = '#AADCE0';

function init() {
    d3.csv('../data/razon_feminidad_diferencias_2003_2021_tamanos.csv', function(error,data) {
        if (error) throw error;
        
        let margin = {top: 10, right: 10, bottom: 20, left: 45},
            width = document.getElementById('chart').clientWidth - margin.left - margin.right,
            height = document.getElementById('chart').clientHeight - margin.top - margin.bottom;

        let sumstat = d3.nest()
            .key(function(d) { return d.tipo_muni_2;})
            .entries(data);

        let svg = d3.select("#chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis
        let x = d3.scaleBand()
            .domain(d3.map(data, function(d) { return d.razon; }).keys())
            .range([ 0, width ])
            .paddingInner(0.45);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        let y = d3.scaleLinear()
            .domain([90, 115])
            .range([ height, 0 ]);

        svg.append("g")
            .attr('class','yaxis')
            .call(d3.axisLeft(y).ticks(5));

        svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr('class', 'lines')
            .attr("fill", "none")
            .attr("stroke", function(d) {
                if(d.values[0].gana_pierde == 'gana') {
                    return COLOR_PRIMARY_1;
                } else {
                    return COLOR_COMP_1;
                }
            })
            .attr("opacity", '1')
            .attr("stroke-width", '2')
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return x(d.razon) + x.bandwidth() / 2; })
                    .y(function(d) { return y(+d.puntos); })
                    (d.values)
            });

        svg.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
                .attr('class','circles')
                .attr("fill", function(d) {
                    if(d.gana_pierde == 'gana') {
                        return COLOR_PRIMARY_1;
                    } else {
                        return COLOR_COMP_1;
                    }
                })
                .attr("stroke", "none")
                .attr("cx", function(d) { return x(d.razon) + x.bandwidth() / 2})
                .attr("cy", function(d) { return y(+d.puntos) })
                .attr("r", 3);

        //Textos
        svg.selectAll('myTexts')
            .data(data)
            .enter()
            .append('text')
            .attr('class','yaxis-text')
            .filter(function(d,i) { if(i % 2 != 0) { return d; }})
            .attr("x", function(d) {
                return x(d.razon) + (x.bandwidth() / 2) + 7.5;})
            .attr("y", function(d) {
                
                if(d.tipo_muni_2 == 'Media nacional' || d.tipo_muni_2 == '10.001 a 20.000') {
                    return y(+d.puntos) + 5
                } else if (d.tipo_muni_2 == '50.001 a 100.000' || d.tipo_muni_2 == '20.001 a 50.000') {
                    return y(+d.puntos) - 5
                } else {
                    return y(+d.puntos)
                }
                
            })
            .attr("dy", ".35em")
            .text(function(d) { return d.tipo_muni_2; });
    });
}