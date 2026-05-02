import { PageHeader } from "@/components/page-header";
import { cases } from "@/lib/mock-data";
import { fmtMoney } from "@/lib/utils";
import { Plus, Filter, Upload } from "lucide-react";

export default function ReservationsPage() {
  const reservations = cases
    .filter((c) => c.bookingCode && c.hotelName)
    .map((c) => ({
      code: c.bookingCode!,
      hotel: c.hotelName!,
      client: c.clientName,
      checkIn: "2026-05-10",
      checkOut: "2026-05-12",
      roomType: "Deluxe Twin",
      qty: 1,
      total: 480,
      currency: "USD",
      status: c.status,
      caseCode: c.code,
    }));

  return (
    <div>
      <PageHeader
        title="Reservations"
        subtitle={`${reservations.length}건 부킹 · 호텔 컨펌 / 룸타입 / 게스트 통합 뷰`}
        actions={
          <>
            <button className="btn btn-soft text-xs">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="btn btn-soft text-xs">
              <Upload className="w-3 h-3" /> Import CSV
            </button>
            <button className="btn btn-primary text-xs">
              <Plus className="w-3 h-3" /> New Booking
            </button>
          </>
        }
      />

      <div className="p-6">
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-soft border-b border-border">
              <tr className="text-[11px] uppercase tracking-wider text-fg-subtle">
                <th className="text-left px-4 py-2.5 font-medium">Code</th>
                <th className="text-left px-3 py-2.5 font-medium">Client</th>
                <th className="text-left px-3 py-2.5 font-medium">Hotel</th>
                <th className="text-left px-3 py-2.5 font-medium">Check-in</th>
                <th className="text-left px-3 py-2.5 font-medium">Check-out</th>
                <th className="text-left px-3 py-2.5 font-medium">Room</th>
                <th className="text-right px-3 py-2.5 font-medium">Total</th>
                <th className="text-left px-3 py-2.5 font-medium">Status</th>
                <th className="text-left px-4 py-2.5 font-medium">Case</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, i) => (
                <tr key={i} className="table-row">
                  <td className="px-4 py-3 font-mono text-xs text-fg-muted">{r.code}</td>
                  <td className="px-3 py-3">{r.client}</td>
                  <td className="px-3 py-3">{r.hotel}</td>
                  <td className="px-3 py-3 text-xs">{r.checkIn}</td>
                  <td className="px-3 py-3 text-xs">{r.checkOut}</td>
                  <td className="px-3 py-3 text-xs">
                    {r.qty}× {r.roomType}
                  </td>
                  <td className="px-3 py-3 text-right font-mono">
                    {fmtMoney(r.total, r.currency)}
                  </td>
                  <td className="px-3 py-3">
                    <span className="badge badge-neutral text-[10px] font-mono">
                      {r.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-accent">{r.caseCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
