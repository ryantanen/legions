import legions from "../../assets/legions.png";

function HomePage() {
  return (
    <div className="w-full mt-4 flex items-center flex-col justify-center gap-2">
      <img src={legions}></img>
      <h1>Welcome to Legions</h1>

      <a
        href="https://discord.gg/VzcyzyX9Qy"
        className="btn btn-primary mt-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        Join Discord
      </a>
    </div>
  );
}

export default HomePage;
