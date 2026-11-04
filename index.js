import * as THREE from 'https://esm.sh/three@0.170.0';
import {OrbitControls} from 'https://esm.sh/three@0.170.0/examples/jsm/controls/OrbitControls.js';
const names=['Vinícius','João','Luiz Guilherme','Kauã','Koreia','Maicon','Leb','Dalla','Willian','Gadotti','Christopher','Carol','Julia S','Julia','Ayhra','Italo','Lucas','Maikel','Luciene','Jean','Rafael','Douglas','Stephani','Clara','Gabriel','Felipe','Dhiego','Cristina','Lipinski','Johny','Isabelle','Larissa','Laura','Geovani','Michael'];
const products=[{name:'Heineken',price:9,stock:60},{name:'Budweiser',price:9,stock:60},{name:'Eisenbahn',price:9,stock:50},{name:'Porção de batata',price:29,stock:100},{name:'Hambúrguer',price:15,stock:100},{name:'Cuba Libre',price:14,stock:50}];
const MAX=24, people=[],chairs=[];let revenue=0,sales=0,nextId=0;
const $=id=>document.getElementById(id),rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x141b24);
const camera=new THREE.PerspectiveCamera(48,1,.1,100);camera.position.set(19,24,27);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;$('scene').appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.target.set(6,0,8);controls.maxPolarAngle=Math.PI/2.05;controls.minDistance=12;controls.maxDistance=48;
scene.add(new THREE.HemisphereLight(0xddeaff,0x4a3525,2.0));const sun=new THREE.DirectionalLight(0xffdbac,3);sun.position.set(3,20,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-20;sun.shadow.camera.right=20;sun.shadow.camera.top=20;sun.shadow.camera.bottom=-20;scene.add(sun);
const mat=(color,roughness=0.8)=>new THREE.MeshStandardMaterial({color,roughness});const wood=mat(0x805032),darkWood=mat(0x493020),floorMat=mat(0x45433d),metal=mat(0x282e33),wall=mat(0x6a5548);
function cube(w,h,d,m,x,y,z,shadow=true){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=shadow;mesh.receiveShadow=true;scene.add(mesh);return mesh}
function cylinder(rt,rb,h,m,x,y,z){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,12),m);mesh.position.set(x,y,z);mesh.castShadow=true;scene.add(mesh);return mesh}
// The original 13 x 18 canvas grid maps to x/z coordinates in 3D.
cube(13,.25,18,floorMat,6,.0,8.5,false);
for(let x=0;x<13;x++)for(let z=0;z<18;z++){if((x+z)%2===0)cube(.97,.015,.97,mat(0x514d44),x,.14,z,false)}
// Low walls leave the scene visible from the isometric camera.
cube(13,2,.24,wall,6,1,17.5);cube(.24,2,18,wall,12.5,1,8.5);cube(8,2,.24,wall,8,1,-.5);cube(.24,2,13,wall,-.5,1,11);
// Entrance, cashier and counter.
cube(1.8,.06,1.2,mat(0x997044),1,.19,.4,false);
cube(3,1.05,1.05,wood,1,0.67,4);cube(2.7,.10,1.25,darkWood,1,1.25,4);cube(.4,.4,.4,metal,1,1.5,4);
cube(1.3,1.25,4.2,wood,11.4,.78,7.5);cube(1.65,.15,4.5,darkWood,11.4,1.48,7.5);
for(let z=6;z<=9;z++)cylinder(.12,.12,.35,mat(0xc6ad69),11.4,1.72,z);
function chair(x,z){const seat=cube(.64,.15,.64,mat(0x8c603d),x,.65,z);const back=cube(.64,.75,.12,darkWood,x,1.05,z+.3);for(const dx of [-.23,.23])for(const dz of [-.23,.23])cube(.10,.58,.10,darkWood,x+dx,.32,z+dz);chairs.push({x,z,free:true})}
for(const [x,z] of [[4,11],[7,11],[10,11],[4,14],[7,14],[10,14]]){cylinder(.13,.22,.92,metal,x,.58,z);cylinder(.75,.75,.12,wood,x,1.08,z);for(const [dx,dz] of [[0,-1],[0,1],[1,0],[-1,0]])chair(x+dx,z+dz)}
function personMesh(color){const group=new THREE.Group();const shirt=mat(color),skin=mat(0xe7b58e),pants=mat(0x263f5c);function part(geometry,material,x,y,z){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=true;group.add(mesh)}part(new THREE.CylinderGeometry(.24,.30,.7,10),shirt,0,1.05,0);part(new THREE.SphereGeometry(.22,12,10),skin,0,1.58,0);for(const s of [-1,1]){part(new THREE.BoxGeometry(.16,.55,.18),pants,s*.13,.43,0);part(new THREE.BoxGeometry(.13,.57,.15),shirt,s*.33,1.03,0)}scene.add(group);return group}
function log(msg){const d=document.createElement('div');d.textContent=`${new Date().toLocaleTimeString('pt-BR')} · ${msg}`;$('history').prepend(d);while($('history').children.length>45)$('history').lastChild.remove()}
function update(){ $('people').textContent=`${people.length}/${MAX}`;$('revenue').textContent=revenue.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});$('sales').textContent=sales}
function moveTo(p,x,z,onDone){p.target={x,z,onDone};p.state='walking'}
function enter(){if(people.length>=MAX||chairs.every(c=>!c.free))return;const available=names.filter(n=>!people.some(p=>p.name===n));if(!available.length)return;const name=available[rand(0,available.length-1)];const chair=chairs.filter(c=>c.free)[rand(0,chairs.filter(c=>c.free).length-1)];chair.free=false;const mesh=personMesh([0x4c9eac,0xd8845a,0x9d77ba,0x70a46b,0xb88e4e,0x5986c2][rand(0,5)]);mesh.position.set(1,.15,1);const p={id:++nextId,name,money:rand(100,300),chair,mesh,state:'walking',target:null,leaving:false};people.push(p);moveTo(p,6,7,()=>moveTo(p,chair.x,chair.z,()=>{p.state='seated';p.mesh.position.y=-.18}));log(`${name} entrou no pub.`);update()}
function leave(){const seated=people.filter(p=>p.state==='seated');if(!seated.length)return;const p=seated[rand(0,seated.length-1)];p.chair.free=true;p.leaving=true;p.mesh.position.y=.15;moveTo(p,6,7,()=>moveTo(p,1,1,()=>{scene.remove(p.mesh);people.splice(people.indexOf(p),1);log(`${p.name} saiu do pub.`);update()}))}
function purchase(){const seated=people.filter(p=>p.state==='seated');if(!seated.length)return;const p=seated[rand(0,seated.length-1)],product=products[rand(0,products.length-1)];if(product.stock<=0||p.money<product.price)return;product.stock--;p.money-=product.price;revenue+=product.price;sales++;log(`${p.name} comprou ${product.name} por R$ ${product.price.toFixed(2).replace('.',',')}.`);update()}
$('add').onclick=enter;$('remove').onclick=leave;
setInterval(()=>Math.random()<.60?enter():leave(),2200);setInterval(purchase,1500);
let last=performance.now();function animate(now){requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;for(const p of people){if(!p.target)continue;const {x,z,onDone}=p.target;const dx=x-p.mesh.position.x,dz=z-p.mesh.position.z,dist=Math.hypot(dx,dz),step=3*dt;if(dist<=step){p.mesh.position.x=x;p.mesh.position.z=z;p.target=null;onDone?.()}else{p.mesh.position.x+=dx/dist*step;p.mesh.position.z+=dz/dist*step;p.mesh.rotation.y=Math.atan2(dx,dz)}}controls.update();renderer.render(scene,camera)}requestAnimationFrame(animate);
function resize(){const e=$('scene');renderer.setSize(e.clientWidth,e.clientHeight);camera.aspect=e.clientWidth/e.clientHeight;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe($('scene'));resize();update();enter();
