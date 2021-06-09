import React, { createRef, useEffect, useState } from "react";

const MIN_WIDTH = 40;
const MAX_WIDTH = 640;
const SIDEBAR_WIDTH = 260;

const LeftPane = ({ children, leftWidth, setLeftWidth, expanded, onClick }) => {
  const leftRef = createRef();

  useEffect(() => {
    if (leftRef.current) {
      if (!expanded) {
        leftRef.current.style.cursor = "pointer";
        return;
      }
      leftRef.current.style.cursor = "default";
      return;
    }
  }, [leftRef, expanded]);

  useEffect(() => {
    if (leftRef.current) {
      if (!leftWidth) {
        setLeftWidth(leftRef.current.clientWidth);
        return;
      }

      leftRef.current.style.width = `${leftWidth}px`;
      if (leftWidth <= MIN_WIDTH) {
        leftRef.current.style.background =
          "linear-gradient(to bottom, #5ba2f1 2.11%, #934db8 50.9%,#f28b5a 100.72%)";
        return;
      }
      leftRef.current.style.background = "#fff";
    }
  }, [leftRef, leftWidth, setLeftWidth]);

  return (
    <div className="left-pane" ref={leftRef} onClick={() => onClick(true)}>
      {children}
    </div>
  );
};

const SplitView = ({ left, right, className }) => {
  const [leftWidth, setLeftWidth] = useState(undefined);
  const [separatorXPosition, setSeparatorXPosition] = useState(undefined);
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const splitPaneRef = createRef();

  useEffect(() => {
    expanded ? setLeftWidth(SIDEBAR_WIDTH) : setLeftWidth(MIN_WIDTH);
  }, [expanded]);

  const onMouseDown = (e) => {
    setSeparatorXPosition(e.clientX);
    setDragging(true);
  };

  const onTouchStart = (e) => {
    setSeparatorXPosition(e.touches[0].clientX);
    setDragging(true);
  };

  const onMove = (clientX) => {
    if (dragging && leftWidth && separatorXPosition) {
      const newLeftWidth = leftWidth + clientX - separatorXPosition;
      setSeparatorXPosition(clientX);

      if (newLeftWidth < MIN_WIDTH) {
        setExpanded(false);
        setLeftWidth(MIN_WIDTH);
        return;
      }

      if (newLeftWidth > MAX_WIDTH) {
        setLeftWidth(MAX_WIDTH);
        return;
      }

      if (splitPaneRef.current) {
        const splitPaneWidth = splitPaneRef.current.clientWidth;

        if (newLeftWidth > splitPaneWidth - MIN_WIDTH) {
          setLeftWidth(splitPaneWidth - MIN_WIDTH);
          return;
        }
      }

      setLeftWidth(newLeftWidth);
    }
  };

  const onMouseMove = (e) => {
    e.preventDefault();
    onMove(e.clientX);
  };

  const onTouchMove = (e) => {
    onMove(e.touches[0].clientX);
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <div className={`split-view ${className ?? ""}`} ref={splitPaneRef}>
      <LeftPane
        leftWidth={leftWidth}
        setLeftWidth={setLeftWidth}
        expanded={expanded}
        onClick={(expanded) =>
          leftWidth < SIDEBAR_WIDTH && setExpanded(expanded)
        }
      >
        {left}
      </LeftPane>
      <div
        className="divider-hitbox"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onMouseUp}
      >
        <div className="divider" />
      </div>
      <div className="right-pane">{right}</div>
    </div>
  );
};

export default SplitView;
