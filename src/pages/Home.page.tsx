import { Component, createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { debounce } from "@solid-primitives/scheduled";
import { GeolocationService } from "../services/Geolocation.service";
import { Geolocation } from "../repositories/Geolocation.repository";

const Home: Component = () => {
  const [cache, setCache] = createStore<
    {
      query: string;
      data: Geolocation;
    }[]
  >([]);

  const [query, setQuery] = createSignal("");
  const [geolocation, setGeolocation] = createSignal<Geolocation | null>(null);

  const getFromCache = (query: string) => {
    const cached = cache.find(
      (item) => item.query.toLowerCase() === query.toLowerCase()
    );
    return cached?.data;
  };

  const handleInput = debounce(async (e: Event) => {
    setQuery((e.target as HTMLInputElement).value);

    if (query().length > 0) {
      const cached = getFromCache(query());
      if (cached) {
        setGeolocation(cached);
        return;
      }

      try {
        const geolocation = await GeolocationService.getGeolocation(query());
        setCache([...cache, { query: query(), data: geolocation }]);
        localStorage.setItem("cache", JSON.stringify(cache));
        setGeolocation(geolocation);
      } catch (error) {
        console.error(error);
      }
    }
  }, 500);

  onMount(() => {
    const cached = localStorage.getItem("cache");
    if (cached) {
      setCache(JSON.parse(cached));
    }
  });

  return (
    <main>
      <section>
        <h1>Home</h1>
      </section>
      <section>
        <input type="text" onInput={handleInput}></input>
        <Show when={geolocation()}>
          <pre textContent={JSON.stringify(geolocation(), null, 2)}></pre>
        </Show>
      </section>
    </main>
  );
};

export default Home;
