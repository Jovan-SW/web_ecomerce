import { ProductGridSkeleton } from "@/components";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12 lg:py-16 px-3 sm:px-6 lg:px-10">
      <div className="max-w-[1600px] mx-auto">
        <ProductGridSkeleton count={10} showHeader={true} />
      </div>
    </main>
  );
}
