import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../common/StatusBadge';
import {
  X,
  Printer,
  Download,
  Building2,
  CheckCircle2,
  ShieldCheck,
  FileText,
} from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative text-slate-100 my-8"
        >
          {/* Action Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 print:hidden">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-white">Official Tax Invoice Document</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" /> Download PDF / Print
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PDF Invoice Document Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 border border-slate-200 space-y-6 shadow-inner print:p-0 print:border-none">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-extrabold text-sm">
                    LH
                  </div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">LabourHub Enterprise</h1>
                </div>
                <p className="text-xs text-slate-500 mt-1">Workforce Booking Platform GSTIN: 27AAAAA0000A1Z5</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {invoice.paymentStatus?.toUpperCase() || 'PAID'}
                </span>
                <h2 className="text-sm font-bold text-slate-700 mt-2 font-mono">{invoice.invoiceNumber || 'INV-2026-0091'}</h2>
                <p className="text-xs text-slate-500">Date: {new Date(invoice.issueDate || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Billed To & Service Provider Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Billed To (Customer):</span>
                <p className="font-extrabold text-slate-900 text-sm">{invoice.customerName || 'Apex Buildcon Infrastructure Ltd'}</p>
                <p className="text-slate-600">Mumbai, Maharashtra, India • GSTIN Registered</p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider block">Service Provider (Labour):</span>
                <p className="font-extrabold text-slate-900 text-sm">{invoice.labourName || 'Rajesh Kumar (Master Electrician)'}</p>
                <p className="text-slate-600">Certified Grade-A Industrial Trade Technician</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Itemized Work Breakdown</h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 font-semibold">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center">Duration</th>
                    <th className="py-2 text-right">Daily Rate</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">{invoice.workDescription || 'High-Voltage Switchgear Assembly'}</td>
                    <td className="py-3 text-center text-slate-600 font-mono">{invoice.duration || '15 Days'}</td>
                    <td className="py-3 text-right text-slate-600 font-mono">₹{(invoice.dailyRate || 1200).toLocaleString()}</td>
                    <td className="py-3 text-right font-bold text-slate-900 font-mono">
                      ₹{((invoice.dailyRate || 1200) * 15).toLocaleString()}
                    </td>
                  </tr>
                  {invoice.additionalCharges > 0 && (
                    <tr>
                      <td className="py-3 font-semibold text-slate-900">Safety PPE & Equipment Surcharge</td>
                      <td className="py-3 text-center text-slate-600 font-mono">-</td>
                      <td className="py-3 text-right text-slate-600 font-mono">-</td>
                      <td className="py-3 text-right font-bold text-slate-900 font-mono">
                        ₹{invoice.additionalCharges.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculations Summary */}
            <div className="flex justify-end border-t border-slate-300 pt-4">
              <div className="w-full max-w-xs space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold">₹{(invoice.totalAmount || 185000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST Statutory Tax (18%)</span>
                  <span className="font-mono font-semibold">₹{(invoice.taxAmount || 32400).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-300">
                  <span>Grand Total</span>
                  <span className="font-mono text-base text-cyan-700">₹{(invoice.totalAmount || 185000).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer Stamp */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Txn ID: {invoice.transactionId || 'TXN-RZP-992011'}</span>
              <span>Generated digitally via LabourHub Escrow Billing System.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InvoiceModal;
