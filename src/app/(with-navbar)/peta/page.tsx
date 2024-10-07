"use client";

import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { boundingExtent } from 'ol/extent';
import 'ol/ol.css';
import { Sidebar, SearchBar } from "@/components";

export default function PetaPage() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const minahasa = fromLonLat([124.8244, 1.4588]);

    // Define the bounding box
    const minBound = fromLonLat([122.932839, 0.226033]);
    const maxBound = fromLonLat([127.797571, 4.834726]);
    const extent = boundingExtent([minBound, maxBound]);

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: minahasa,
        zoom: 10,
        minZoom: 7,
        maxZoom: 18,
        extent: extent, 
      })
    });

    return () => map.setTarget(undefined);
  }, []);

  return (
    <div className="w-full h-screen relative">
      <div ref={mapRef} className="w-full h-full" />
      <Sidebar className="z-40 top-8 bottom-20 max-h-full overflow-y-auto">
        <SearchBar className="mt-20" onSearch={function (query: string): void {
          throw new Error("Function not implemented.");
        }} />
      </Sidebar>
    </div>
  );
}