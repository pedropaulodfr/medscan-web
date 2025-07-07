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
import Emails from "../pages/Emails/Emails";
import SMTP from "../pages/Parametros/SMTP/SMTP";
import Setup from "../pages/Setup";
import Notificacoes from "../pages/Notificacoes";
import Relatorios from "../pages/Relatorios";
import SolicitacaoMedicamento from "../pages/SolicitacaoMedicamento/SolicitacaoMedicamento";
import AnaliseSolicitacaoMedicamento from "../pages/SolicitacaoMedicamento/AnaliseSolicitacaoMedicamento";
import Tratamentos from "../pages/Tratamentos/Tratamentos";

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
    path: "/notificacoes",
    name: "Notificações",
    icon: "bi bi-chat-left",
    modulo: ["Paciente"],
    component: Notificacoes,
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
    path: "/tratamentos",
    name: "Tratamentos",
    icon: "bi bi-file-medical",
    modulo: ["Paciente"],
    component: Tratamentos,
    sidebar: true
  },
  {
    path: "/solicitacao",
    name: "Solicitação",
    icon: "bi bi-capsule",
    modulo: ["Paciente"],
    component: SolicitacaoMedicamento,
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
    path: "/pacientes",
    name: "Pacientes",
    icon: "bi bi-person-lines-fill",
    modulo: ["Admin"],
    component: Pacientes,
    sidebar: true
  },
  {
    path: "/analiseSolicitacao",
    name: "Análise Solicitação",
    icon: "bi bi-clipboard-plus",
    modulo: ["Admin"],
    component: AnaliseSolicitacaoMedicamento,
    sidebar: true
  },
  {
    path: "/relatorios",
    name: "Relatórios",
    icon: "bi bi-clipboard2-pulse",
    component: Relatorios,
    sidebar: true
  },
  {
    name: "Parâmetros",
    icon: "bi bi-sliders",
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
      {
        path: "/smtp",
        name: "SMTP",
        icon: "bi bi-router",
        modulo: ["Admin"],
        component: SMTP,
        sidebar: true
      },
    ]
  },
  {
    path: "/emails",
    name: "Emails",
    icon: "bi bi-envelope-at",
    modulo: ["Admin"],
    component: Emails,
    sidebar: true
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
    path: "/setup",
    name: "Setup",
    icon: "bi bi-gear",
    modulo: ["Admin"],
    component: Setup,
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
