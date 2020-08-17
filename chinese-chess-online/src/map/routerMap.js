import Rooms from './../pages/rooms/index';
// import Home from './../pages/home/index';
import Login from './../pages/login/login';
import List from './../pages/userList/index';
import Game from './../pages/game/index';

const routerMap = [
    // {path:"/",component:Rooms,name:"Rooms" ,auth:true},
    {path:"/",component:List,name:"List" ,auth:true},

    // {path:"/rooms",component:Rooms,name:"Rooms" ,auth:true},
    {path:"/login",component:Login,name:"Login"},
    {path:"/game",component:Game,name:"Game"}

];

export default routerMap