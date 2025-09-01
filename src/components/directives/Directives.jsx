import { DIRECTIVES_STEPS, SECURITY_TIPS } from "../../utils/constants.js";
import "./Directives.css";

const Directives = () => {
  return (
    <section
      className="container directives-container"
      aria-labelledby="directives-heading"
      data-testid="directives.root"
    >
      <h2
        id="directives-heading"
        className="directives-title"
        data-testid="directives.title"
      >
        Usage Directives and Security Tips
      </h2>

      <h3
        className="directives-section-heading"
        data-testid="directives.steps.title"
      >
        In order to generate a new password:
      </h3>
      <ol className="directives-list" data-testid="directives.steps.list">
        {DIRECTIVES_STEPS.map((directive, index) => (
          <li key={`dir-${index}`} data-testid="directives.steps.item">
            {directive}
          </li>
        ))}
      </ol>

      {Object.entries(SECURITY_TIPS).map(([category, items]) => (
        <div
          key={category}
          data-testid="directives.category.block"
          data-category={category}
        >
          <h3
            className="directives-section-heading"
            data-testid="directives.category.title"
            data-category={category}
          >
            {category}
          </h3>
          <ul
            className="tips-list"
            data-testid="directives.category.list"
            data-category={category}
          >
            {items.map((tip, index) => (
              <li
                key={`${category}-${index}`}
                data-testid="directives.category.item"
                data-category={category}
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div
        className="button-container scroll"
        data-testid="directives.scroll.block"
      >
        <a
          href="#top"
          className="primary-button"
          aria-label="Scroll to top"
          data-testid="directives.scroll.button"
        >
          Scroll Up
        </a>
      </div>
    </section>
  );
};

export default Directives;
