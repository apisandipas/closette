import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

function PageSkeleton() {
  return (
    <div className="flex flex-col flex-1 gap-4 p-4 md:px-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <div className="bg-muted mb-2 rounded w-48 h-8" />
          <div className="bg-muted rounded w-96 h-4" />
        </div>
      </div>
      <div className="bg-muted mt-6 rounded-lg w-full h-40" />
      <div className="bg-muted rounded-lg w-full h-40" />
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
    <section className="flex flex-col item-center mb-6">
      {hasHeader && (
        <header className="flex items-center mb-6 border-1">
          <h1 className="font-sans font-bold text-4xl">{pageTitle}</h1>
          {pageHeaderAction && (
            <div className="ml-auto">{pageHeaderAction}</div>
          )}
        </header>
      )}
      {content}
    </section>
  );
}
