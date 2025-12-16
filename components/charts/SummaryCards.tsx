"use client";

type Summary = {
  amount: number;
  used: number;
  remaining: number;
};

type Props = {
  opex: Summary;
  capex: Summary;
  total: Summary;
};

function format(n: number) {
  return n.toLocaleString("id-ID");
}

export default function SummaryCards({ opex, capex, total }: Props) {
  const Card = ({ title, data }: { title: string; data: Summary }) => (
    <div className="rounded-xl bg-white p-5 shadow">
      <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-1">Rp {format(data.amount)}</p>
      <div className="mt-2 text-sm text-gray-600">
        Used: Rp {format(data.used)} <br />
        Remaining: Rp {format(data.remaining)}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Total Budget" data={total} />
      <Card title="OPEX" data={opex} />
      <Card title="CAPEX" data={capex} />
    </div>
  );
}
