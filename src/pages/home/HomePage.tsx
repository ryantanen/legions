import legions from "../../assets/legions.png";

function HomePage() {
  return (
    <div className="w-full mt-4 flex items-center flex-col justify-center">
      <img src={legions}></img>
      <h1>Welcome to Legions</h1>
    </div>
  );
}

export default HomePage;
