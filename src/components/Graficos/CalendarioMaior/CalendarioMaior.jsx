import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("pt-BR");
const localizer = momentLocalizer(moment);

const allViews = Object.keys(Views).map(k => Views[k]);

const CalendarioMaior = ({ events = [], dataPadrao = null }) => (
  
  <div style={{ height: 700 }}>
    <Calendar
      localizer={localizer}
      events={events}
      step={60}
      views={allViews}
      defaultDate={dataPadrao}
      popup={false}
    />
  </div>
);

export default CalendarioMaior;