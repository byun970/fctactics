const players = [
  { name: "게르트 뮐러", position: "ST" },
  { name: "토마스 뮐러", position: "ST" },
  { name: "해리 케인", position: "ST" },
  { name: "호날두", position: "ST" },
  { name: "즐라탄", position: "ST" },
];

export function TierListPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">선수 티어리스트</h1>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {players.map((player, idx) => (
          <div className="rounded bg-gray-50 p-4">
            {player.name} {player.position}
          </div>
        ))}
      </div>
    </section>
  );
}
