import { Component } from "solid-js";
import { map } from "leaflet";

const Map: Component = () => {
  const M = map("map", {
    center: [51.505, -0.09],
    zoom: 13,
  });
  return (
    <>
      <div id="map" class="map" />
    </>
  );
};

export default Map;
