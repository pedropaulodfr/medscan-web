import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("pt-BR");
moment.updateLocale("pt-br", {
  months: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ],
  monthsShort: [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ],
  weekdays: [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
  ],
  weekdaysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
})
const localizer = momentLocalizer(moment);

const allViews = Object.keys(Views).map(k => Views[k]);

const CalendarioMaior = ({ events = [], dataPadrao = null }) => (
  
  <div style={{ height: 600 }}>
    <Calendar
      localizer={localizer}
      events={events}
      step={60}
      views={allViews}
      defaultDate={dataPadrao}
      popup={false}
      culture="pt-br"
      messages={{
            next: "Próximo",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            work_week: "Semana de trabalho"
          }}
    />
  </div>
);

export default CalendarioMaior;