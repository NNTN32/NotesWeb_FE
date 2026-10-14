import { FiCheckSquare } from "react-icons/fi";
import Animate from "../../../components/ui/Animate";
import { ENTER, staggerStyle } from "../../../lib/motion";
import { FLOW_EXAMPLE_TASK as TASK } from "../flowSteps";

const WEEK = ["M", "T", "W", "T", "F", "S", "S"];
const TODAY_INDEX = (new Date().getDay() + 6) % 7; // Monday-based
const delay = (ms) => ({ "--motion-delay": `${ms}ms` });

/** Notes: a line gets highlighted, then the "Add as task" action pops in. */
function CaptureScene() {
  return (
    <div className="flow-scene flow-scene--note">
      <strong className="flow-scene__title">Weekend plan</strong>
      <p>Buy flowers for mom</p>
      <p>
        <mark className={ENTER.highlight} style={delay(400)}>
          {TASK}
        </mark>
      </p>
      <p>Finish the book</p>
      <span className={`flow-pill ${ENTER.pop}`} style={delay(1300)}>
        <FiCheckSquare /> Add as task
      </span>
    </div>
  );
}

/** Today: the same text drops into the task list. */
function TodayScene() {
  return (
    <div className="flow-scene">
      <strong className="flow-scene__title">Today</strong>
      <ul className="flow-tasks">
        <li className="flow-task flow-task--done">
          <span className="flow-check" />
          Reply to emails
        </li>
        <li className="flow-task">
          <span className="flow-check" />
          Walk 30 minutes
        </li>
        <li
          className={`flow-task flow-task--new ${ENTER.drop}`}
          style={delay(300)}
        >
          <span className="flow-check" />
          {TASK}
        </li>
      </ul>
    </div>
  );
}

/** Week: today's column receives the very same task. */
function WeekScene() {
  return (
    <div className="flow-scene">
      <strong className="flow-scene__title">This week</strong>
      <div className="flow-week">
        {WEEK.map((day, index) => (
          <div
            key={index}
            className={`flow-day ${ENTER.rise} ${index === TODAY_INDEX ? "flow-day--today" : ""}`}
            style={staggerStyle(index)}
          >
            <span>{day}</span>
            {index % 3 === 0 && <i />}
            {index === TODAY_INDEX && (
              <b className={ENTER.drop} style={delay(500)}>
                {TASK}
              </b>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const SCENES = { capture: CaptureScene, today: TodayScene, week: WeekScene };
const LABELS = { capture: "Notes", today: "Tasks · Day", week: "Tasks · Week" };

/** Decorative mini app window; the step text carries the meaning. */
export default function FlowPreview({ step }) {
  const Scene = SCENES[step];
  return (
    <div className="flow-window" aria-hidden="true">
      <div className="flow-window__bar">
        <i />
        <i />
        <i />
        <span>{LABELS[step]}</span>
      </div>
      {/* Keyed by step so each scene replays its entrance */}
      <Animate key={step} name="fade" className="flow-window__body">
        <Scene />
      </Animate>
    </div>
  );
}
