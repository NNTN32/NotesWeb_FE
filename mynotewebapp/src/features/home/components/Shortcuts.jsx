import Reveal from "../../../components/ui/Reveal";
import { staggerStyle } from "../../../lib/motion";
import "../home-sections.css";
import { SHORTCUTS } from "../homeContent";

/** Keyboard shortcuts; keycaps "press" once when the section scrolls in. */
export default function Shortcuts() {
  let key = 0;
  return (
    <Reveal
      as="section"
      className="shortcuts"
      aria-labelledby="shortcuts-title"
    >
      <h2 id="shortcuts-title">Small habits, fast keys</h2>
      <ul className="shortcuts__list">
        {SHORTCUTS.map(({ keys, text }) => (
          <li key={text}>
            <span className="shortcuts__keys">
              {keys.map((label) => (
                <kbd
                  key={label}
                  className="keycap"
                  style={staggerStyle(4 + key++ * 2)}
                >
                  {label}
                </kbd>
              ))}
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
