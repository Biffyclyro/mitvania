# Mythvania

- Build: npm run build:dev
- Run game: npm start


##	🚧 Building...  🚧


## Build a lvl
Tiled JSON Tilemap file with:

{
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
       { 
       "name":"sprite-objects",
         "objects":[
                {
                 "name":"potion",
                 "point":true,
                 "properties":[
                        {
                         "name":"type",
                         "type":"string",
                         "value":"life-potion" | "mana-potion"
                        }],
                 "rotation":0,
                 "visible":true,
                 "width":0,
                 "x":847.03,
                 "y":534.182
                }, 
                {
                 "name":"lotus",
                 "point":true,
                 "visible":true,
                 "x":1
                 "y":
                }, 
               {
                 "name":"mob",
                 "point":true,
                 "properties":[
                        {
                         "name":"lvl",
                         "type":"int",
                         "value":
                        }, 
                        {
                         "name":"name",
                         "type":"string",
                         "value":""
                        }],
                 "visible":true,
                 "x":,
                 "y":
                },

                {
                 "name":"spawner",
                 "point":true,
                 "properties":[
                        {
                         "name":"lvl",
                         "type":"int",
                         "value":
                        }, 
                        {
                         "name":"mob",
                         "type":"string",
                         "value":""
                        }, 
                        {
                         "name":"qtd",
                         "type":"int",
                         "value":
                        }, 
                        {
                         "name":"respawn",
                         "type":"bool",
                         "value":
                        }],
                 "visible":true,
                 "x":,
                 "y":
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }, 
        ]
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tilesets":[
        {
         "image":"Tiles.png",
         "name":"the tileset name",
        }],
 "type":"map",
}

collision object names: passable, kill-sprite

### To-dos
- [X] Itens spawn 
- [ ] Save dialog box
- [ ] Menus
- [x] Drop itens/skills from mobs
- [ ] Sound effects
- [ ] Musics
- [X] Fix items overlapping the wall
- [ ] Flying mobs
- [x] Load all the assets dynamically
- [ ] Make all the tilesets and sprites
- [X] Attacking mobs
- [X] XP system
- [X] Mob Factory
- [ ] HUD
- [X] Mobs follow player
- [X] Player status control
- [ ] Aura
- [ ] All inputs other than the keyboard
- [ ] AIs
