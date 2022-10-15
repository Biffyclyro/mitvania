import { Player } from "./entities";
//import structure from "../../assets/gameStructure.json"

export const player = new Player(10, 10, {}, 'player');

export const gameStructure = import("../../assets/gameStructure.json") 
