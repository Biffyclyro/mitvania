# Mythvania

- Build: npm run build:dev
- Run game: npm start


##	🚧 Building...  🚧


## Build a lvl
Tiled JSON Tilemap file with:

{
 "height":20,
 "infinite":true,
 "layers":[
        {
         "name":"collisions",
         "objects":[ ],
         "x":0,
         "y":0
        }, 
        {
         "name":"main-layer",
         "type":"tilelayer",
         "visible":true,
         "x":0,
         "y":0
        },
       {
         "name":"second-layer",
         "type":"tilelayer",
         "visible":true,
         "x":0,
         "y":0
        },
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tilesets":[
        {
         "image":"Tiles.png",
         "name":"the tileset name",
        }],
 "type":"map",
}


### To-dos
- [ ] Itens spwan
- [ ] Save dialog box
- [ ] Menus
- [x] Drop itens/skills from mobs
- [ ] Sound effects
- [ ] Musics
- [X] Fix items overlapping the wall
- [ ] Flying mobs
- [x] Load all the assets dynamically
- [ ] Make all the tilesets and sprites
- [X] XP system
- [X] Mob Factory
- [ ] HUD
- [ ] Player status control
- [ ] Aura
- [ ] All inputs other than the keyboard
- [ ] AIs
