import Home from "../pages/Home";
import CartaoControle from "../pages/CartaoControle/CartaoControle";
import Dashboard from "../pages/Dashboard";
import Medicamentos from "../pages/Medicamentos/Medicamentos";
import TipoMedicamento from "../pages/Parametros/TipoMedicamento/TipoMedicamento";
import Unidades from "../pages/Parametros/Unidades/Unidades";
import Receituario from "../pages/Receituario/Receituario";
import Usuarios from "../pages/Usuarios/Usuarios";
import MeuPerfil from "../pages/MeuPerfil";
import Pacientes from "../pages/Pacientes/Pacientes";

var menus = [
  {
    path: "/home",
    name: "Home",
    icon: "bi bi-house",
    component: Home,
    sidebar: true
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    modulo: ["Paciente"],
    icon: "bi bi-ui-checks-grid",
    component: Dashboard,
    sidebar: true
  },
  {
    path: "/card",
    name: "Cartão de Controle",
    icon: "bi bi-table",
    modulo: ["Paciente"],
    component: CartaoControle,
    sidebar: true
  },
  {
    path: "/receituario",
    name: "Receituário",
    icon: "bi bi-card-list",
    modulo: ["Paciente"],
    component: Receituario,
    sidebar: true
  },
  {
    path: "/medicamentos",
    name: "Medicamentos",
    icon: "bi bi-capsule",
    modulo: ["Admin"],
    component: Medicamentos,
    sidebar: true
  },
  {
    path: "/home",
    name: "Relatórios",
    icon: "bi bi-clipboard2-pulse",
    component: CartaoControle,
    sidebar: true
  },
  {
    path: "/pacientes",
    name: "Pacientes",
    icon: "bi bi-person-lines-fill",
    modulo: ["Admin"],
    component: Pacientes,
    sidebar: true
  },
  {
    name: "Parâmetros",
    icon: "bi bi-gear",
    modulo: ["Admin"],
    sidebar: true,
    submenus: [
      {
        path: "/unidades",
        name: "Unidades",
        icon: "bi bi-rulers",
        modulo: ["Admin"],
        component: Unidades,
        sidebar: true
      },
      {
        path: "/tipoMedicamento",
        name: "Tipos",
        icon: "bi bi-capsule",
        modulo: ["Admin"],
        component: TipoMedicamento,
        sidebar: true
      },
    ]
  },
  {
    path: "/usuarios",
    name: "Usuários",
    icon: "bi bi-people",
    modulo: ["Admin"],
    component: Usuarios,
    sidebar: true
  },
  {
    path: "/meu-perfil",
    name: "Meu Perfil",
    icon: "bi bi-people",
    component: MeuPerfil,
    sidebar: false
  },
];

export default menus;
