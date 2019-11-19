/*Programa para cálculo e representação gráfica da decomposição do espaço "Diagrama de Voronoi"*/

//Variáveis globais de controle
var seeds = []; //Array que guardará as seeds
var seedsAmount = 11; //<--- Quantidade de seeds ***************
var planeSize = [500,500]; //<--- Tamanho do plano **************
var ponto = [] //var auxiliar para mostrar localização do ponto escolhido em checkPoint()
var aux=0; //var auxiliar no funcionamento de cirleMoving()

//Cálculo da decomposição do espaço
//readSeeds(seeds,seedsAmount); //<--- ler seeds do input ************
generateSeeds(seeds,seedsAmount,planeSize);
pointsToCell(planeSize,seedsAmount,seeds);

function setup(){
	//inicialização do canvas (parte gráfica da biblioteca p5)
    createCanvas(planeSize[0],planeSize[1]);
	//fundo preto
	background(0);
	drawNeighbourhood(seeds,seedsAmount,['blue','pink','yellow','green','brown','orange','purple','grey',],1);
	drawSeeds(seeds,seedsAmount,'black',(planeSize[0]+planeSize[1])/200);

	//procura o seed mais próximo do ponto recebido por input 
	//checkPoint(seeds,true,true,planeSize); // <--- checa qual seed está mais próximo do ponto dado pelo input *************
	
}

//Definição de funções
function randInt(min,max){
    //Retorna um inteiro entre max e min
    return Math.floor(Math.random() * ((max) - min) + min);
}

function distance(point_a,point_b){
    //Retorna a distância de um ponto a outro
    var number = Math.hypot(point_b[0]-point_a[0],2,point_b[1]-point_a[1],2);
    return Math.floor(number);
}

function readSeeds(seeds,seedsAmount){
    //Lê as coordenadas de cada seed do usuário.
    for(let i=0; i<seedsAmount; i++){
		seeds[i] = {id:i, x:0, y:0, neighbours:[]};
        seeds[i].x = window.prompt("Seed " + i ,"Digite a coordenada X");
       seeds[i].y = window.prompt("Seed " + i , "Digite a coordenada Y");
    }
}

function generateSeeds(seeds,seedsAmount,planeSize){
    //Gera aleatoriamente as seeds
   for(let i=0; i<seedsAmount; i++){
       var x = randInt(0,planeSize[0]);
       var y = randInt(0,planeSize[1]);
       //id --> identificação do seed
       //x e y --> posição do seed
       // neighbours --> pontos que pertencem à célula correspondente ao dado seed
       seeds.push({id: i, x: x, y: y,neighbours: new Array()})
   } 
}

function pointsToCell(planeSize,seedsAmount,seeds){
    //Atribui cada ponto do plano a uma célula/vizinhaça/centro de um respectivo seed
    for(let x=0; x<planeSize[0]; x++){
        for(let y=0; y<planeSize[1]; y++){ //para cada ponto no plano,
            //calcula as distâncias do ponto a todos os seeds
            let seedsDistances = [];
            for(let s=0; s<seedsAmount; s++){
                seedsDistances[s] = distance([x,y],[seeds[s].x,seeds[s].y]);
            }
            //descobre a menor distância
            let smallestDistance = planeSize[0] * planeSize[1];
            for(let d=0; d<seedsAmount; d++){
                if(seedsDistances[d]<smallestDistance)
                    smallestDistance = seedsDistances[d];
            }
            //descobre o número de seeds que são centro deste ponto
            let numberOfCenters = 0;
            for(let s=0; s<seedsAmount; s++){
                if(seedsDistances[s] == smallestDistance)
                    numberOfCenters++;
            }
            //atribui o ponto para a(s) respectiva(s) vizinhaça(s), marcando se o ponto está em só uma vizinhaça/centro ou em mais de uma
            for(let i=0; i<seedsAmount; i++){
                if(seedsDistances[i] == smallestDistance){
                    seeds[i].neighbours.push({x: x, y:y, hasMultipleCenters: numberOfCenters==1?false:true });
                }
            }
        }
    }
}
    
function drawSeeds(seeds,seedsAmount,color,weight){
    //Desenha os seeds no plano
    for(let s=0; s<seedsAmount; s++){
        stroke(color);
        strokeWeight(weight);
        point(seeds[s].x,seeds[s].y);
    }
}

function drawNeighbourhood(seeds,seedsAmount,color,weight){
    //para cada seed, desenhar os seus vizinhos exclusivos (que não são mais vizinhos de nenhum outro seed) [os seeds que são multivizinhos são os formadores das linhas de divisão do diagrama]
    for(let s=0; s<seedsAmount; s++){
        for(let p=0; p<seeds[s].neighbours.length; p++){
            if(seeds[s].neighbours[p].hasMultipleCenters == false){	//seeds[s].neighbours[p].hasMultipleCenters == false 
                stroke(color[s%(color.length)]);
                strokeWeight(weight);
                point(seeds[s].neighbours[p].x, seeds[s].neighbours[p].y);
            }                
        }
    }
}

function checkPoint(seeds,drawPoint,drawAura,planeSize){
    //Checa qual seed está mais próximo do ponto fornecido (drawPoint e drawAura definem se o ponto e a aura devem ser desenhados)
    window.alert("A seguir, forneça o ponto a ser calculado");
	var ponto = [window.prompt("Digite a coordenada x do ponto"),window.prompt("Digite a coordenada y do ponto")];
    for(let i=0; i<seedsAmount; i++){
        for(let j=0; j<seeds[i].neighbours.length; j++){
            if(seeds[i].neighbours[j].x == ponto[0] && seeds[i].neighbours[j].y == ponto[1]){
                window.alert("Id do Seed mais próximo: " +seeds[i].id+ " | coodenadas do Seed mais próximo: (" +seeds[i].x+ "," +seeds[i].y+ ")");
            }
        }
    }
	if(drawPoint){
		stroke('white');
		strokeWeight((planeSize[0]+planeSize[1])/200);	
		point(ponto[0],ponto[1]);
		if(drawAura){
			stroke('white');
			strokeWeight((planeSize[0]+planeSize[1])/400);
			noFill();
			circle(ponto[0],ponto[1],(planeSize[0]+planeSize[1])/20);
		}
}
}	
