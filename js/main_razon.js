init();

//Colores fijos
const COLOR_PRIMARY_1 = '#F8B05C',
COLOR_COMP_1 = '#AADCE0';
let tooltip = d3.select('#tooltip');

function init() {
    d3.csv('https://raw.githubusercontent.com/CarlosMunozDiaz/lollipop_razon_feminidad/main/data/razon_feminidad_diferencias_2003_2021_tamanos.csv', function(error,data) {
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
            .paddingInner(0.35);

        let xAxis = function(g){
            g.call(d3.axisBottom(x));
            g.call(function(g){g.selectAll('.tick line').remove()});
        }

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Add Y axis
        let y = d3.scaleLinear()
            .domain([90, 115])
            .range([ height, 0 ]);

        let yAxis = function(svg){
            svg.call(d3.axisLeft(y).ticks(5).tickFormat(function(d) { return d; }))
            svg.call(function(g){g.selectAll('.tick line').remove()});
        } 

        svg.append("g")
            .attr('class','yaxis')
            .call(yAxis);

        svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr('class', function(d) {
                return `line ${d.key.replace(/\s/g, '_')}`;
            })
            .attr("fill", "none")
            .attr("stroke", function(d) {
                if(d.values[0].gana_pierde == 'gana') {
                    return COLOR_PRIMARY_1;
                } else {
                    return COLOR_COMP_1;
                }
            })
            .attr("opacity", '1')
            .attr("stroke-width", '2.5')
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return x(d.razon) + x.bandwidth() / 2; })
                    .y(function(d) { return y(+d.puntos); })
                    (d.values)
            })
            .on('mouseover', function(d,i,e) {
                //Cogemos esta línea y cambiamos la opacidad a las demás
                let css = this.getAttribute('class').split(' ')[1];

                let lines = svg.selectAll('.line');                        
                lines.each(function() {
                    this.style.opacity = '0.4';
                    if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                        this.style.opacity = '1';
                    }
                });

                //Cogemos la clase CSS para cambiar la opacidad de los círculos no asociados
                let circles = svg.selectAll('.circle');                        
                circles.each(function() {
                    this.style.opacity = '0.4';
                    if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                        this.style.opacity = '1';
                    }
                });

                //Cogemos la clase CSS para mostrar unos datos u otros
                let text = svg.selectAll('.yaxis-text');
                text.each(function() {
                    this.style.opacity = '0';
                    if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                        this.style.opacity = '1';
                    }
                });

            })
            .on('mouseout', function(d,i,e) {
                //Quitamos los estilos de líneas y círculos
                let lines = svg.selectAll('.line');
                lines.each(function() {
                    this.style.opacity = '1';
                });

                let circles = svg.selectAll('.circle');
                circles.each(function() {
                    this.style.opacity = '1';
                });

                let percText = svg.selectAll('.perc-text');
                percText.each(function() {
                    this.style.opacity = '0';
                });

                if(document.body.clientWidth < 690) {
                    let titleText = svg.selectAll('.title-text');
                    titleText.each(function() {
                        this.style.opacity = '0';
                    });
                } else {
                    let titleText = svg.selectAll('.title-text');
                    titleText.each(function() {
                        this.style.opacity = '1';
                    });
                }
            });

        svg.selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
                .attr('class',function(d) {
                    return `circle ${d.tipo_muni_2.replace(/\s/g, '_')}`;
                })
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
                .attr("r", 4)
                .on('mouseover', function(d,i,e) {
                    //Cogemos esta línea y cambiamos la opacidad a las demás
                    let css = this.getAttribute('class').split(' ')[1];

                    let lines = svg.selectAll('.line');                        
                    lines.each(function() {
                        this.style.opacity = '0.4';
                        if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                            this.style.opacity = '1';
                        }
                    });

                    //Cogemos la clase CSS para cambiar la opacidad de los círculos no asociados
                    let circles = svg.selectAll('.circle');                        
                    circles.each(function() {
                        this.style.opacity = '0.4';
                        if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                            this.style.opacity = '1';
                        }
                    });

                    //Cogemos la clase CSS para mostrar unos datos u otros
                    let text = svg.selectAll('.yaxis-text');
                    text.each(function() {
                        this.style.opacity = '0';
                        if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                            this.style.opacity = '1';
                        }
                    });
                })
                .on('mouseout', function(d,i,e) {
                    //Quitamos los estilos de líneas y círculos
                    let lines = svg.selectAll('.line');
                    lines.each(function() {
                        this.style.opacity = '1';
                    });

                    let circles = svg.selectAll('.circle');
                    circles.each(function() {
                        this.style.opacity = '1';
                    });

                    let percText = svg.selectAll('.perc-text');
                    percText.each(function() {
                        this.style.opacity = '0';
                    });

                    if(document.body.clientWidth < 690) {
                        let titleText = svg.selectAll('.title-text');
                        titleText.each(function() {
                            this.style.opacity = '0';
                        });
                    } else {
                        let titleText = svg.selectAll('.title-text');
                        titleText.each(function() {
                            this.style.opacity = '1';
                        });
                    }

                    //Quitamos el tooltip
                    getOutTooltip(tooltip);
                });

        //Textos con porcentajes
        svg.selectAll('myTexts')
            .data(data)
            .enter()
            .append('text')
            .attr('class', function(d) {
                return `yaxis-text perc-text ${d.tipo_muni_2.replace(/\s/g, '_')}`;
            })
            .attr("x", function(d) {
                return x(d.razon) + (x.bandwidth() / 2) - 15;
            })
            .attr("y", function(d) {
                return y(+d.puntos) - 17;                
            })
            .attr("dy", ".35em")
            .style('opacity','0')
            .text(function(d) { return numberWithCommas(+d.puntos); })
            .on('mouseover', function(d,i,e) {
                //Cogemos esta línea y cambiamos la opacidad a las demás
                let css = this.getAttribute('class').split(' ')[2];

                let lines = svg.selectAll('.line');                        
                lines.each(function() {
                    this.style.opacity = '0.4';
                    if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                        this.style.opacity = '1';
                    }
                });

                //Cogemos la clase CSS para cambiar la opacidad de los círculos no asociados
                let circles = svg.selectAll('.circle');                        
                circles.each(function() {
                    this.style.opacity = '0.4';
                    if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                        this.style.opacity = '1';
                    }
                });

                //Cogemos la clase CSS para mostrar unos datos u otros
                let text = svg.selectAll('.yaxis-text');
                text.each(function() {
                    this.style.opacity = '0';
                    if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                        this.style.opacity = '1';
                    }
                });
            })
            .on('mouseout', function(d,i,e) {
                //Quitamos los estilos de líneas y círculos
                let lines = svg.selectAll('.line');
                lines.each(function() {
                    this.style.opacity = '1';
                });

                let circles = svg.selectAll('.circle');
                circles.each(function() {
                    this.style.opacity = '1';
                });

                let percText = svg.selectAll('.perc-text');
                percText.each(function() {
                    this.style.opacity = '0';
                });

                if(document.body.clientWidth < 690) {
                    let titleText = svg.selectAll('.title-text');
                    titleText.each(function() {
                        this.style.opacity = '0';
                    });
                } else {
                    let titleText = svg.selectAll('.title-text');
                    titleText.each(function() {
                        this.style.opacity = '1';
                    });
                }

                //Quitamos el tooltip
                getOutTooltip(tooltip);
            });

        //Textos de títulos > Diferenciar en función del ancho
        if(document.body.clientWidth < 690) {
            svg.selectAll('myTexts')
                .data(data)
                .enter()
                .append('text')
                .attr('class',function(d) {
                    return `yaxis-text title-text ${d.tipo_muni_2.replace(/\s/g, '_')}`;
                })
                .filter(function(d,i) { if(i % 2 != 0) { return d; }})
                .attr("x", function(d) {
                    return width / 2;
                })
                .attr("y", function(d) {                
                    if(d.tipo_muni_2 == 'Media nacional' || d.tipo_muni_2 == '10.001 a 20.000') {
                        return y(+d.puntos) + 15;
                    } else if (d.tipo_muni_2 == '50.001 a 100.000' || d.tipo_muni_2 == '20.001 a 50.000') {
                        return y(+d.puntos) + 5;
                    } else {
                        return y(+d.puntos);
                    }
                })
                .style('opacity', '0')
                .attr("dy", ".35em")
                .text(function(d) { return d.tipo_muni_2; })
                .on('mouseover', function(d,i,e) {
                    //Cogemos esta línea y cambiamos la opacidad a las demás
                    let css = this.getAttribute('class').split(' ')[2];

                    let lines = svg.selectAll('.line');                        
                    lines.each(function() {
                        this.style.opacity = '0.4';
                        if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                            this.style.opacity = '1';
                        }
                    });

                    //Cogemos la clase CSS para cambiar la opacidad de los círculos no asociados
                    let circles = svg.selectAll('.circle');                        
                    circles.each(function() {
                        this.style.opacity = '0.4';
                        if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                            this.style.opacity = '1';
                        }
                    });

                    //Cogemos la clase CSS para mostrar unos datos u otros
                    let text = svg.selectAll('.yaxis-text');
                    text.each(function() {
                        this.style.opacity = '0';
                        if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                            this.style.opacity = '1';
                        }
                    });
                })
                .on('mouseout', function(d,i,e) {
                    //Quitamos los estilos de líneas y círculos
                    let lines = svg.selectAll('.line');
                    lines.each(function() {
                        this.style.opacity = '1';
                    });

                    let circles = svg.selectAll('.circle');
                    circles.each(function() {
                        this.style.opacity = '1';
                    });

                    let percText = svg.selectAll('.perc-text');
                    percText.each(function() {
                        this.style.opacity = '0';
                    });

                    if(document.body.clientWidth < 690) {
                        let titleText = svg.selectAll('.title-text');
                        titleText.each(function() {
                            this.style.opacity = '0';
                        });
                    } else {
                        let titleText = svg.selectAll('.title-text');
                        titleText.each(function() {
                            this.style.opacity = '1';
                        });
                    }

                    //Quitamos el tooltip
                    getOutTooltip(tooltip);
                });

        } else {
            svg.selectAll('myTexts')
                .data(data)
                .enter()
                .append('text')
                .attr('class',function(d) {
                    return `yaxis-text title-text ${d.tipo_muni_2.replace(/\s/g, '_')}`;
                })
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
                .text(function(d) { return d.tipo_muni_2; })
                .on('mouseover', function(d,i,e) {
                    //Cogemos esta línea y cambiamos la opacidad a las demás
                    let css = this.getAttribute('class').split(' ')[2];

                    let lines = svg.selectAll('.line');                        
                    lines.each(function() {
                        this.style.opacity = '0.4';
                        if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                            this.style.opacity = '1';
                        }
                    });

                    //Cogemos la clase CSS para cambiar la opacidad de los círculos no asociados
                    let circles = svg.selectAll('.circle');                        
                    circles.each(function() {
                        this.style.opacity = '0.4';
                        if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                            this.style.opacity = '1';
                        }
                    });

                    //Cogemos la clase CSS para mostrar unos datos u otros
                    let text = svg.selectAll('.yaxis-text');
                    text.each(function() {
                        this.style.opacity = '0';
                        if(this.getAttribute('class').indexOf(`${css}`) != -1) {
                            this.style.opacity = '1';
                        }
                    });
                })
                .on('mouseout', function(d,i,e) {
                    //Quitamos los estilos de líneas y círculos
                    let lines = svg.selectAll('.line');
                    lines.each(function() {
                        this.style.opacity = '1';
                    });

                    let circles = svg.selectAll('.circle');
                    circles.each(function() {
                        this.style.opacity = '1';
                    });

                    let percText = svg.selectAll('.perc-text');
                    percText.each(function() {
                        this.style.opacity = '0';
                    });

                    if(document.body.clientWidth < 690) {
                        let titleText = svg.selectAll('.title-text');
                        titleText.each(function() {
                            this.style.opacity = '0';
                        });
                    } else {
                        let titleText = svg.selectAll('.title-text');
                        titleText.each(function() {
                            this.style.opacity = '1';
                        });
                    }

                    //Quitamos el tooltip
                    getOutTooltip(tooltip);
                });
        }
        
    });
}

/*
* FUNCIONES TOOLTIP
*/
function getInTooltip(tooltip) {
    tooltip.style('display','block').style('opacity', 1);
}

function getOutTooltip(tooltip) {
    tooltip.style('display','none').style('opacity', 0);
}

function positionTooltip(event, tooltip) {
    let x = event.pageX;
    let y = event.pageY;

    //Tamaño
    let ancho = parseInt(tooltip.style('width'));
    
    let distanciaAncho = isNaN(ancho) ? 100 : ancho;

    //Posición
    let left = window.innerWidth / 2 > x ? 'left' : 'right';
    let mobile = window.innerWidth < 525 ? -40 : 10;
    let horizontalPos = left == 'left' ? 10 : - distanciaAncho + mobile;

    tooltip.style('top', y + 17 + 'px');
    tooltip.style('left', (x + horizontalPos) + 'px');
}

/* Helpers */
function numberWithCommas(x) {
    //return x.toString().replace(/\./g, ',').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
    return x.toFixed(2).toString().replace(/\./g, ',');
}