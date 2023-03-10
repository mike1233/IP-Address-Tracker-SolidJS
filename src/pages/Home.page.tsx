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
  let inputRef = null as unknown as HTMLInputElement;

  const getFromCache = (query: string) => {
    const cached = cache.find(
      (item) => item.query.toLowerCase() === query.toLowerCase()
    );
    return cached?.data;
  };

  const handleInput = debounce(async () => {
    setQuery(inputRef.value);

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
  }, 300);

  onMount(async () => {
    const cached = JSON.parse(localStorage.getItem("cache") || "[]");
    setCache(cached);
    handleInput();
  });

  return (
    <>
      <header class="home__header flex bg-header-pattern bg-center bg-cover bg-no-repeat min-h-[300px] laptop:min-h-[unset] h-[40vh] tablet:h-[35vh] laptop:h-72 max-h-[40vh] tablet:max-h-[35vh]">
        <div class="home__header__inner flex flex-col align-center text-center mt-8 mx-auto">
          <h1 class="text-3xl text-white">IP Address Tracker</h1>
          <div class="home__header__input-wrapper flex w-[540px] max-w-[90vw] mt-8">
            <input
              class="home__header__input w-full h-12 px-4 py-4 h-[56px] rounded-l-xl focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Search for any IP address or domain"
              type="text"
              ref={inputRef}
              onInput={handleInput}
              value={query()}
            ></input>
            <button
              class="home__header__button bg-black  hover:bg-very-dark-gray p-4 rounded-r-xl"
              onClick={handleInput}
              aria-label="Search for any IP address or domain"
            >
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
        <section class="home__overview flex justify-center absolute left-2/4 -translate-x-2/4 -translate-y-[30%] laptop:-translate-y-2/4 w-[90vw] laptop:w-[75vw] z-[800]">
          <div class="home__overview__inner flex flex-col laptop:flex-row bg-white text-black text-center laptop:text-left py-8 rounded-xl -top-2/4">
            <div class="home__overview__item px-8 w-full laptop:w-1/4 laptop:border-r">
              <h6 class="home__overview__item__title text-dark-gray text-sm mb-2 uppercase tracking-widest">
                IP Address
              </h6>
              <h4 class="home__overview__item__value mb-4 laptop:mb-0">
                {geolocation()?.ip}
              </h4>
            </div>

            <div class="home__overview__item px-8 w-full laptop:w-1/4 laptop:border-r">
              <h6 class="home__overview__item__title text-dark-gray text-sm mb-2 uppercase tracking-widest">
                Location
              </h6>
              <h4 class="home__overview__item__value mb-4 laptop:mb-0">
                {geolocation()?.location.city}, {geolocation()?.location.region}{" "}
                {geolocation()?.location.postalCode}
              </h4>
            </div>

            <div class="home__overview__item px-8 w-full laptop:w-1/4 laptop:border-r">
              <h6 class="home__overview__item__title text-dark-gray text-sm mb-2 uppercase tracking-widest">
                Timezone
              </h6>
              <h4 class="home__overview__item__value mb-4 laptop:mb-0">
                UTC {geolocation()?.location.timezone}
              </h4>
            </div>

            <div class="home__overview__item px-8 w-full laptop:w-1/4">
              <h6 class="home__overview__item__title text-dark-gray text-sm mb-2 uppercase tracking-widest">
                ISP
              </h6>
              <h4 class="home__overview__item__value">{geolocation()?.isp}</h4>
            </div>
          </div>
        </section>
      </Show>
      <section class="home__body h-[70vh] min-h-[600px]">
        <Map geolocation={geolocation()}></Map>
      </section>
    </>
  );
};

export default Home;
