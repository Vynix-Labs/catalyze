import BottomNav from "../layout/BottomNav";

const NotFound = () => {
  return (
    <div className="h-svh w-full flex justify-center items-center">
      <div className="max-w-md px-4 w-full">
        <p className="text-[9rem] opacity-80 text-center text-black-300  font-black">
          404
        </p>
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-600">
            Opps what a bummer!
          </h1>
          <p className="text-center text-lg font-semibold text-neutral-600">
            Coming soon...
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default NotFound;
