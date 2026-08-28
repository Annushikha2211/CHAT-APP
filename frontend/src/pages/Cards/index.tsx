
import CardCreator from "./CardCreator";

function CardsPage() {
  return (
    <div className="min-h-screen bg-[#050805] px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Create a Card 🎁
        </h1>

        <p className="mt-2 mb-8 text-[#718078]">
          Create a personalized card
          for someone special.
        </p>

        <CardCreator />
      </div>
    </div>
  );
}

export default CardsPage;