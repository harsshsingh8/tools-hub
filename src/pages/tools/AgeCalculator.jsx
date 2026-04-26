import { useState, useMemo } from "react";
import { Calculator, Calendar, Clock, Gift, Sparkles } from "lucide-react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);

  const result = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob);
    const target = new Date(toDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (target < birth) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24));

    // Next birthday
    let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < target) {
      nextBirthday.setFullYear(target.getFullYear() + 1);
    }
    const daysUntil = Math.ceil((nextBirthday - target) / (1000 * 60 * 60 * 24));

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfBirth = daysOfWeek[birth.getDay()];

    return { years, months, days, totalDays, daysUntil, dayOfBirth };
  }, [dob, toDate]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-brand-500/60"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Age At Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-brand-500/60"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-brand-500/10 border border-brand-500/20 px-3 py-4 text-center">
              <p className="text-2xl font-bold text-brand-400">{result.years}</p>
              <p className="text-xs text-slate-500 mt-0.5">Years</p>
            </div>
            <div className="rounded-xl bg-brand-500/10 border border-brand-500/20 px-3 py-4 text-center">
              <p className="text-2xl font-bold text-brand-400">{result.months}</p>
              <p className="text-xs text-slate-500 mt-0.5">Months</p>
            </div>
            <div className="rounded-xl bg-brand-500/10 border border-brand-500/20 px-3 py-4 text-center">
              <p className="text-2xl font-bold text-brand-400">{result.days}</p>
              <p className="text-xs text-slate-500 mt-0.5">Days</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-slate-800/40 px-4 py-3">
              <Calendar className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-xs text-slate-500">Total Days Lived</p>
                <p className="text-sm font-semibold text-slate-200">{result.totalDays.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-800/40 px-4 py-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-xs text-slate-500">Day of Birth</p>
                <p className="text-sm font-semibold text-slate-200">{result.dayOfBirth}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-800/40 px-4 py-3">
              <Gift className="h-5 w-5 text-pink-400" />
              <div>
                <p className="text-xs text-slate-500">Next Birthday In</p>
                <p className="text-sm font-semibold text-slate-200">{result.daysUntil} days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-800/40 px-4 py-3">
              <Clock className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-500">Total Months</p>
                <p className="text-sm font-semibold text-slate-200">{result.years * 12 + result.months}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="rounded-xl bg-slate-800/30 px-4 py-8 text-center text-sm text-slate-500">
          Select your date of birth to see your exact age.
        </div>
      )}
    </div>
  );
}
