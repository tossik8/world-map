import {countryData} from "./data.js";

fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(response => response.json())
    .then(data => createMap(data))

const width = 960;
const height = 600;


function createMap(data){
    const svg = d3.select("#svg-container")
                    .append("svg")
                    .attr("id", "svg-map")
                    .attr("width", width)
                    .attr("height", height);

    const countries = topojson.feature(data, data.objects.countries);
    const g = svg.append("g")
                 .attr("id", "map");

    const projection = d3.geoMercator().scale(145).translate([width/2, height/1.4]);
    const path = d3.geoPath(projection);

    g.selectAll("path")
       .data(countries.features)
       .enter()
       .append("path")
       .attr("class", "country")
       .attr("country-population", d => findPopulation(countryData, d.properties.name))
       .attr("country-name", d => d.properties.name)
       .attr("d", path);

    makeTooltip();
}

function findPopulation(data,name){
    for(let record of data){
        if(record.country === name) return record.population;
    }
    return -1;
}

function makeTooltip(){
    const countries = document.getElementsByClassName("country")
    for(let country of countries){
        country.onmousemove = (e) => {
            document.getElementById("country-name").textContent = "Name: " + country.attributes.getNamedItem("country-name").value;
            document.getElementById("country-population").textContent = "Population: " + formatNumber(country.attributes.getNamedItem("country-population").value);

            document.getElementById("tooltip").style.top = e.pageY - 30 + "px";
            document.getElementById("tooltip").style.left = e.pageX + 20 + "px";

            document.getElementById("tooltip").classList.add("visible");
            document.getElementById("tooltip").classList.remove("invisible");
        }
        country.onmouseleave = () => {
            document.getElementById("tooltip").classList.add("invisible");
            document.getElementById("tooltip").classList.remove("visible");
        }
    }
}

function formatNumber(number){
    let result = "";
    for(let i = 1; number != 0; ++i){
        result = number%10 + result;
        if(i % 3 === 0 && Math.floor(number / 10) !== 0){
            result = "," + result;
        }
        number = Math.floor(number/10);
    }
    return result;
}
