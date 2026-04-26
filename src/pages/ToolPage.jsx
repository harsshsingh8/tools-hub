import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getToolById } from "../data/tools";
import SeoContent from "../components/SeoContent";
import AdSense from "../components/AdSense";
import NotFoundPage from "./NotFoundPage";

const toolComponents = import.meta.glob("./tools/*.jsx", { eager: true });

export default function ToolPage() {
  const { toolId } = useParams();
  const tool = getToolById(toolId);

  if (!tool) {
    return <NotFoundPage />;
  }

  const componentPath = `./tools/${toolId
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("")}.jsx`;

  const module = toolComponents[componentPath];
  const ToolComponent = module?.default;

  if (!ToolComponent) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Helmet>
        <title>{tool.seoTitle}</title>
        <meta name="description" content={tool.seoDescription} />
        <meta name="keywords" content={tool.keywords.join(", ")} />
        <meta property="og:title" content={tool.seoTitle} />
        <meta property="og:description" content={tool.seoDescription} />
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 animate-fade-in-up">
        {/* Tool Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 glow-brand">
            <tool.icon className="h-7 w-7 text-brand-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl tracking-tight">
            {tool.title}
          </h1>
          <p className="mt-2 text-sm text-slate-400">{tool.description}</p>
        </div>

        {/* Ad — Below Title */}
        <AdSense slot="1234567890" format="auto" style={{ minHeight: "90px" }} />

        {/* Tool Interface */}
        <div className="rounded-2xl glass-strong p-5 sm:p-7 glow-brand-hover transition-all duration-500">
          <ToolComponent />
        </div>

        {/* Ad — After Output */}
        <AdSense slot="0987654321" format="auto" style={{ minHeight: "90px" }} />

        {/* SEO Content */}
        <SeoContent toolId={toolId} />
      </div>
    </>
  );
}
