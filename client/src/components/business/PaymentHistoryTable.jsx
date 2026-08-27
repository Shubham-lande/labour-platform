import React from 'react';
import StatusBadge from '../common/StatusBadge';
import GlassCard from '../common/GlassCard';
import { CreditCard, FileText, Lock, IndianRupee, ShieldCheck } from 'lucide-react';

const PaymentHistoryTable = ({ payments = [], onViewInvoice }) => {
  return (
    <GlassCard hover={false} className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" /> Payment & Escrow Transaction History
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit logs of milestone payouts, escrow deposits, and generated tax invoices.
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-bold">{payments.length} Records</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="pb-3 px-3">Date</th>
              <th className="pb-3 px-3">Transaction ID</th>
              <th className="pb-3 px-3">Project / Site</th>
              <th className="pb-3 px-3">Labour Worker</th>
              <th className="pb-3 px-3">Method</th>
              <th className="pb-3 px-3 text-right">Amount</th>
              <th className="pb-3 px-3 text-center">Status</th>
              <th className="pb-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {payments.map((p) => (
              <tr key={p._id || p.transactionId} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-3 text-slate-300 font-sans">
                  {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                </td>
                <td className="py-3 px-3 text-cyan-400 font-bold">{p.transactionId || 'TXN-9901'}</td>
                <td className="py-3 px-3 text-white font-sans font-semibold">
                  {p.project?.name || p.projectName || 'Smart Building Automation'}
                </td>
                <td className="py-3 px-3 text-slate-300 font-sans">{p.labourName || 'Rajesh Kumar'}</td>
                <td className="py-3 px-3 text-slate-400 uppercase text-[11px]">{p.paymentMethod || 'upi_razorpay'}</td>
                <td className="py-3 px-3 text-right font-extrabold text-cyan-400">
                  ₹{(p.amount || 0).toLocaleString()}
                </td>
                <td className="py-3 px-3 text-center font-sans">
                  <StatusBadge status={p.status || 'paid'} />
                </td>
                <td className="py-3 px-3 text-right font-sans">
                  <button
                    onClick={() => onViewInvoice && onViewInvoice(p)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 transition-all inline-flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" /> Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default PaymentHistoryTable;
