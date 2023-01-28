import { Component, createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { debounce } from "@solid-primitives/scheduled";
import { GeolocationService } from "../services/Geolocation.service";
import { Geolocation } from "../repositories/Geolocation.repository";
import Map from "../components/map/Map.component";

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
      if (cache.length === 0) return;
      const cachedGeolocation = cache[cache.length - 1];
      setGeolocation(cachedGeolocation.data);
      setQuery(cachedGeolocation.query);
    }
  });

  return (
    <>
      <header class="home__header flex bg-header-pattern bg-center bg-cover bg-no-repeat h-72 max-h-[30vh]">
        <div class="home__header__inner flex flex-col align-center text-center mt-8 mx-auto">
          <h1 class="text-3xl text-white">IP Address Tracker</h1>
          <div class="home__header__input-wrapper flex w-[540px] mt-8">
            <input
              class="home__header__input w-full h-12 px-4 rounded-l-xl"
              placeholder="Search for any IP address or domain"
              type="text"
              onInput={handleInput}
              value={query()}
            ></input>
            <button class="home__header__button bg-black p-4 rounded-r-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14">
                <path
                  fill="none"
                  stroke="#FFF"
                  stroke-width="3"
                  d="M2 1l6 6-6 6"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <Show when={geolocation()}>
        <section class="home__overview flex justify-center absolute left-2/4 -translate-x-2/4 -translate-y-2/4 w-[75vw] z-[800]">
          <div class="home__overview__inner flex bg-white text-black py-8 rounded-xl -top-2/4">
            <div class="home__overview__item px-8 w-1/4 border-r">
              <h6 class="home__overview__item__title text-dark-gray text-sm mb-2 uppercase">
                IP Address
              </h6>
              <h4 class="home__overview__item__value">{geolocation()?.ip}</h4>
            </div>

            <div class="home__overview__item px-8 w-1/4 border-r">
              <h6 class="home__overview__item__title text-dark-gray text-sm mb-2 uppercase">
                Location
              </h6>
              <h4 class="home__overview__item__value">
                {geolocation()?.location.city}, {geolocation()?.location.region}{" "}
                {geolocation()?.location.postalCode}
              </h4>
            </div>

            <div class="home__overview__item px-8 w-1/4 border-r">
              <h6 class="home__overview__item__title text-dark-gray text-sm mb-2 uppercase">
                Timezone
              </h6>
              <h4 class="home__overview__item__value">
                UTC {geolocation()?.location.timezone}
              </h4>
            </div>

            <div class="home__overview__item px-8 w-1/4">
              <h6 class="home__overview__item__title text-dark-gray text-sm mb-2 uppercase">
                ISP
              </h6>
              <h4 class="home__overview__item__value">{geolocation()?.isp}</h4>
            </div>
          </div>
        </section>
      </Show>
      <section class="home__body h-[70vh]  max-h-[70vh]">
        <Map></Map>
      </section>
    </>
  );
};

export default Home;
