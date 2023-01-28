import { Component, onMount } from "solid-js";
import { map, tileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";

const Map: Component = () => {
  onMount(() => {
    const M = map("map", {
      center: [51.505, -0.09],
      zoom: 13,
    });

    tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(M);
  });

  return (
    <>
      <div id="map" class="map h-full w-full" />
    </>
  );
};

export default Map;
