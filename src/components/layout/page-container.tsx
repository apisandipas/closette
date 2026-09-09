import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

function PageSkeleton() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-4 p-4 md:px-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="bg-muted mb-2 h-8 w-48 rounded" />
          <div className="bg-muted h-4 w-96 rounded" />
        </div>
      </div>
      <div className="bg-muted mt-6 h-40 w-full rounded-lg" />
      <div className="bg-muted h-40 w-full rounded-lg" />
    </div>
  );
}

type PageContainerProps = {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  pageHeaderAction?: React.ReactNode;
  isLoading?: boolean;
};

export default function PageContainer({
  pageTitle,
  pageHeaderAction,
  children,
  isLoading = false,
}: PageContainerProps) {
  const hasHeader = pageTitle || pageHeaderAction;
  const content = isLoading ? <PageSkeleton /> : children;
  return (
    <section className="item-center mb-6 flex flex-col">
      {hasHeader && (
        <header className="mb-6 flex items-center border-1">
          <h1 className="font-sans text-4xl font-bold">{pageTitle}</h1>
          {pageHeaderAction && (
            <div className="ml-auto">{pageHeaderAction}</div>
          )}
        </header>
      )}
      {content}
    </section>
  );
}
