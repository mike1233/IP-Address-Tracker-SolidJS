import { Component, createEffect, createSignal, onMount } from "solid-js";
import {
  map,
  tileLayer,
  LatLng,
  Map,
  marker,
  icon,
  layerGroup,
  LayerGroup,
} from "leaflet";
import { Geolocation } from "../../repositories/Geolocation.repository";
import svg from "../../assets/images/icon-location.svg";
import "leaflet/dist/leaflet.css";

const LMap: Component<{ geolocation: Geolocation | null }> = (props) => {
  const [MAP, setMAP] = createSignal<Map | null>(null);
  const [markerGroup, setMarkerGroup] = createSignal<LayerGroup | null>(null);

  const markerIcon = icon({
    iconUrl: svg,
  });

  const setLocation = (g: Geolocation) => {
    MAP()?.setView(new LatLng(g.location.lat, g.location.lng), 18);
    markerGroup()?.clearLayers();
    marker(new LatLng(g.location.lat, g.location.lng), {
      icon: markerIcon,
    }).addTo(markerGroup()!);
  };

  createEffect(() => {
    if (MAP() && props.geolocation) {
      setLocation(props.geolocation);
    }
  });

  onMount(() => {
    setMAP(
      map("map", {
        center: [51.505, -0.09],
        zoom: 13,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        zoomControl: false,
      })
    );

    tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(MAP()!);

    setMarkerGroup(layerGroup().addTo(MAP()!));
  });

  return (
    <>
      <div id="map" class="map h-full w-full" />
    </>
  );
};

export default LMap;
