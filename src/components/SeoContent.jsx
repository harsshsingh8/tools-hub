import { Link } from "react-router-dom";
import { getToolById, getRelatedTools } from "../data/tools";
import { ArrowRight, ChevronDown, HelpCircle, CheckCircle, Info, Wrench } from "lucide-react";
import { useState } from "react";
import AdSense from "./AdSense";

export default function SeoContent({ toolId }) {
  const mainTool = toolId ? getToolById(toolId) : null;
  const related = mainTool ? getRelatedTools(toolId) : [];
  if (!mainTool) return null;

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="mt-12 space-y-10">
      {/* How to Use */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-5 w-5 text-brand-400" />
          <h2 className="text-xl font-semibold text-slate-100">
            How to use {mainTool.title}
          </h2>
        </div>
        <ol className="space-y-3">
          {mainTool.howToUse.map((step, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-slate-800/40 px-4 py-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">
                {i + 1}
              </span>
              <span className="text-sm text-slate-300">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-semibold text-slate-100">Features</h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {mainTool.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/80" />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Ad — Middle of Content */}
      <AdSense slot="8888888888" format="auto" style={{ minHeight: "90px" }} />

      {/* Why Use */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-semibold text-slate-100">
            Why use {mainTool.title}
          </h2>
        </div>
        <p className="rounded-xl bg-slate-800/40 px-4 py-3 text-sm leading-relaxed text-slate-300">
          {mainTool.whyUse}
        </p>
      </section>

      {/* FAQs */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-amber-400" />
          <h2 className="text-xl font-semibold text-slate-100">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-2">
          {mainTool.faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl bg-slate-800/40 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-medium text-slate-200">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3 text-sm text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-100 mb-4">
            Related tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map((rt) => (
              <Link
                key={rt.id}
                to={rt.path}
                className="group flex items-center justify-between rounded-xl bg-slate-800/40 px-4 py-3 transition-all hover:bg-slate-800/70"
              >
                <div className="flex items-center gap-3">
                  <rt.icon className="h-5 w-5 text-brand-400" />
                  <span className="text-sm font-medium text-slate-200">
                    {rt.title}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-400" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
