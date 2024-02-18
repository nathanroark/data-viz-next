"use client";
import "./app.css";
import "./forms.css";
import * as diagramUtils from "./diagramUtils";
import Diagram from "./diagram";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { ServicesGraphData } from "@/server/api/types/services-graph-types";

export default function Chart({ dataset }: { dataset: ServicesGraphData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

  function setUrlParameters() {
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }

  const nodesString = searchParams.get("hlNodes") || "";
  const showHlOnly = searchParams.get("showHlOnly") === "y";
  const [inputHighlightText, setInputHighlightText] = useState("");
  const [showAllLabels, setShowAllLabels] = useState(false);
  const [showOnlyHighlighted, setShowOnlyHighlighted] = useState(showHlOnly);
  const [highlightedNodeNames, setHighlightedNodeNames] = useState(
    nodesString.split(",").filter((filter) => filter !== ""),
  );
  const [hasForceSimulation, setHasForceSimulation] = useState(true);

  useEffect(() => {
    diagramUtils.load(
      handleHighlightedNodesChanged,
      highlightedNodeNames,
      showOnlyHighlighted,
      dataset,
    );

    if (showOnlyHighlighted && highlightedNodeNames.length === 0) {
      console.log(
        "initShowOnlyHighlighted && initHighlightedNodeNames.length === 0",
      );
      current.set("showHlOnly", "");
      setShowOnlyHighlighted(false);
      setUrlParameters();
    }
  }, []);

  function updateShowAllLabels(pShowAllLabels: boolean) {
    setShowAllLabels(pShowAllLabels);
    diagramUtils.showAllLabels(pShowAllLabels);
  }

  function updateInputHighlightText(txt: string) {
    setInputHighlightText(txt);
    diagramUtils.searchForNodes(txt);
  }

  function handleHighlightedNodesChanged(pHighlightedNodeNames: string[]) {
    setHighlightedNodeNames(pHighlightedNodeNames);
    if (pHighlightedNodeNames.length > 0) {
      current.set("hlNodes", pHighlightedNodeNames.join(","));
      // remove duplicates
      let tempHlNodes = current.get("hlNodes") || "";
      current.set(
        "hlNodes",
        Array.from(new Set(tempHlNodes.split(","))).join(","),
      );
    } else {
      current.delete("hlNodes");
    }
    if (pHighlightedNodeNames.length === 0 && showOnlyHighlighted) {
      setShowOnlyHighlighted(false);
      current.set("showHlOnly", "");
    }
    setUrlParameters();
  }

  function handleSearchForNodesClick() {
    diagramUtils.searchForNodes(inputHighlightText);
  }

  function handleInputHighlightText(event: ChangeEvent<HTMLInputElement>) {
    const newVal = event.currentTarget.value;
    updateInputHighlightText(newVal);
    event.preventDefault();
  }

  function handleShowAllLabels(event: ChangeEvent<HTMLInputElement>) {
    const newVal = event.currentTarget.checked;
    updateShowAllLabels(newVal);
  }

  function handleShowOnlyHighlighted(event: ChangeEvent<HTMLInputElement>) {
    const newVal = event.currentTarget.checked;
    setShowOnlyHighlighted(newVal);
    current.set("showHlOnly", newVal ? "y" : "");
    diagramUtils.showOnlyHighlighted(newVal);
    if (newVal === true && showAllLabels === true) {
      updateShowAllLabels(false);
    }
    setUrlParameters();
  }

  function handleHasForceSimulation(event: ChangeEvent<HTMLInputElement>) {
    const newVal = event.currentTarget.checked;
    setHasForceSimulation(newVal);
    diagramUtils.setHasForceSimulation(newVal);
  }

  return (
    <div>
      <div className="header row">
        {/* <h1 className="col-4">Service Registry Diagram</h1> */}
        <div className="config-box">
          <label className={showOnlyHighlighted ? "disabled" : ""}>
            Search
          </label>
          <input
            name="inputSearch"
            className="h-8 rounded-md bg-gray-950 p-2 text-gray-200 outline outline-1 outline-gray-500"
            type="text"
            onChange={handleInputHighlightText}
            value={inputHighlightText}
            disabled={showOnlyHighlighted}
          />
          <input
            id="chkboxShowAllLabels"
            type="checkbox"
            checked={showAllLabels}
            onChange={handleShowAllLabels}
            disabled={showOnlyHighlighted}
          />
          <label htmlFor="chkboxShowAllLabels">Show all labels</label>
          <input
            id="chkboxShowOnlyHighlighted"
            type="checkbox"
            checked={showOnlyHighlighted}
            onChange={handleShowOnlyHighlighted}
            disabled={highlightedNodeNames.length === 0}
          />
          <label htmlFor="chkboxShowOnlyHighlighted">
            Show only highlighted
          </label>
          <input
            id="chkboxHasForceSimulation"
            type="checkbox"
            checked={hasForceSimulation}
            onChange={handleHasForceSimulation}
          />
          <label htmlFor="chkboxHasForceSimulation">Force</label>
          <button
            id="btnClear"
            className="ml-4 rounded-md border bg-gray-950 px-2 py-1 text-gray-200 outline outline-1 outline-gray-500"
            onClick={handleSearchForNodesClick}
            disabled={showOnlyHighlighted}
          >
            Clear
          </button>
        </div>
      </div>

      {/* <div className="content"> */}
      <Diagram
      // highlightedNodeNames={highlightedNodeNames}
      // showOnlyHighlighted={showOnlyHighlighted}
      // invertBackground={invertBackground}
      // hasForceSimulation={hasForceSimulation}
      />
      {/* <div id="info-box">
          <h2 className="title">Diagram</h2>
          <div className="notes" />
          <table className="table" />
          <div className="timestamp" />
        </div> */}
      {/* </div> */}
    </div>
  );
}
