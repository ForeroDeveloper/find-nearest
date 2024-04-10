import { Header, SearchSection } from "./components";
import cityMock from "./assets/images/map.png";

function App() {
  return (
    <div className="h-full bg-neutral" data-theme="mytheme">

      <div className="h-screen overflow-hidden relative w-full">
        <Header />
        <div
          className="flex flex-row w-full gap-2 mt-2 px-16 mb-2"
          style={{ height: "calc(100% - 100px)" }}
        >
          <SearchSection />

          <div className="w-2/5 bg-none">
            <img
              src={cityMock}
              alt=""
              className="rounded-lg h-full"
              width="100%"
              height="100vh" 
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
