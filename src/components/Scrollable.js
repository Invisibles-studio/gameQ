/* eslint-disable */
import { useEffect, useRef } from "react";

import React from "react";

const Scrollable = (props) => {
  let ref = useRef();

  useEffect(() => {
    const el = ref.current;
    if (el) {
      const onWheel = (e) => {
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 4,
          behavior: "smooth",
        });
      };
      el.addEventListener("wheel", onWheel);

      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);

  return (
    <div className={props._class} ref={ref}>
      {React.Children.map(props.children, (child) =>
        React.Children.only(child),
      )}
    </div>
  );
};

export default Scrollable;
