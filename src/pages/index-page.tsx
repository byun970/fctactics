const formations = [
  { name: "4-2-3-1", winRate: "60.0%", pickRate: "42.8%" },
  { name: "4-2-2-2", winRate: "48.1%", pickRate: "30.8%" },
  { name: "5-2-3", winRate: "49.2%", pickRate: "15.8%" },
  { name: "4-1-2-3", winRate: "20.0%", pickRate: "10.8%" },
];

export default function IndexPage() {
  return (
    <>
      <section className="mb-10">
        <h2 className="mb-3 text-2xl">포메이션 별 승률</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formations.map((formation, idx) => (
            <div key={formation.name} className="rounded bg-gray-100 p-5">
              <div className="font-bold">{formation.name}</div>
              <div>승률 : {formation.winRate}</div>
              <div>픽률 : {formation.pickRate}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-5">
        <h2 className="mb-3 text-2xl">포메이션 별 승률</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formations.map((formation, idx) => (
            <div key={formation.name} className="rounded bg-gray-100 p-5">
              <div className="font-bold">{formation.name}</div>
              <div>승률 : {formation.winRate}</div>
              <div>픽률 : {formation.pickRate}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-5">
        <h2 className="mb-3 text-2xl">포메이션 별 승률</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {formations.map((formation, idx) => (
            <div key={formation.name} className="rounded bg-gray-100 p-5">
              <div className="font-bold">{formation.name}</div>
              <div>승률 : {formation.winRate}</div>
              <div>픽률 : {formation.pickRate}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
