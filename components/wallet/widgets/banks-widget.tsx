import { Widget } from './widget';

interface Props {
  count: number;
}

export function BanksWidget({ count }: Props) {
  if (count === 0) return null;

  return (
    <Widget title="Ngân hàng">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">Tổng ngân hàng</span>
        <span className="text-sm font-semibold text-slate-900">{count}</span>
      </div>
    </Widget>
  );
}
