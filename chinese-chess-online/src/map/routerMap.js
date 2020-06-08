import Rooms from './../pages/rooms/index';
import Home from './../pages/home/index';
import Login from './../pages/login/login';

const routerMap = [
    {path:"/",component:Home,name:"Home" ,auth:true},
    {path:"/rooms",component:Rooms,name:"Rooms" ,auth:true},
    {path:"/login",component:Login,name:"Login"}
];

export default routerMap